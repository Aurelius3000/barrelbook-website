# Video Quality Refresh Sprint Prompt

Use this sprint to replace low-resolution website MP4s with sharper web encodes
from the existing high-resolution MOV originals.

## Context

- The current `public/videos/*.mp4` files are `220x480`, which is too small for
  the `300-320px` phone-frame render size on retina displays.
- The MOV originals in `public/` are the source of truth and are much higher
  resolution.
- The homepage and promo routes already reference stable `/videos/*.mp4` URLs.

## Source Mapping

- `public/Bottle Scanning 2-14-26.mov` -> `public/videos/bottle-scanning.mp4`
- `public/Pick-a-Pour.mov` -> `public/videos/pick-a-pour.mp4`
- `public/SharedShelves.mov` -> `public/videos/shared-shelves.mp4`
- `public/Spotlight and Flights.mov` -> `public/videos/spotlight-and-flights.mp4`

## Implementation Constraints

- Keep public URLs unchanged.
- Preserve aspect ratio.
- Target about `720px` source width.
- Produce browser-compatible H.264 MP4 output.
- Strip audio; these are muted looping product videos.
- Do not change React components unless verification proves a separate layout
  issue.
- Do not push, deploy, or alter Vercel aliases.

## Verification Commands

```bash
# Metadata: dimensions, duration, and bitrate
for f in public/videos/*.mp4; do
  echo "$f"
  mdls -name kMDItemPixelWidth -name kMDItemPixelHeight -name kMDItemDurationSeconds -name kMDItemTotalBitRate "$f"
done

# Confirm no audio tracks are present
for f in public/videos/*.mp4; do
  echo "$f"
  avconvert --source "$f" --preset PresetPassthrough --output /tmp/ralph-video-check.m4v --replace --verbose 2>&1 | rg -i "audio|video|track" || true
done

# Build
npm run build

# Homepage smoke, after starting a local server
npm run dev -- --hostname 127.0.0.1 --port 3109
```

Smoke-test the homepage at `http://127.0.0.1:3109/` and verify the existing
`/videos/*.mp4` URLs are still used.
