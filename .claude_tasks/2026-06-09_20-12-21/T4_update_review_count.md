# Task 4: Update Review Count

## Description

Update exact structured review count for the two new reviews while preserving the public rounded `135+` display.

## Decision

- Change `APP_STORE_RATING_COUNT` from `135` to `137`.
- Leave `APP_STORE_RATING_DISPLAY_COUNT` as `135+`.
- Leave `APP_STORE_RATING_VALUE` as `4.8`.

## Result

Updated `src/lib/app-store.ts` so JSON-LD uses exact `reviewCount` 137 while public social-proof copy remains `135+`.
