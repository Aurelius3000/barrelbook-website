# Public Want List Empty State

## Objective

Fix the public Want-list page so valid active shares with zero recipient-visible items render as active empty lists instead of the neutral unavailable page.

## Scope

- Update `src/app/w/[token]/page.tsx` parsing/rendering only.
- Preserve invalid/revoked/unavailable behavior.
- Keep no-store/noindex behavior unchanged.
- Do not change the public Cloud Function contract.

## Verification Commands

```sh
npm run build
```

## Constraints

- Public links remain bearer-access and no-login viewable.
- The website must not reveal whether invalid tokens exist.
- Empty active shares may display the list title and description because the backend already returned a valid active snapshot for the bearer token.

## Git Hygiene Checklist

- Run `git status --short --branch` before starting and before completion.
- Use path-scoped staging only if staging is explicitly approved.
- Do not push, merge, rebase, reset, or deploy production without explicit approval.
