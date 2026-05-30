# Bottle Link Fallback Sprint Prompt

Implement exactly one PRD item per Ralph iteration. Keep the branch scoped to
the bottle-link fallback and do not bring in preserved paid-conversion or
creator-promo WIP from other branches.

## Verification Command

Run this before marking an item as passing:

```bash
npm run lint && npm run build && npm run test:promo
```

If an item only changes sprint bookkeeping and the command was already run
cleanly for the relevant code state, note that in `progress.txt`; otherwise run
the full command.

## Product Constraints

- The website route is a handoff/fallback page, not a public bottle page.
- Do not fetch from Firebase, Firestore, OpenAI, app APIs, or any account
  service.
- Do not render bottle details, bottle names, notes, image URLs, pricing,
  valuation, user IDs, account IDs, owner data, or private metadata.
- The page should explain that the bottle opens only if it belongs to the
  signed-in BarrelBook account.
- Render both actions everywhere: primary `Open in BarrelBook`, secondary
  `Get BarrelBook`. Do not add user-agent detection.
- Use shared `APP_STORE_APP_ID` and `APP_STORE_URL` from `src/lib/app-store.ts`.
- Build bottle app links as `barrelbook://bottles/{encodeURIComponent(trimmedId)}`.
- Invalid-looking but non-empty IDs should not crash.
- If a route id trims to an empty string, use `notFound()`.
- Keep `/bottles/` out of `sitemap.ts`.

## Technical Context

- This is a Next.js 16 app-router site. Existing dynamic routes use async
  `params` props.
- Existing AASA payload is centralized in
  `src/lib/apple-app-site-association.ts` and served from both
  `/apple-app-site-association` and `/.well-known/apple-app-site-association`.
- Existing lightweight route checks live in `scripts/test-promo-foundation.mjs`.

## Safety

- Do not push, deploy, or run Vercel deployment commands.
- Do not use `git reset --hard`, `git clean`, or destructive checkout commands.
- Commit each completed PRD item with the required `<ITEM-ID>: <short title>`
  message format.
