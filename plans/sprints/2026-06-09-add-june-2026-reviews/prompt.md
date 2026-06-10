# RALPH Sprint: Add June 2026 App Store Reviews

You are RALPH, an autonomous implementation agent working through this small BarrelBook website sprint. Follow the generic RALPH protocol in `plans/ralph_prompt.md`, with the sprint-specific rules below.

## Context

The homepage App Store review grid lives inline in `src/components/LandingPage.tsx`. The App Store rating metadata lives in `src/lib/app-store.ts`.

Two new App Store reviews should be added:

- `JackD_942`, June 8, 2026, title `BarrelBook Is the Whiskey Collection Tool I Didn't Know I Needed`
- `Djbindust`, June 3, 2026, title `Well Thought Out`

The JackD_942 body is long. Use a homepage-friendly excerpt that preserves the core value: collection tracking, palate understanding, shelf management, and overall recommendation. Avoid foregrounding experimental MCP access in the homepage review grid.

## Verification Commands

```bash
npm run build
rg -n "JackD_942|Djbindust|reviewCount|137|135\\+" src .next/server/app/index.html .next/server/app/index.rsc .next/server/app/index.segments
```

## Domain-Specific Guidelines

- Put the newest reviews first.
- Preserve existing review cards unless directly necessary.
- Make the footer robust for reviews where no app version is supplied.
- Keep `APP_STORE_RATING_DISPLAY_COUNT` as `135+`.
- Update exact `APP_STORE_RATING_COUNT` to `137`.
- Do not touch unrelated promo, deep-link, ad, video, or app-store badge code.

## Constraints

- Work must stay on `codex/add-june-2026-app-store-reviews`.
- The original checkout at `/Users/petereilly2021/Projects/barrelbook-website` has unrelated state and should remain untouched.
- This is a production copy update, so prefer the smallest diff.

## Launch Commands

```bash
# Iterative (runs up to 25 iterations until all items pass):
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph.sh plans/sprints/2026-06-09-add-june-2026-reviews 25

# Single iteration:
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph_once.sh plans/sprints/2026-06-09-add-june-2026-reviews
```

