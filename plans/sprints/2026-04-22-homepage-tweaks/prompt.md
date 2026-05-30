# Sprint Prompt — Homepage Tweaks (2026-04-22)

This sprint is a targeted follow-up to the homepage refresh and phone-frame
sprints. It unwraps non-video screenshots, restores a third screenshot in
two sections, and wires the new SharedShelves video into the Share section.

## Project context

- Next.js (App Router) + Tailwind. Homepage is `src/components/LandingPage.tsx`.
- Dark theme: `#0A0A0A` bg, `#D2691E` bourbon accent.
- Components created in earlier sprints:
  - `PhoneFrame` — keeps wrapping videos only (this sprint removes it from screenshots).
  - `HeroVideo`, `StoryVideo` — video players wrapped in PhoneFrame.
- Video assets (in /public):
  - `Bottle Scanning 2-14-26.mov` — hero
  - `Pick-a-Pour.mov` — Tonight's Pour
  - `Spotlight and Flights.mov` — Spotlight & Flights
  - `SharedShelves.mov` — **new this sprint**, for the Share section
- Posters live under `/public/video-posters/`. TWEAK-004 adds a new one.

## Verification command

```bash
npx tsc --noEmit 2>&1 | tail -20 && npm run lint 2>&1 | tail -20
```

`npm run build` cannot run in-session (dev server on :3000 locks `.next/`).

## Domain rules

- **Remove PhoneFrame only from screenshots, not videos.** All four videos
  must retain their phone-silhouette look.
- **Preserve video attributes.** autoPlay muted loop playsInline with
  preload='metadata' + poster on every `<video>`.
- **Preserve alt text.** Screenshots keep their alt text.
- **No new runtime deps.** Pure Tailwind + ffmpeg (already used for the
  existing posters).
- **Use the user-supplied condensed copy for the Share section.** Don't
  invent new copy; the long Shared Shelves copy (feature blocks, closing
  CTA) is reserved for a future /shared-shelves standalone page.

## Out of scope

- Do not scaffold /shared-shelves as a separate page (future sprint).
- Do not touch pricing, hero, or other story sections beyond what the
  items require.

## Iteration ordering

1. TWEAK-001 first — reverting the PhoneFrame wrapper unblocks predictable
   screenshot rendering for TWEAK-002 and TWEAK-003.
2. TWEAK-002 and TWEAK-003 — restore 3rd screenshots.
3. TWEAK-004 — generate poster before wiring the video.
4. TWEAK-005 — wire SharedShelves video into the Share section.
5. TWEAK-006 — verify.
