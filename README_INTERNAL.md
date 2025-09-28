# Internal Notes / Contributor Guide

## Overview

This project is a Sanity + Next.js e-commerce schema starter with demo APIs, validation, and a sample cart workflow.

## Stack Summary

- Sanity v3 schemas under `schemas/`
- Validation via Zod under `validation/`
- Demo Next.js app in `example-nextjs/`
- Lightweight auth mock (Bearer `userId:role`)
- Rate limiting (in-memory) + naive CSRF check
- Transactional order create (inventory decrement + discount usage)

## Auth Mock

Header format:

```
Authorization: Bearer <userId>:<role>
```

Roles: `customer`, `seller`, `admin`.
Never use this in production; replace with a real session / JWT mechanism.

## Rate Limiting

In-memory map keyed by IP + route. Resets on restart. For production: plug in Redis (Upstash) or another centralized store.

## CSRF

Very naive cookie/header token pairing. Replace with a framework-level approach when adding real auth.

## Directory Structure Quick Map

```
schemas/              # Sanity content models
validation/           # Zod schemas for runtime validation
example-nextjs/       # Demo app (pages router)
  pages/api/...       # Demo API endpoints
src/index.ts          # Library export entry
scripts/seed.ts       # Optional sample data seeding
```

## Running Locally

Install root + example app dependencies:

```
npm install
cd example-nextjs
npm install
cd ..
```

Run typecheck & tests:

```
npm run typecheck
npm test
```

Run demo frontend:

```
cd example-nextjs
npm run dev
```

## Seeding Data

Create a `.env.local` in `example-nextjs/` with project id/dataset + optional token. Then:

```
npm run seed
```

(Uses `SANITY_API_TOKEN` if present.)

## Code Generation (Planned)

Add `@sanity/codegen` for typed documents. Currently not integrated; see roadmap.

## Testing Strategy

- Unit: pricing / discount logic in `tests/`
- TODO: add API route tests by mocking Sanity client.

## Suggested Future Improvements

- Extract shared pricing to `lib/commerce/pricing.ts`
- Add wishlist mutations + UI state sync
- Add NextAuth for real sessions
- Redis-backed rate limiting
- Code generation for GROQ types

## Contribution Guidelines (See CONTRIBUTING.md)

- Keep schemas additive (avoid breaking field renames without aliasing)
- Write tests for pricing/order changes
- Document new environment variables in `.env.example`

Happy building!
