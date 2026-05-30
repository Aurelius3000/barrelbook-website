# Task 4: Verify Build And Smoke

## Description
Run project checks and a homepage smoke test after replacing the video assets.

## Verification
- `npm run build`
- Local homepage smoke test with a dev server.
- Confirm the rendered homepage still references the same `/videos/*.mp4` URLs.

## Decisions
- Do not change homepage layout unless verification reveals a concrete layout
  problem separate from video resolution.

## Result
- `npm ci` was required in the new worktree before building because `node_modules/` was absent.
- `npm run build` passed with Next.js 16.1.0.
- Local dev server: `http://127.0.0.1:3109/`
- Playwright smoke confirmed all four existing `/videos/*.mp4` URLs returned `206` with `content-type: video/mp4`.
- Browser video metadata reported `720px` intrinsic width for all four videos.
- Screenshot artifact for local inspection: `output/playwright/video-quality-homepage.png` (not committed).
