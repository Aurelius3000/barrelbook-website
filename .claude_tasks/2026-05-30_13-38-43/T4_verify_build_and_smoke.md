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
