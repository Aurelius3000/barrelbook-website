# Task 4: Verify Build and Copy

## Description

Run the relevant Next.js verification and confirm the rendered/source output contains the new `125+` messaging and no stale `100+` App Store count.

## Decisions

- Use `npm run build` as the primary verification command.
- Use `rg` against `src` and build output for targeted copy checks.

## Code Snippets

```bash
npm run build
rg "125\\+|reviewCount.*126|APP_STORE_RATING_DISPLAY_COUNT" src .next
```

