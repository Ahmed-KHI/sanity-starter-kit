import { defineType, defineField, ReferenceRule, NumberRule, StringRule } from 'sanity';

export const order = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        defineField({ name: 'user', title: 'User', type: 'reference', to: [{ type: 'user' }], validation: (rule: ReferenceRule) => rule.required() }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [{
                type: 'object',
                name: 'orderLine',
                fields: [
                    { name: 'productRef', title: 'Product', type: 'reference', to: [{ type: 'product' }], validation: (rule: any) => rule.required() },
                    { name: 'quantity', title: 'Quantity', type: 'number', validation: (rule: any) => rule.required().min(1) },
                    { name: 'price', title: 'Unit Price (Snapshot)', type: 'number', validation: (rule: any) => rule.required().min(0), description: 'Price per unit at time of purchase' },
                    { name: 'lineTotal', title: 'Line Total', type: 'number', validation: (rule: any) => rule.required().min(0), description: 'Unit price * quantity at purchase time' }
                ]
            }]
        }),
        defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }, validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'paymentStatus', title: 'Payment Status', type: 'string', options: { list: ['paid', 'unpaid', 'refunded'] }, validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'subtotal', title: 'Subtotal', type: 'number', validation: (rule: NumberRule) => rule.required().min(0) }),
        defineField({ name: 'discount', title: 'Discount', type: 'reference', to: [{ type: 'discount' }] }),
        defineField({ name: 'discountAmount', title: 'Discount Amount', type: 'number' }),
        defineField({ name: 'totalAmount', title: 'Total Amount', type: 'number', validation: (rule: NumberRule) => rule.required().min(0) }),
        defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() })
    ]
});
