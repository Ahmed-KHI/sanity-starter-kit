import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sanityClient } from '../../utils/sanityClient';
import { getAuth, requireUserMatch, rateLimit, verifyCsrf } from '../../utils/apiUtils';
import { OrderInputSchema } from '../../validation/orderSchema';

// Basic discount validation: fetch discount doc by code if provided
async function resolveDiscount(code: string) {
    const now = new Date().toISOString();
    return sanityClient.fetch(`*[_type == "discount" && code == $code && (!defined(validFrom) || validFrom <= $now) && (!defined(validTo) || validTo >= $now)][0]{_id, discountType, value, usageLimit, code}`, { code, now });
}

const OrderRequestSchema = OrderInputSchema.pick({ userId: true, products: true, discountCode: true }).extend({
    paymentStatus: z.enum(['paid', 'unpaid', 'refunded']).default('unpaid')
});

type OrderRequest = z.infer<typeof OrderRequestSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }
    // Rate limit
    const rl = rateLimit(`create-order:${req.socket.remoteAddress}`);
    if (!rl.allowed) return res.status(429).json({ error: 'Rate limit exceeded', retryAfterMs: rl.retryAfter });
    // CSRF
    if (!verifyCsrf(req)) return res.status(403).json({ error: 'CSRF token invalid' });
    // Auth
    const auth = getAuth(req);
    try {
        const parsed = OrderRequestSchema.parse(req.body);
        requireUserMatch(auth, parsed.userId);

        // Fetch product current prices & compute total
        const productIds = parsed.products.map(p => p.productId);
        const products = await sanityClient.fetch(`*[_type == "product" && _id in $ids]{ _id, price, inventory }`, { ids: productIds });
        const priceMap = new Map(products.map((p: any) => [p._id, p.price]));
        const inventoryMap = new Map(products.map((p: any) => [p._id, p.inventory as any]));

        let subtotal = 0;
        const lineItems = parsed.products.map(line => {
            const price = priceMap.get(line.productId) as number | undefined;
            if (price == null) {
                throw new Error(`Product not found: ${line.productId}`);
            }
            const inventory = inventoryMap.get(line.productId) as any;
            if (inventory && typeof inventory.quantity === 'number' && line.quantity > inventory.quantity) {
                throw new Error(`Insufficient stock for product ${line.productId}`);
            }
            const lineTotal = price * line.quantity;
            subtotal += lineTotal;
            return {
                _type: 'orderLine',
                productRef: { _type: 'reference', _ref: line.productId },
                quantity: line.quantity,
                price: price,
                lineTotal
            };
        });

        let discountAmount = 0;
        let discountRef: any = undefined;
        let discountDoc: any = undefined;
        if (parsed.discountCode) {
            const discount = await resolveDiscount(parsed.discountCode);
            if (!discount) {
                return res.status(400).json({ error: 'Invalid discount code' });
            }
            // Per-user usage: count previous orders referencing this discount
            const priorUsage = await sanityClient.fetch(`count(*[_type == "order" && user._ref == $uid && discount._ref == $did])`, { uid: parsed.userId, did: discount._id });
            if (typeof discount.usageLimit === 'number' && discount.usageLimit <= 0) {
                return res.status(400).json({ error: 'Discount code usage limit reached' });
            }
            if (typeof discount.usageLimit === 'number' && priorUsage >= discount.usageLimit) {
                return res.status(400).json({ error: 'User discount usage limit reached' });
            }
            if (discount.discountType === 'percentage') {
                discountAmount = subtotal * (discount.value / 100);
            } else if (discount.discountType === 'fixed') {
                discountAmount = discount.value;
            }
            discountRef = { _type: 'reference', _ref: discount._id };
            discountDoc = discount;
        }

        const totalAmount = Math.max(0, subtotal - discountAmount);

        const mutation = {
            _type: 'order',
            user: { _type: 'reference', _ref: parsed.userId },
            products: lineItems,
            status: 'pending',
            paymentStatus: parsed.paymentStatus,
            subtotal,
            discount: discountRef,
            discountAmount: discountAmount || undefined,
            totalAmount,
            createdAt: new Date().toISOString()
        };

        // Build transactional mutations: order create + inventory decrements + discount decrement
        const txnMutations: any[] = [{ create: mutation }];
        // inventory decrements
        for (const line of parsed.products) {
            txnMutations.push({
                patch: {
                    id: line.productId,
                    dec: { 'inventory.quantity': line.quantity }
                }
            });
        }
        if (discountDoc && typeof discountDoc.usageLimit === 'number') {
            txnMutations.push({
                patch: {
                    id: discountDoc._id,
                    dec: { usageLimit: 1 }
                }
            });
        }

        const result: any = await sanityClient.transaction(txnMutations).commit();
        const createdOrder = result.results?.find((r: any) => r.operation === 'create');
        const orderId = createdOrder?.document?._id || createdOrder?._id;

        // Low stock warnings
        const lowStock: string[] = [];
        for (const line of parsed.products) {
            const inv = inventoryMap.get(line.productId) as any;
            if (inv && typeof inv.lowStockAlert === 'number') {
                const remaining = (inv.quantity ?? 0) - line.quantity;
                if (remaining <= inv.lowStockAlert) {
                    lowStock.push(line.productId);
                }
            }
        }

        return res.status(201).json({ orderId, totalAmount, subtotal, discountAmount, lowStock });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: err.errors });
        }
        return res.status(400).json({ error: err.message || 'Unknown error' });
    }
}
