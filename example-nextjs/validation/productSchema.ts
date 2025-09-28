import { z } from 'zod';

export const ProductInputSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    categoryId: z.string().min(1),
    price: z.number().nonnegative(),
    priceWithoutDiscount: z.number().nonnegative().optional(),
    badge: z.enum(['Sale', 'New Arrival', 'Featured']).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    dimensions: z.object({
        height: z.number().nonnegative().optional(),
        width: z.number().nonnegative().optional(),
        depth: z.number().nonnegative().optional()
    }).optional(),
    inventory: z.object({
        quantity: z.number().int().nonnegative(),
        lowStockAlert: z.number().int().nonnegative().optional()
    }).optional()
});

export type ProductInput = z.infer<typeof ProductInputSchema>;