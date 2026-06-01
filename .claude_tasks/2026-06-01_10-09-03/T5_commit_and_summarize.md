# Task 5: Commit and Summarize

## Description

Review the scoped diff, commit the final website change, and create the required task-folder summary.

## Decisions

- Keep commits scoped: setup first, product copy second.
- Do not include unrelated files or changes from the original checkout.

## Code Snippets

```bash
git status --short
git diff --stat
```

## Final Diff Review

- Source change is limited to `src/lib/app-store.ts`.
- `AppStoreRatingLink` and homepage JSON-LD consume the updated constants without direct edits.
- Ralph/task bookkeeping files document the plan, implementation, and verification.

## Outcome

- Created `SUMMARY.md`.
- Marked `REV-002` passing and sprint status complete.
- Prepared the final commit for the review-count refresh.
