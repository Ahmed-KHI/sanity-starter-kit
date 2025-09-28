import { defineType, defineField, StringRule } from 'sanity';

// NOTE: `wishlist` reference array removed in favor of standalone `wishlist` document
// with `items[]` for clarity & scalability. If migrating existing data that used
// the embedded array, copy those references into new wishlist docs per user.
export const user = defineType({
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule: StringRule) => rule.required() }),
        defineField({
            name: 'role', title: 'Role', type: 'string', options: {
                list: [
                    { title: 'Customer', value: 'customer' },
                    { title: 'Admin', value: 'admin' },
                    { title: 'Seller', value: 'seller' }
                ]
            }, validation: (rule: StringRule) => rule.required()
        }),
        defineField({ name: 'orders', title: 'Orders', type: 'array', of: [{ type: 'reference', to: [{ type: 'order' }] }] })
    ]
});
