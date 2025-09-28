# Changelog

All notable changes to this project will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and this project adheres (loosely) to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.1] - 2025-09-28
### Added
- Health check script (`scripts/health-check.ts`)
- CI workflow (lint, typecheck, tests, coverage) & CodeQL scan
- Release workflow for tag-based npm publish
- Create order line assembly test (`tests/createOrder.test.ts`)
### Changed
- README: tagline, You’ll Learn section, roadmap table, minimal API clarification
- Removed recipe endpoints (discount preview, inventory adjust, payment status, orders listing) from lean distribution
- User schema: removed embedded `wishlist` reference array in favor of standalone wishlist document
### Removed
- Deprecated recipe API route implementations (now only order & wishlist remain)

## [0.1.0] - 2025-09-27
### Added
- Initial schemas: Product, Category, Order, User, Discount, Wishlist
- Zod validation for products & orders
- Demo Next.js frontend (product list/detail, cart context)
- Transactional order creation endpoint (inventory decrement + optional discount)
- Seed script & discount logic tests
- Naive auth (Bearer userId:role), CSRF & rate limit placeholders
- Wishlist toggle API & optimistic UI

[Unreleased]: https://github.com/Ahmed-KHI/sanity-starter-kit/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Ahmed-KHI/sanity-starter-kit/compare/v0.1.0...v0.1.1
