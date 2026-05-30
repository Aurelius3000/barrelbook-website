# Task 1: Record Baseline

## Goal
Record the Git, Vercel, and live-route baseline before touching any local dirty work.

## Baseline Evidence
- Current branch before cleanup: `codex/paid-conversion-instrumentation`.
- `HEAD`, local `main`, local `origin/main`, and remote `origin/main` all resolved to `ba37f7a754ab70d67e1d3460eb18bd85bd188420`.
- Vercel production alias `https://www.barrelbook.app` resolved to deployment `dpl_A8P5pfwLhtv8FknAEYcJQkUg8BFt`.
- Vercel deployment URL: `https://barrelbook-website-armg47jpc-pete-petereillycs-projects.vercel.app`.
- Vercel target/status: `production`, `Ready`.
- Vercel created time: `Wed Apr 22 2026 20:49:00 GMT-0400`.

## Live Route Checks
- `/` returned `200`.
- `/p/fnf` returned `200`.
- `/blackshirt` returned `404`.
- `/thebourbontrail` returned `404`.
- `/bottles/testBottle123` returned `404`.
- `/apple-app-site-association` returned `200`.

## Decision
Treat `origin/main` at `ba37f7a754ab70d67e1d3460eb18bd85bd188420` as the safe production-equivalent base for the bottle-link worktree.
