# Task 2: Push To Production

## Description
Publish the rating-copy hotfix through the normal GitHub PR and Vercel production
deployment path.

## Decisions
- Branch: `codex/update-app-store-rating-copy`.
- Base: current `origin/main`.
- Use a normal PR merge to `main`; do not deploy a stale branch directly.

## Verification
- PR check passes.
- Vercel production deployment for the merge commit is ready.
- Live homepage contains the updated rating copy.
