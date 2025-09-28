import { useState, useCallback } from 'react';
import { useCart } from '../components/CartContext';

interface CreateOrderInput {
    items: { productId: string; quantity: number }[];
    discountCode?: string;
}

export function useCreateOrder() {
    const { state, clear } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const create = useCallback(async (discountCode?: string) => {
        setLoading(true); setError(null); setOrderId(null);
        const snapshot = [...state.lines];
        // optimistic clear
        clear();
        try {
            const res = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf': 'demo' }, body: JSON.stringify({ items: snapshot.map(i => ({ productId: i.productId, quantity: i.quantity })), discountCode }) });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setOrderId(data.orderId);
            return data;
        } catch (e: any) {
            // rollback by rehydrating snapshot (simple approach: push items back individually)
            const api = useCart() as any;
            snapshot.forEach(i => api.addItem?.({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity }));
            setError(e.message || 'Failed to create order');
            throw e;
        } finally {
            setLoading(false);
        }
    }, [state.lines, clear]);

    return { create, loading, error, orderId };
}
