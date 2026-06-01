# Task 3: Update Review Count Copy

## Description

Update the public website messaging from `100+` App Store ratings/reviews to `125+`, using the user-provided current count of 126 as the source of truth.

## Decisions

- Keep public copy rounded and durable as `125+`.
- If exact structured-data constants are present, update the exact count to `126`.
- Preserve the existing App Store URL, rating value, component layout, and visual treatment.

## Code Snippets

```ts
// REV-001: keep structured data exact while public copy uses a durable rounded count.
export const APP_STORE_RATING_COUNT = "126";
export const APP_STORE_RATING_DISPLAY_COUNT = "125+";
```

## Outcome

- Updated the exact structured-data review count to `126`.
- Updated the rounded public count to `125+`.
- Left the App Store URL, rating value, component layout, and rating-link markup unchanged.
