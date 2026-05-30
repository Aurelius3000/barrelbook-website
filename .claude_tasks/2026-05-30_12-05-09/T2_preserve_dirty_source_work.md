# Task 2: Preserve Dirty Source Work

## Goal
Preserve unpublished paid-conversion and creator-promo source work on a dedicated safety branch without pushing or deploying.

## Planned Structure
- Branch: `codex/preserve-paid-conversion-instrumentation-20260530`.
- Commit 1: source/product changes, required local instructions, Ralph infra, and required creator assets.
- Commit 2: generated/local artifacts only if any intentionally remain in Git preservation after external archiving.

## Decisions
- Keep production untouched: no `git push`, no Vercel deploy, no alias changes.
- Preserve source work in Git history before moving generated artifacts out of the repo.
- Archive bulky generated artifacts outside the repo rather than committing them.

## Status
Pending execution.
