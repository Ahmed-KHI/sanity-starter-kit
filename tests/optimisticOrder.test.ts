// Lightweight logic simulation for optimistic rollback without React Testing Library
interface CartItem { productId: string; name: string; price: number; quantity: number }

function optimisticFlow(createOk: boolean) {
    const original: CartItem[] = [{ productId: 'p1', name: 'Test', price: 10, quantity: 2 }];
    let cart: CartItem[] = [...original];
    // optimistic clear
    const snapshot = [...cart];
    cart = [];
    if (!createOk) {
        // rollback
        cart = snapshot;
    }
    return { cart, original };
}

describe('optimistic order logic', () => {
    it('retains empty cart on success', () => {
        const { cart } = optimisticFlow(true);
        expect(cart.length).toBe(0);
    });
    it('restores cart on failure', () => {
        const { cart, original } = optimisticFlow(false);
        expect(cart).toHaveLength(original.length);
        expect(cart[0].productId).toBe('p1');
    });
});

