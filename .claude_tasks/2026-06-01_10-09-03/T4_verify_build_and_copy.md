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

## Verification Results

- Initial `npm run build` failed because the clean worktree did not have `node_modules`; ran `npm ci` from `package-lock.json`.
- `npm ci` completed and reported existing audit findings: 4 moderate and 5 high vulnerabilities.
- `npm run build` passed with Next.js 16.1.0.
- Focused rendered-output checks passed:
  - source exact count is `126`
  - source display count is `125+`
  - rendered public copy uses `125+`
  - rendered aria label uses `125+`
  - rendered JSON-LD `reviewCount` is `126`
  - stale rendered `100+ App Store ratings` copy is absent
