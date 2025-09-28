import { describe, it, expect } from '@jest/globals';

// Lightweight unit-style test of order line accumulation logic
// Mirrors a subset of /api/create-order without network.

interface Product { _id: string; price: number; inventory?: { quantity: number } }
interface Line { productId: string; quantity: number }

function buildLines(lines: Line[], products: Product[]){
  const priceMap = new Map(products.map(p => [p._id, p.price]));
  const invMap = new Map(products.map(p => [p._id, p.inventory]));
  let subtotal = 0; const out: any[] = [];
  for (const l of lines){
    const price = priceMap.get(l.productId);
    if (price == null) throw new Error('Product not found: '+l.productId);
    const inv = invMap.get(l.productId);
    if (inv && typeof inv.quantity === 'number' && l.quantity > inv.quantity) throw new Error('Insufficient stock');
    const lineTotal = price * l.quantity; subtotal += lineTotal; out.push({ productRef: l.productId, quantity: l.quantity, price, lineTotal });
  }
  return { lineItems: out, subtotal };
}

describe('create-order core assembly', () => {
  it('computes subtotal and line totals', () => {
    const products: Product[] = [
      { _id: 'p1', price: 10, inventory: { quantity: 5 } },
      { _id: 'p2', price: 4 }
    ];
    const { lineItems, subtotal } = buildLines([
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 3 }
    ], products);
    expect(subtotal).toBe(10*2 + 4*3);
    expect(lineItems[0].lineTotal).toBe(20);
    expect(lineItems[1].lineTotal).toBe(12);
  });
  it('throws when stock insufficient', () => {
    const products: Product[] = [ { _id: 'p1', price: 10, inventory: { quantity: 1 } } ];
    expect(() => buildLines([{ productId: 'p1', quantity: 2 }], products)).toThrow('Insufficient stock');
  });
  it('throws when product missing', () => {
    expect(() => buildLines([{ productId: 'x', quantity: 1 }], [])).toThrow('Product not found');
  });
});