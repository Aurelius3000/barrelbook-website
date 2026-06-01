# Task 1: Isolate Worktree and Scaffold Sprint

## Description

Preserve the existing dirty `barrelbook-website` checkout by creating a clean sibling worktree from `origin/main`, then scaffold the required task log and Ralph sprint before changing website copy.

## Decisions

- Use a sibling worktree at `/Users/petereilly2021/Projects/barrelbook-website-review-count-125`.
- Use branch `codex/update-review-count-125` based on `origin/main`.
- Keep setup changes separate from product copy changes so the existing paid-conversion/ads branch remains untouched.

## Code Snippets

```bash
git worktree add -b codex/update-review-count-125 /Users/petereilly2021/Projects/barrelbook-website-review-count-125 origin/main
```

