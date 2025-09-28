import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import { rateLimit, getAuth, verifyCsrf } from '../../utils/apiUtils';

// In-memory fallback (dev/demo) when no token or write denied.
// Not for production use; resets on server restart.
const memoryWishlists: Record<string, Set<string>> = {};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yourProjectId';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const token = process.env.SANITY_API_TOKEN;
const client = createClient({ projectId, dataset, apiVersion: '2025-09-01', useCdn: false, token });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    // rate limit
    const rl = rateLimit(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress}:wishlist-toggle`);
    if (!rl.allowed) return res.status(429).json({ error: 'Rate limit', retryAfter: rl.retryAfter });
    if (!verifyCsrf(req)) return res.status(403).json({ error: 'Bad CSRF token' });
    const auth = getAuth(req);
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Missing productId' });
    const userId = auth.userId;

    // If no token, immediately use memory mode (demo)
    const useMemory = !token || projectId === 'yourProjectId';

    const wishlistId = `wishlist-${userId}`;
    const wishlist = useMemory ? null : await client.fetch(`*[_type=="wishlist" && _id=="${wishlistId}"][0]{_id, items[]{_key, product->{_id}}}`);

    let isAdded = false;
    try {
        if (useMemory) {
            if (!memoryWishlists[userId]) memoryWishlists[userId] = new Set();
            if (memoryWishlists[userId].has(productId)) {
                memoryWishlists[userId].delete(productId);
                isAdded = false;
            } else {
                memoryWishlists[userId].add(productId);
                isAdded = true;
            }
            return res.json({ ok: true, wished: isAdded, mode: 'memory', remaining: rl.remaining });
        }

        if (!wishlist) {
            if (!token) return res.status(500).json({ error: 'Missing SANITY_API_TOKEN for write operation' });
            // Ensure user document exists to avoid 409 reference error
            const existingUser = await client.fetch(`*[_type=="user" && _id==$id][0]{_id}`, { id: userId });
            if (!existingUser) {
                await client.create({ _id: userId, _type: 'user', name: 'Demo User', email: 'demo@example.com', role: 'customer' });
            }
            await client.create({ _id: wishlistId, _type: 'wishlist', user: { _type: 'reference', _ref: userId }, items: [{ _key: productId, _type: 'wishlistItem', product: { _type: 'reference', _ref: productId } }] });
            isAdded = true;
        } else {
            const exists = wishlist.items?.some((i: any) => i.product?._id === productId);
            if (exists) {
                await client
                    .patch(wishlistId)
                    .unset([`items[_key=="${productId}"]`])
                    .commit();
                isAdded = false;
            } else {
                await client
                    .patch(wishlistId)
                    .setIfMissing({ items: [] })
                    .insert('after', 'items[-1]', [{ _key: productId, _type: 'wishlistItem', product: { _type: 'reference', _ref: productId } }])
                    .commit();
                isAdded = true;
            }
        }
        return res.json({ ok: true, wished: isAdded, mode: 'sanity', remaining: rl.remaining });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Wishlist mutation error', {
            statusCode: err?.statusCode,
            message: err?.message,
            responseBody: err?.responseBody?.slice?.(0, 400)
        });
        if (err?.statusCode === 403) {
            return res.status(403).json({ error: 'Sanity write denied (missing or insufficient token scope). Provide a token with create/update permissions in SANITY_API_TOKEN.' });
        }
        // Fallback to memory mode if mutation fails unexpectedly
        if (!memoryWishlists[userId]) memoryWishlists[userId] = new Set();
        if (memoryWishlists[userId].has(productId)) {
            memoryWishlists[userId].delete(productId);
            isAdded = false;
        } else {
            memoryWishlists[userId].add(productId);
            isAdded = true;
        }
        return res.status(200).json({ ok: true, wished: isAdded, mode: 'memory-fallback', warning: 'Sanity mutation failed; using in-memory wishlist', remaining: rl.remaining });
    }
}
