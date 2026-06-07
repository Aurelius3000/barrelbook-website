# Task 3: Update Review Count

## Description

Update the centralized App Store rating constants from the current production values to the new 135+ public messaging.

## Code Snippet

```ts
// RC135-003: keep structured data exact while public copy uses a durable rounded count.
export const APP_STORE_RATING_COUNT = "135";
export const APP_STORE_RATING_DISPLAY_COUNT = "135+";
```

## Decisions

- Keep `APP_STORE_RATING_COUNT` numeric for structured data.
- Keep `APP_STORE_RATING_DISPLAY_COUNT` rounded for public copy and accessibility text.
- Leave `APP_STORE_RATING_VALUE` unchanged unless verification reveals it has changed.

## Result

Updated `src/lib/app-store.ts` so the website renders `135+` in public copy and `135` in structured data.
