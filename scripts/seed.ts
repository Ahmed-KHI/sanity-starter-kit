import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yourProjectId';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN; // optional for write

if (!projectId || projectId === 'yourProjectId') {
    console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID first.');
    process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2025-09-01', token, useCdn: false });

async function seed() {
    const categories = [
        { _type: 'category', name: 'Apparel', slug: { _type: 'slug', current: 'apparel' } },
        { _type: 'category', name: 'Accessories', slug: { _type: 'slug', current: 'accessories' } }
    ];

    const catIds: string[] = [];
    for (const c of categories) {
        const created = await client.createIfNotExists({ ...c, _id: `seed-${c.slug.current}` });
        catIds.push(created._id);
    }

    const products = [
        { name: 'Basic Tee', price: 25, badge: 'Featured' },
        { name: 'Canvas Tote', price: 40 },
        { name: 'Hoodie', price: 60, badge: 'New Arrival' }
    ];

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        await client.createIfNotExists({
            _id: `seed-product-${i}`,
            _type: 'product',
            name: p.name,
            slug: { _type: 'slug', current: p.name.toLowerCase().replace(/\s+/g, '-') },
            category: { _type: 'reference', _ref: catIds[i % catIds.length] },
            price: p.price,
            inventory: { quantity: 100, lowStockAlert: 10 },
            features: ['Great quality', 'Durable', 'Eco friendly']
        });
    }

    console.log('Seed complete.');
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
