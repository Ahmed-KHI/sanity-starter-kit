import React from "react";
import Link from "next/link";
import { getProducts, getCategories } from "../utils/sanityClient";
import { CartProvider, useCart } from "../components/CartContext";
import { GetServerSideProps } from "next";

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: 8,
      }}
    >
      {product.images?.length ? (
        <div style={{ marginBottom: 12 }}>
          {/* show first image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]?.asset?.url}
            alt={product.name}
            style={{
              width: "100%",
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: 6,
              background: '#fafafa',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            marginBottom: 12,
            width: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9',
            color: '#64748b',
            fontSize: 12,
            borderRadius: 6,
            border: '1px dashed #cbd5e1'
          }}
        >No image</div>
      )}
      <h3>
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
      </h3>
      {product.badge && (
        <span
          style={{
            background: "#111",
            color: "#fff",
            padding: "2px 6px",
            fontSize: 12,
          }}
        >
          {product.badge}
        </span>
      )}
      <p>{product.category}</p>
      <p>
        {product.priceWithoutDiscount &&
          product.priceWithoutDiscount > product.price && (
            <span
              style={{
                textDecoration: "line-through",
                color: "#777",
                marginRight: 8,
              }}
            >
              ${product.priceWithoutDiscount}
            </span>
          )}
        <strong>${product.price}</strong>
      </p>
      <button
        onClick={() =>
          addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
          })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}

function CartSummary() {
  const { state, subtotal, clear } = useCart();
  if (state.lines.length === 0)
    return <div style={{ margin: "1rem 0" }}>Cart empty</div>;
  return (
    <div
      style={{
        margin: "1rem 0",
        padding: "1rem",
        background: "#f8f8f8",
        borderRadius: 8,
      }}
    >
      <strong>
        Cart ({state.lines.length} items) – Subtotal: ${subtotal.toFixed(2)}
      </strong>
      <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem" }}>
        {state.lines.map((l) => (
          <li key={l.productId}>
            {l.name} x {l.quantity} (${(l.price * l.quantity).toFixed(2)})
          </li>
        ))}
      </ul>
      <button onClick={clear}>Clear Cart</button>
    </div>
  );
}

interface HomePageProps {
  products: any[];
  categories: any[];
  error?: string;
  wishlistIds: string[];
}

export default function HomePage({ products, categories, error, wishlistIds }: HomePageProps) {
  return (
    <CartProvider>
      <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>Storefront Demo</span>
          <span style={{ fontSize: 14, background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
            Wishlist: {wishlistIds.length}
          </span>
        </h1>
        {error && (
          <p style={{ background: '#fee', padding: '0.75rem', border: '1px solid #f99' }}>
            {error}
          </p>
        )}
        {(!error && products.length === 0 && categories.length === 0) && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '1rem', borderRadius: 6, marginBottom: '1.25rem' }}>
            <strong>No products or categories found.</strong>
            <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 6 }}>
              <p style={{ margin: '4px 0' }}>Likely causes:</p>
              <ul style={{ margin: '4px 0 8px 1.1rem', padding: 0 }}>
                <li>Seed script not run yet (<code>npm run seed</code> from project root)</li>
                <li>Using a different dataset than you seeded (current: <code>{process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}</code>)</li>
                <li>Project ID in <code>.env.local</code> differs from Studio (current: <code>{process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not-set'}</code>)</li>
              </ul>
              <p style={{ margin: 0 }}>Run seed, then refresh this page. If still empty, verify documents exist in Studio or run a GROQ query in a Node script.</p>
            </div>
          </div>
        )}
        <CartSummary />
        <section>
          <h2>Categories</h2>
          <ul>
            {categories.map((c: any) => (
              <li key={c._id}>{c.name}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Products</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: "1rem",
            }}
          >
            {products.map((p: any) => {
              const wished = wishlistIds.includes(p._id);
              return (
                <div key={p._id} style={{ position: 'relative' }}>
                  {wished && (
                    <div style={{ position: 'absolute', top: 6, right: 6, background: '#1e3a8a', color: '#fff', padding: '2px 6px', fontSize: 11, borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                      ★
                    </div>
                  )}
                  <ProductCard product={p} />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </CartProvider>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    // Fetch wishlist items for demo user (hard-coded same id as in client actions)
    let wishlistIds: string[] = [];
    try {
      const { sanityClient } = await import('../utils/sanityClient');
      if (sanityClient) {
        const wishlist = await sanityClient.fetch(`*[_type=="wishlist" && user._ref==$uid][0]{items[]{product->{_id}}}`, { uid: 'demo-user-1' });
        if (wishlist?.items?.length) {
          wishlistIds = wishlist.items.map((i: any) => i.product?._id).filter(Boolean);
        }
      }
    } catch (_) {
      // ignore fetch failure (likely placeholder project id or network)
    }
    return { props: { products, categories, wishlistIds } };
  } catch (e: any) {
    return { props: { products: [], categories: [], wishlistIds: [], error: e?.message || 'Failed to load data' } };
  }
};
