# Contributing

Thanks for your interest in improving the Sanity E‑Commerce Starter.

## Development Setup

```
npm install
cd example-nextjs && npm install && cd ..
npm run build
npm test
```

## Branching

- Create feature branches: `feat/<topic>`
- Use conventional commits (e.g., `feat(order): add idempotency key support`).

## Pull Requests

Checklist:

- [ ] Tests pass (`npm test`)
- [ ] Typecheck passes (`npm run typecheck`)
- [ ] Updated README / README_INTERNAL / .env.example if config or env changed
- [ ] Added or updated tests for logic changes

## Coding Guidelines

- Prefer pure functions for pricing & discount logic
- Avoid introducing runtime-only dependencies into schema layer
- Keep the demo auth simplistic; don’t extend into a pseudo production system here—link to real-world patterns instead

## Schemas

- Use descriptive field titles
- Provide descriptions for non-obvious fields
- Minimize unbounded arrays without need

## Testing

Add unit tests under `tests/`. For API tests, mock the Sanity client.

## Release Process (Maintainers)

1. Update CHANGELOG.md
2. Bump version in `package.json`
3. Tag `vX.Y.Z`
4. Publish (if public)

## Roadmap Tags

Use labels: `enhancement`, `discussion`, `breaking-risk`, `good-first-issue`.

## License

By contributing you agree your work is MIT licensed.
