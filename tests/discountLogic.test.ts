import { describe, it, expect } from '@jest/globals';

interface Discount { discountType: 'percentage' | 'fixed'; value: number }

function computeDiscount(subtotal: number, discount?: Discount) {
    if (!discount) return { discountAmount: 0, total: subtotal };
    let discountAmount = 0;
    if (discount.discountType === 'percentage') discountAmount = subtotal * (discount.value / 100);
    else discountAmount = discount.value;
    const total = Math.max(0, subtotal - discountAmount);
    return { discountAmount, total };
}

describe('computeDiscount', () => {
    it('percentage', () => {
        const { discountAmount, total } = computeDiscount(500, { discountType: 'percentage', value: 15 });
        expect(Math.round(discountAmount)).toBe(75);
        expect(total).toBe(425);
    });
    it('fixed', () => {
        const { discountAmount, total } = computeDiscount(80, { discountType: 'fixed', value: 30 });
        expect(discountAmount).toBe(30);
        expect(total).toBe(50);
    });
    it('no discount', () => {
        const { discountAmount, total } = computeDiscount(42);
        expect(discountAmount).toBe(0);
        expect(total).toBe(42);
    });
});
