# Task 1: Update App Store Rating Copy

## Description
Replace the stale homepage claim of `24 five-star ratings` with current App
Store-backed rating copy.

## Current Source
- Apple listing showed `4.8` from `116 Ratings` on 2026-05-30.

## Decisions
- Use exact values for structured data: `ratingValue=4.8`, `reviewCount=116`.
- Use durable marketing copy in the hero: `4.8 stars from 100+ App Store ratings`.
- Keep the App Store link and existing star visual.

## Verification
- `npm run build`
- Confirm rendered homepage text includes `4.8 stars from 100+ App Store ratings`.
- Confirm JSON-LD includes exact `4.8` and `116` values.

## Result
- Updated centralized constants in `src/lib/app-store.ts`.
- Updated `AppStoreRatingLink` text and accessibility label.
- `npm run build` passed.
- Generated homepage contains `4.8 stars from 100+ App Store ratings`.
- Generated JSON-LD contains `ratingValue: 4.8` and `reviewCount: 116`.
