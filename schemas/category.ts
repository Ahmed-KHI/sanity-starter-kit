import { defineType, defineField, StringRule, SlugRule } from 'sanity';

export const category = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule: StringRule) => rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (rule: SlugRule) => rule.required() }),
        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'description', title: 'Description', type: 'text' })
    ]
});
