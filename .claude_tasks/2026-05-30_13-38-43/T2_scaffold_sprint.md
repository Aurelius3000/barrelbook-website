# Task 2: Scaffold Sprint

## Description
Create the required Ralph sprint scaffold before changing any implementation or
media assets.

## Files
- `plans/adapters/Codex.sh`
- `plans/sprints/2026-05-30-video-quality-refresh/prd.json`
- `plans/sprints/2026-05-30-video-quality-refresh/progress.txt`
- `plans/sprints/2026-05-30-video-quality-refresh/prompt.md`

## Decisions
- Use `VQR` as the sprint item prefix.
- Keep sprint items focused on asset replacement and verification.
- Use the Codex CLI adapter requested by the local Ralph workflow.

## Verification
- `test -x plans/adapters/Codex.sh`
- `test -f plans/sprints/2026-05-30-video-quality-refresh/prd.json`
- `test -f plans/sprints/2026-05-30-video-quality-refresh/progress.txt`
- `test -f plans/sprints/2026-05-30-video-quality-refresh/prompt.md`
