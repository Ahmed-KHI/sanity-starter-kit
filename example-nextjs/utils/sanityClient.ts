import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const hasValidConfig = projectId && projectId.length > 0 && !demoMode;

export const sanityClient = hasValidConfig ? createClient({
    projectId: projectId!,
    dataset,
    apiVersion: '2024-09-01',
    useCdn: true,
}) : null;

export const getProducts = async () => {
    if (!hasValidConfig || !sanityClient) {
        return [
            { _id: 'demo-1', name: 'Demo Product A', slug: 'demo-product-a', price: 25, category: 'Demo Category', inventory: { quantity: 5 }, description: 'This is demo product A showcasing the e-commerce functionality.' },
            { _id: 'demo-2', name: 'Demo Product B', slug: 'demo-product-b', price: 40, category: 'Demo Category', inventory: { quantity: 3 }, description: 'This is demo product B demonstrating the product catalog.' },
            { _id: 'demo-3', name: 'Demo Product C', slug: 'demo-product-c', price: 60, category: 'Demo Category', inventory: { quantity: 8 }, description: 'This is demo product C showing the complete starter kit.' }
        ];
    }
    const query = `*[_type == "product"]{ _id, name, 'slug': slug.current, price, priceWithoutDiscount, badge, tags, 'category': category->name, images[]{asset->{url}}, inventory } | order(_createdAt desc)`;
    return sanityClient.fetch(query);
};

export const getProductBySlug = async (slug: string) => {
    if (!hasValidConfig || !sanityClient) {
        const demoProducts = await getProducts();
        return demoProducts.find((p: any) => p.slug === slug) || demoProducts[0];
    }
    const query = `*[_type == "product" && slug.current == $slug][0]{ _id, name, 'slug': slug.current, price, priceWithoutDiscount, badge, tags, 'category': category->name, images[]{asset->{url}}, description, features, dimensions, inventory }`;
    return sanityClient.fetch(query, { slug });
};

export const getCategories = async () => {
    if (!hasValidConfig || !sanityClient) {
        return [{ _id: 'demo-cat', name: 'Demo Category', slug: 'demo-category' }];
    }
    const query = `*[_type == "category"]{ _id, name, 'slug': slug.current } | order(name asc)`;
    return sanityClient.fetch(query);
};
