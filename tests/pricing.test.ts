import { describe, it, expect } from '@jest/globals';

function applyDiscount(subtotal: number, discount: { type: 'percentage' | 'fixed'; value: number }) {
  if (discount.type === 'percentage') return Math.max(0, subtotal - subtotal * (discount.value / 100));
  return Math.max(0, subtotal - discount.value);
}

describe('discount application', () => {
  it('applies percentage discount', () => {
    const total = applyDiscount(200, { type: 'percentage', value: 10 });
    expect(total).toBe(180);
  });
  it('applies fixed discount', () => {
    const total = applyDiscount(50, { type: 'fixed', value: 20 });
    expect(total).toBe(30);
  });
  it('never returns negative', () => {
    const total = applyDiscount(20, { type: 'fixed', value: 50 });
    expect(total).toBe(0);
  });
});
