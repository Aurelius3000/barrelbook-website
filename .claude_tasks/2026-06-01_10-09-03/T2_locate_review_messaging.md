# Task 2: Locate Review Messaging

## Description

Find all website references to the App Store rating/review count so the update is complete and scoped.

## Decisions

- Start with repository search for `100+`, `App Store ratings`, `reviewCount`, and `ratingValue`.
- Treat `src/lib/app-store.ts` as the likely source of truth because the display count is centralized there.
- Avoid redesigning the rating link or homepage.

## Findings

- `src/lib/app-store.ts` contains `APP_STORE_RATING_COUNT = "116"` and `APP_STORE_RATING_DISPLAY_COUNT = "100+"`.
- `src/components/AppStoreRatingLink.tsx` renders the public rating link and accessibility label from those constants.
- `src/app/page.tsx` uses `APP_STORE_RATING_COUNT` and `APP_STORE_RATING_VALUE` for SoftwareApplication JSON-LD.
- No product-copy edit is needed outside the centralized constants unless verification reveals generated stale output.

## Code Snippets

```bash
rg -n "100\\+|App Store ratings|reviews|reviewCount|ratingValue" src
```
