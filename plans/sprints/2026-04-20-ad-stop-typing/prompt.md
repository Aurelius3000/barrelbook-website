# RALPH Prompt — Ad 1: Stop Typing

You are executing the "Stop Typing" Instagram ad sprint for BarrelBook. Work iteratively: pick the next unpassed PRD item, implement it, verify against its acceptanceCriteria, mark `passes: true`, then proceed.

## Project context

BarrelBook is a bourbon collector iOS app. This is a 15-second vertical (9:16) Instagram ad demonstrating the snap → review → save flow. It must feel like a sharp product demo, not a brand film. All assets come from this repo — no live-action shoot.

### Hard constraints (brief no-go list)
- One bottle only (Blanton's). Never imply multi-bottle scanning.
- No social, community, ratings, reviews, trading, or export.
- No unsupported pricing claims.
- Total runtime: 12–15 seconds.
- First message must land within 1 second.

### Brand
- Primary: `#D2691E` (bourbon/copper)
- Accent: `#C97C3A`
- Dark: `#0A0A0A` (bg) / `#1A1A1A` (surface)
- Text primary: `#FFFFFF`
- Font: Inter Bold (SF Pro fallback)

### Repo assets to use
- `public/BB-Image2 Small.png` — Shot 1 hero
- `public/iphone17pro1.png` — Shot 3 device mock
- `public/App Scan Blantons1.png`..`Blantons5.png` — Shots 4–6
- `public/Catalog1.png`, `public/Catalog2.png` — Shot 7
- `public/BarrelBook Logo Mark.png` — Shot 8 end card

### Caption text (exact)
1. Stop typing bourbon bottle details.
2. Notes. Spreadsheets. Manual entry.
3. Use BarrelBook instead.
4. Snap the bottle.
5. Review. Edit if needed.
6. Save it.
7. Now it's in your catalog.
8. BarrelBook for iPhone / Snap. Review. Save. / Download BarrelBook

### Voiceover (version A)
"Still typing bourbon bottle details by hand? With BarrelBook, just snap the bottle, review the details, and save it to your catalog."

## Verification commands

Per-shot render sanity:
```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate,codec_name -show_entries format=duration scripts/ad_stop_typing/out/shots/shotNN.mp4
```

Full pipeline:
```bash
bash scripts/ad_stop_typing/build.sh
```

Final masters check:
```bash
for f in output/ads/*.mp4; do
  echo "== $f =="
  ffprobe -v error -show_entries format=duration:stream=width,height,codec_type -of default=nw=1 "$f"
done
```

## Guidelines

- Do NOT fabricate UI. Every in-app frame must be a real screenshot from `public/`.
- Keep motion subtle. Ken Burns zoom at most 1.15x. Crossfades 200–300ms.
- Captions sit in the middle 50% of the vertical frame. Never in top 22% or bottom 28%.
- Intermediate MP4s: 30fps, yuv420p, libx264 crf 18. Final master: same codec, faststart.
- Audio: 48kHz stereo AAC 192kbps. Music ducked ~−12 dB under VO.
- On failure, keep the item `passes: false` and leave a note in `progress.txt`.
- Do not reuse clips from existing `App Preview *.mov` / `.mp4` — this ad has its own edit.

## Completion

When all 19 items have `passes: true`, update `progress.txt` status to Complete and write `SUMMARY.md` summarizing files delivered, decisions, and recommended next steps (real VO recording, licensed music, live-action Shots 1–3 replacement).
