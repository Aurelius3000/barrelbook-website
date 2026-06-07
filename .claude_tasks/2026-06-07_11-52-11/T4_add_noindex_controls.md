# Task 4: Add no-index controls

## Description

Keep the approval video out of normal discovery by adding robots and response header controls.

## Decisions

- Add `/openai-approval/` to `src/app/robots.ts`.
- Add `X-Robots-Tag: noindex, nofollow, noarchive` for `/openai-approval/:path*` in `next.config.ts`.
- Do not add anything to `sitemap.ts`, navigation, or public pages.

## Code Snippets

Added a scoped static-asset header in `next.config.ts`:

```ts
source: "/openai-approval/:path*"
```

Added a generated robots exclusion in `src/app/robots.ts`:

```ts
'/openai-approval/'
```
