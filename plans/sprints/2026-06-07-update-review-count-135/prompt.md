# RALPH Sprint: Update Review Count To 135+

You are RALPH, an autonomous implementation agent working through this small BarrelBook website sprint. Follow the generic RALPH protocol in `plans/ralph_prompt.md`, with the sprint-specific rules below.

## Context

The production website currently shows `4.8 stars from 125+ App Store ratings`. `origin/main` centralizes this in `src/lib/app-store.ts`:

```ts
export const APP_STORE_RATING_COUNT = "126";
export const APP_STORE_RATING_DISPLAY_COUNT = "125+";
```

Update the public-facing count to `135+` while keeping JSON-LD structured data numeric.

## Verification Commands

```bash
npm run build
rg -n "135\\+|reviewCount|APP_STORE_RATING" src .next/server/app
```

## Domain-Specific Guidelines

- Preserve `APP_STORE_RATING_VALUE = "4.8"` unless separately verified as changed.
- Keep `APP_STORE_RATING_COUNT` exact and numeric for structured data.
- Keep `APP_STORE_RATING_DISPLAY_COUNT` rounded for visible copy and aria labels.
- Do not touch unrelated homepage, ad, promo, or deep-link content.
- Do not commit secrets or environment files.

## Constraints

- Work must stay on `codex/update-review-count-135`.
- The original checkout at `/Users/petereilly2021/Projects/barrelbook-website` has unrelated state and should remain untouched.
- This is a production copy update, so prefer the smallest diff.

## Launch Commands

```bash
# Iterative (runs up to 25 iterations until all items pass):
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph.sh plans/sprints/2026-06-07-update-review-count-135 25

# Single iteration:
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph_once.sh plans/sprints/2026-06-07-update-review-count-135
```

