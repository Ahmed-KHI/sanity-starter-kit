import { defineType, defineField, ReferenceRule } from 'sanity';

// NOTE: Schema aligned with application code which expects an `items` array of objects
// each containing a `product` reference and stored with a stable `_key` equal to productId.
// Previously this schema used `products` (array of references) which caused wishlist
// queries/mutations to fail silently or drop fields. Update ensures toggle API works.
export const wishlist = defineType({
    name: 'wishlist',
    title: 'Wishlist',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (rule: ReferenceRule) => rule.required()
        }),
        defineField({
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [
                defineField({
                    name: 'wishlistItem',
                    title: 'Wishlist Item',
                    type: 'object',
                    fields: [
                        defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }], validation: (r: ReferenceRule) => r.required() })
                    ]
                })
            ]
        })
    ]
});
