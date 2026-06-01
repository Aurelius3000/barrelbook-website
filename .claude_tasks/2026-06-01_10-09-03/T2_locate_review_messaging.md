# Task 2: Locate Review Messaging

## Description

Find all website references to the App Store rating/review count so the update is complete and scoped.

## Decisions

- Start with repository search for `100+`, `App Store ratings`, `reviewCount`, and `ratingValue`.
- Treat `src/lib/app-store.ts` as the likely source of truth because the display count is centralized there.
- Avoid redesigning the rating link or homepage.

## Code Snippets

```bash
rg -n "100\\+|App Store ratings|reviews|reviewCount|ratingValue" src
```

