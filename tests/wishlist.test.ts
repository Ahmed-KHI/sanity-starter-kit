// Unit-level simulation of wishlist toggling logic (without network)
interface Wishlist { items: string[] }

function toggle(list: Wishlist, productId: string): { wished: boolean; list: Wishlist } {
    const exists = list.items.includes(productId);
    return exists
        ? { wished: false, list: { items: list.items.filter(i => i !== productId) } }
        : { wished: true, list: { items: [...list.items, productId] } };
}

describe('wishlist toggle logic', () => {
    it('adds when not present', () => {
        const { wished, list } = toggle({ items: [] }, 'a');
        expect(wished).toBe(true);
        expect(list.items).toContain('a');
    });
    it('removes when present', () => {
        const { wished, list } = toggle({ items: ['a'] }, 'a');
        expect(wished).toBe(false);
        expect(list.items).not.toContain('a');
    });
});
