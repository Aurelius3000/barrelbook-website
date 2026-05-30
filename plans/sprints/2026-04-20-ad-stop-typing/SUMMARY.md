# Sprint Summary — Ad 1: Stop Typing

**Status:** Shipped to `output/ads/`
**Total runtime:** 15.1s (within IG tolerance)
**Hero bottle:** Four Roses Private Selection, Recipe OESV, Warehouse TS, Barrel 31-5N, 60.9% ABV

## Files delivered

| File | Aspect | Audio | Size | Use |
|---|---|---|---|---|
| `output/ads/stop_typing_9x16_main.mp4` | 1080×1920 | Andrew VO + music + captions | 9.2M | Reels / Stories — primary |
| `output/ads/stop_typing_9x16_silent.mp4` | 1080×1920 | Music + captions only (no VO) | 9.2M | Drop your own VO in post |
| `output/ads/stop_typing_4x5_main.mp4` | 1080×1350 | Andrew VO + music + captions | 8.1M | IG Feed |
| `output/ads/voice_samples/{andrew,brian,christopher}.mp3` | — | — | ~100K each | Reference VO candidates |

## Edit decisions

**Source footage (user-provided):**
- `Four Roses Bar Shot.MOV` (10.5s 1080×1920 portrait) — live-action hand reaching for the bottle.
- `Four Roses Scan Shot.MP4` (83s 888×1920 iPhone screen recording) — full real product flow from camera mode through save and catalog landing.

**Shot map:**
1. **Hook** (0–2s): Bar Shot t≈7.4–9.4s, hand grabbing the bottle by the cork. Caption *"Stop typing bourbon bottle details."*
2. **Pain** (2–4s): Synthetic iOS Notes mockup with intentionally messy "Four Roses ??" entry — fields exactly mirror what the AI auto-extracts later (Recipe OESV, Proof 121.8, ABV 60.9%, Barrel 31-5N, Warehouse TS) so the payoff lands. Caption *"Notes. Spreadsheets. Manual entry."*
3. **Open** (4–5s): Scan Shot t≈0.4s — real BarrelBook camera viewfinder. Caption *"Use BarrelBook instead."*
4. **Capture** (5–7s): Scan Shot t≈2.5s — bottle in viewfinder with shutter. Caption *"Snap the bottle."*
5. **Review** (7–10s): Scan Shot t≈49.5s — REVIEW EXTRACTION screen with bottle photo + AI 95% confidence + "Four Roses Private Selection" auto-filled. Caption *"Review. Edit if needed."* positioned over the form area so the bottle photo isn't covered.
6. **Save** (10–11s): Scan Shot t≈70.2s — actual "Saving to Catalog…" loader from the live app. Biggest single upgrade vs. v1. Caption *"Save it."*
7. **Result** (11–14s): Scan Shot t≈74.5s — catalog landing showing "Four Roses Private Selection $140" as the first tile, organically transitions to the bottle detail page. Caption *"Now it's in your catalog."* The bottom tab bar (which includes a Social tab — brief no-go) is cropped out.
8. **End card** (14–15s): Synthetic. Warm dark `#1A0F0A`, re-tinted logo `#D47437`, cream title, deep copper CTA "Download BarrelBook" with subtle warm halo.

**Brand palette (matched to iOS app spec, not website CSS):**
- Primary `#D97843` (soft rose-copper) — was `#D2691E` (read neon at 100% saturation)
- Accent `#D47437` — matches the BarrelBook Logo Large file
- Dark BG `#1A0F0A` (warm dark) — was `#0A0A0A` (pure black)
- Title `#F5EFE6` (cream off-white) — was pure white
- The logo PNG was re-tinted because the source file was baked in at `#F3862D` (a hot peach) which fought the warm palette.

**Audio:**
- Voice: edge-tts `en-US-AndrewNeural` ("warm, confident, authentic, honest") at rate −12%, pitch −12Hz.
- Treatment chain: low-shelf +1.5dB <200Hz (chest), peak +1dB at 120Hz (warmth), peak +1.5dB at 2.5kHz (presence), high-shelf −2dB >6kHz (de-hiss), loudnorm −16 LUFS.
- Music: synthesised warm pad (F minor pentatonic drone with slow tremolo + filtered brown-noise air) — copyright-clear placeholder, swap for a licensed track in post.
- Mix: VO sits in 1.0–10.9s window, music ducks to 30% volume under VO, full volume in pre-roll and tail, 0.8s fade-out at end.

**Brief no-go list — clean:**
- Single bottle (Four Roses) throughout in-app beats.
- No multi-bottle scanning shown.
- Social tab cropped from catalog UI.
- No star ratings, no reviews from others, no export/trading shown.
- Pricing only in the form of the user's own catalog values (real product feature, not an ad claim).

## Skipped

- **Variant V3 — alt-hook** (originally planned). With the live-action opener now strong, an alt-hook A/B felt like overkill. Easy to re-enable: render Shot 1 with `--alt-hook` and re-concat. Alt caption is already wired into `captions.py` (`ALT_HOOK_SHOT1`).

## Recommended next steps (in priority order)

1. **Replace TTS with a real human VO.** Andrew is the best edge-tts can do, but it doesn't twang. A voice actor with a soft Tennessee read would lift the ad another tier. Drop the WAV into `scripts/ad_stop_typing/out/audio/voiceover.wav` and re-run `mix.sh` + `main.sh`.
2. **Replace synthesised music with a licensed track.** Put a 16s WAV at `out/audio/music.wav` and re-run mix + master. Anything around −22 LUFS will sit cleanly under Andrew without further ducking adjustments.
3. **Re-shoot Shot 1 if you want a tighter macro.** Current bar-shot frames the Four Roses alongside neighbouring bottles, which is fine but a cleaner hand+cork close-up would be punchier.
4. **A/B test the alt-hook** ("Built for bottles that are annoying to type in.") if early performance plateaus — text swap is one render away.
5. **Audit the catalog `$11030 total value` line in Shot 7's first beat** — visible for ~1.4 seconds. If anyone on the team is uneasy with showing collection valuation, mask it with a black bar or recapture the catalog screen with that line trimmed.
6. **Once Shot-2 Notes pain reads clearly to viewers, consider replacing it with a real "old way" screenshot** — your old spreadsheet, Distiller export, or BottleNotes blank entry form. Real beats fabricated.

## Re-running the pipeline

```bash
cd /Users/petereilly2021/Projects/barrelbook-website

# Renders all 8 shots (still + video sources), audio, master, variants:
python3 scripts/ad_stop_typing/build.py --shot 2          # Notes mockup
python3 scripts/ad_stop_typing/build.py --shot 8          # End card
python3 scripts/ad_stop_typing/build_video.py --all       # Video shots 1,3,4,5,6,7
python3 scripts/ad_stop_typing/audio/voiceover.py
bash    scripts/ad_stop_typing/audio/music.sh
bash    scripts/ad_stop_typing/audio/mix.sh
bash    scripts/ad_stop_typing/variants/main.sh
bash    scripts/ad_stop_typing/variants/silent.sh
bash    scripts/ad_stop_typing/variants/feed_4x5.sh
```

## What lives where

| Path | What |
|---|---|
| `scripts/ad_stop_typing/build.py` | PIL frame renderer for Shots 2 (Notes) and 8 (end card). Owns brand palette + caption rendering. |
| `scripts/ad_stop_typing/build_video.py` | Video-source renderer for Shots 1, 3, 4, 5, 6, 7. Slices the user's MOV/MP4 and overlays captions. |
| `scripts/ad_stop_typing/captions.py` | Single source of truth for caption text, timing, positions. Includes alt-hook string. |
| `scripts/ad_stop_typing/audio/voiceover.py` | edge-tts Andrew VO + warmth EQ. |
| `scripts/ad_stop_typing/audio/voice_samples.py` | A/B sample renderer for VO candidates. |
| `scripts/ad_stop_typing/audio/music.sh` | Synthesised music bed. |
| `scripts/ad_stop_typing/audio/mix.sh` | VO + music ducked mix; produces main and silent audio tracks. |
| `scripts/ad_stop_typing/variants/main.sh` | 9:16 main concat + mux. Accepts env overrides for audio track and Shot 1 (alt-hook). |
| `scripts/ad_stop_typing/variants/silent.sh` | Wraps main.sh with the music-only audio track. |
| `scripts/ad_stop_typing/variants/feed_4x5.sh` | Centre-crops the 9:16 master to 1080×1350. |
| `scripts/ad_stop_typing/out/` | Intermediates — shot MP4s, thumbs, audio stems. Gitignore candidate. |

## Note on the Ralph sprint scaffold

The `plans/sprints/2026-04-20-ad-stop-typing/` folder contains `prd.json`, `progress.txt`, `prompt.md` per the workflow in `CLAUDE.md`. The Ralph runner scripts (`plans/ralph.sh`, `plans/adapters/claude_code.sh`) referenced in CLAUDE.md don't exist in the website repo — they're in the iOS BarrelBook repo. The PRD file is still useful as a record and as input if you copy the Ralph runner over later.
