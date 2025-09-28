import { defineType, defineField, StringRule, SlugRule, ReferenceRule, NumberRule } from 'sanity';

export const product = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (rule: SlugRule) => rule.required() }),
        defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
        defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (rule: ReferenceRule) => rule.required() }),
        defineField({ name: 'price', title: 'Price', type: 'number', validation: (rule: NumberRule) => rule.required().min(0) }),
        defineField({ name: 'priceWithoutDiscount', title: 'Original Price', type: 'number', description: 'Original price before discount', validation: (rule: NumberRule) => rule.min(0) }),
        defineField({ name: 'badge', title: 'Badge', type: 'string', options: { list: ['Sale', 'New Arrival', 'Featured'] } }),
        defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] }),
        defineField({
            name: 'dimensions',
            title: 'Dimensions',
            type: 'object',
            fields: [
                { name: 'height', title: 'Height (cm)', type: 'number' },
                { name: 'width', title: 'Width (cm)', type: 'number' },
                { name: 'depth', title: 'Depth (cm)', type: 'number' }
            ]
        }),
        defineField({
            name: 'inventory',
            title: 'Inventory',
            type: 'object',
            fields: [
                { name: 'quantity', title: 'Quantity', type: 'number', validation: (rule: any) => rule.min(0) },
                { name: 'lowStockAlert', title: 'Low Stock Alert', type: 'number', description: 'Notify when stock is at or below this number', validation: (rule: any) => rule.min(0) }
            ]
        })
    ]
});
