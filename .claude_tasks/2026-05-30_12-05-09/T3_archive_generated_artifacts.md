# Task 3: Archive Generated Artifacts

## Goal
Move generated/local-only artifacts out of the repo to keep the bottle-link worktree clean while preserving the files.

## Archive Target
`/Users/petereilly2021/Projects/barrelbook-website-archive/2026-05-30-dirty-work/`

## Planned Artifacts
- `.skill-evals/`
- `ads/`
- loose video/media files generated for ads or tests
- `playwright-report/`
- local skill draft files
- stray generated files
- ad helper scripts not part of website source

## Decisions
- Write a manifest before moving files.
- Use `mv` into the archive; do not delete.
- Do not use `git clean`, `git reset --hard`, or destructive checkout commands.

## Result
- Wrote `MANIFEST-before-move.md` before moving files.
- Moved generated/local artifacts into `/Users/petereilly2021/Projects/barrelbook-website-archive/2026-05-30-dirty-work/`.
- Wrote `MANIFEST-after-move.md` after moving files.
- Did not use `git clean`, `git reset --hard`, or destructive checkout commands.

## Status
Completed.
