# Task 3: Re-encode Videos

## Description
Replace the four low-resolution website MP4s with higher-resolution web MP4s
generated from the existing MOV originals.

## Source Mapping
- `public/Bottle Scanning 2-14-26.mov` -> `public/videos/bottle-scanning.mp4`
- `public/Pick-a-Pour.mov` -> `public/videos/pick-a-pour.mp4`
- `public/SharedShelves.mov` -> `public/videos/shared-shelves.mp4`
- `public/Spotlight and Flights.mov` -> `public/videos/spotlight-and-flights.mp4`

## Decisions
- Target about `720px` wide so videos stay sharp in `300-320px` phone frames on retina displays.
- Preserve aspect ratio.
- Use browser-compatible H.264 MP4 output.
- Strip audio because the website plays these as muted looping product videos.
- Keep existing public URLs and React component code unchanged.

## Verification
- Confirm the new MP4s are about `720px` wide.
- Confirm durations still match the MOV sources.
- Confirm file sizes remain web-appropriate.
