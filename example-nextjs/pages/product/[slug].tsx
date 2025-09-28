import React from "react";
import { GetServerSideProps } from "next";
import { getProductBySlug } from "../../utils/sanityClient";
import Link from "next/link";
import ClientProductActions from "./clientActions";

interface ProductPageProps {
  product: any | null;
}

export default function ProductPage({ product }: ProductPageProps) {
  if (!product) return <div style={{ padding: "2rem" }}>Not found</div>;
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <p>
        <Link href="/">← Back</Link>
      </p>
      {product.images?.length ? (
        <div style={{ maxWidth: 420, marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]?.asset?.url}
            alt={product.name}
            style={{ width: '100%', objectFit: 'cover', borderRadius: 8, background: '#fafafa' }}
          />
        </div>
      ) : (
        <div style={{
          maxWidth: 420,
          marginBottom: 24,
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
          color: '#64748b',
          fontSize: 14,
          borderRadius: 8,
          border: '1px dashed #cbd5e1'
        }}>No image</div>
      )}
      <h1>{product.name}</h1>
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
      {product.features?.length > 0 && (
        <section>
          <h2>Features</h2>
          <ul>
            {product.features.map((f: string) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}
      <ClientProductActions product={product} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  try {
    const product = await getProductBySlug(slug);
    return { props: { product: product || null } };
  } catch (e) {
    return { props: { product: null } };
  }
};
