import { defineType, defineField, StringRule, NumberRule } from 'sanity';

export const discount = defineType({
    name: 'discount',
    title: 'Discount / Promotion',
    type: 'document',
    fields: [
        defineField({ name: 'code', title: 'Code', type: 'string', validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'discountType', title: 'Discount Type', type: 'string', options: { list: ['percentage', 'fixed'] }, validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'value', title: 'Value', type: 'number', validation: (rule: NumberRule) => rule.required().min(0) }),
        defineField({ name: 'validFrom', title: 'Valid From', type: 'datetime' }),
        defineField({ name: 'validTo', title: 'Valid To', type: 'datetime' }),
        defineField({ name: 'usageLimit', title: 'Usage Limit', type: 'number', description: 'Maximum times this code can be used', validation: (rule: NumberRule) => rule.min(0) })
    ]
});
