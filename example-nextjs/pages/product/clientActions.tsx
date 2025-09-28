"use client";
import React, { useState } from "react";
import { useCart } from "../../components/CartContext";

// Helper to ensure the demo security headers are present.
function buildHeaders(userId: string) {
  // Ensure we have a CSRF cookie; if not set one (dev only convenience)
  if (typeof document !== 'undefined' && !document.cookie.includes('csrfToken=')) {
    document.cookie = 'csrfToken=devtoken; path=/';
  }
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'devtoken',
    'Authorization': `Bearer ${userId}:customer`
  } as Record<string, string>;
}

async function toggleWishlist(productId: string, setWished: (v: boolean) => void, userId: string, revert: () => void) {
  try {
    const res = await fetch('/api/wishlist-toggle', {
      method: 'POST',
      headers: buildHeaders(userId),
      body: JSON.stringify({ productId })
    });
    if (!res.ok) {
      revert();
      return;
    }
    const data = await res.json();
    setWished(data.wished);
  } catch (e) {
    revert();
  }
}

export default function ClientProductActions({ product }: { product: any }) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const userId = 'demo-user-1'; // Demo hard-coded user id. Replace with real auth integration.

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
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
      <button
        onClick={() => {
          // Optimistic UI toggle
          setWished(prev => !prev);
          toggleWishlist(product._id, setWished, userId, () => setWished(prev => !prev));
        }}
      >
        {wished ? '★ In Wishlist (click to remove)' : '☆ Add to Wishlist'}
      </button>
    </div>
  );
}
