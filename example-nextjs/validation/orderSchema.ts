import { z } from 'zod';

export const OrderLineSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative()
});

export const OrderInputSchema = z.object({
    userId: z.string().min(1),
    products: z.array(OrderLineSchema).min(1),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
    paymentStatus: z.enum(['paid', 'unpaid', 'refunded']).default('unpaid'),
    totalAmount: z.number().nonnegative(),
    discountCode: z.string().optional()
});

export type OrderInput = z.infer<typeof OrderInputSchema>;