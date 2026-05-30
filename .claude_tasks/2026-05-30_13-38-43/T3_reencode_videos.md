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

## Result
- `public/videos/bottle-scanning.mp4`: `720x1558`, `30.633333s`, no audio, `4.8M`
- `public/videos/pick-a-pour.mp4`: `720x1560`, `20.700000s`, no audio, `1.3M`
- `public/videos/shared-shelves.mp4`: `720x1558`, `20.666667s`, no audio, `3.1M`
- `public/videos/spotlight-and-flights.mp4`: `720x1560`, `31.333333s`, no audio, `2.6M`

## Command Shape
Used temporary `ffmpeg-static`/`ffprobe-static` tooling outside the repo:

```bash
ffmpeg -i <source.mov> -map 0:v:0 -vf scale=720:-2 -an \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -movflags +faststart -map_metadata -1 <dest.mp4>
```
