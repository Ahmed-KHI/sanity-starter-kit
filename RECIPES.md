# Recipes & Optional Enhancements

The starter ships in a minimal mode. Removed recipe API routes (discount preview, inventory adjust, payment status, orders listing) can be reintroduced from git history if needed. Only the order creation and wishlist toggle remain by default.

## Current Optional Endpoint
Wishlist Toggle (`example-nextjs/pages/api/wishlist-toggle.ts`)
- Demonstrates per-user document pattern + optimistic UI.
- Delete if you only want product + cart + order demo.

## Previously Included (Now Removed for Lean Core)
- Discount preview endpoint
- Inventory adjust endpoint
- Payment status update endpoint
- Orders listing endpoint

## Security Placeholders
Rate limiting & CSRF helpers in `example-nextjs/utils/apiUtils.ts` are illustrative only.

## Type Generation Strategies
Run `npm run codegen` (official) or `npm run codegen:custom` if binary fails. A minimal fallback will still emit basic types.

## Upgrade Ideas
- Real auth/session layer (NextAuth, Clerk, custom JWT)
- Redis/Upstash rate limiting
- Payment provider webhooks updating orders
- Variant & merchandising models (brand, collections, merchandising rules)

## Contributing New Recipes
Keep additions small and self‑contained. Document in this file with: purpose, file path, removal impact.

---
Open an issue with `recipe-request` to propose new ones.
