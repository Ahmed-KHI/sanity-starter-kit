import { createClient } from '@sanity/client';

const placeholder = 'yourProjectId';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || placeholder;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const isPlaceholder = projectId === placeholder;

export const sanityClient = !isPlaceholder ? createClient({
    projectId,
    dataset,
    apiVersion: '2024-09-01',
    useCdn: true,
}) : null as any;

export const getProducts = async () => {
    if (isPlaceholder) {
        return [
            { _id: 'demo-1', name: 'Demo Product A', slug: 'demo-product-a', price: 25, category: 'Category', inventory: { quantity: 0 } },
            { _id: 'demo-2', name: 'Demo Product B', slug: 'demo-product-b', price: 40, category: 'Category', inventory: { quantity: 0 } }
        ];
    }
    const query = `*[_type == "product"]{ _id, name, 'slug': slug.current, price, priceWithoutDiscount, badge, tags, 'category': category->name, images[]{asset->{url}}, inventory } | order(_createdAt desc)`;
    return sanityClient.fetch(query);
};

export const getProductBySlug = async (slug: string) => {
    if (isPlaceholder) {
        return { _id: 'demo-1', name: 'Demo Product A', slug: 'demo-product-a', price: 25, category: 'Category', description: 'Replace NEXT_PUBLIC_SANITY_PROJECT_ID to load real data.' };
    }
    const query = `*[_type == "product" && slug.current == $slug][0]{ _id, name, 'slug': slug.current, price, priceWithoutDiscount, badge, tags, 'category': category->name, images[]{asset->{url}}, description, features, dimensions, inventory }`;
    return sanityClient.fetch(query, { slug });
};

export const getCategories = async () => {
    if (isPlaceholder) {
        return [{ _id: 'demo-cat', name: 'Demo Category', slug: 'demo-category' }];
    }
    const query = `*[_type == "category"]{ _id, name, 'slug': slug.current } | order(name asc)`;
    return sanityClient.fetch(query);
};
