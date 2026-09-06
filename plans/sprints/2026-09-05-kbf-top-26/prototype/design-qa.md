# Design QA — KBF Top 26 prototype

## Comparison target

- Source visual truth: `/Users/petereilly2021/.codex/generated_images/01a06738-b619-7971-8532-318d9cf593cf/exec-989f8e37-8582-4567-bf23-f51568677358.png` (the selected Drop Schedule concept).
- Implementation: browser-rendered `http://localhost:4173/plans/sprints/2026-09-05-kbf-top-26/prototype/index.html` in the Codex in-app browser; capture observed in the QA run but intentionally not persisted as a project asset.
- Desktop comparison: 1440 x 1024 CSS px, 1x; planner landing state, All releases selected.
- Mobile comparison: 390 x 844 CSS px, 1x; planner landing state, All releases selected.

## Full-view comparison

The implementation retains the concept’s core visual language: black foundation, charcoal dividers, orange release emphasis, editorial display type, a prominent event-planning hero, day navigation, and dense collector-oriented release rows. It intentionally changes the right-hand shortlist into a Top 26 editorial list plus source-aware filters: that reflects the approved product direction and allows every item to open into a reusable detail view.

The source mock’s bottle imagery is intentionally omitted rather than replaced with fictional or mismatched products. `design.md` records the required production-image decision: use rights-cleared press, owner, or approved source imagery before release.

## Focused comparison

- Header/hero: the BarrelBook wordmark, release-radar descriptor, serif hierarchy, orange event eyebrow, and top-level planning cue remain visually consistent.
- Planner rows: rank, availability, date, and unknown timing are more explicit than the concept image; this is an intentional collector-safety improvement.
- Mobile: hero, day navigation, and filters stack without clipping or overlapping. The planner retains readable text and practical control sizes.

## Fidelity surfaces

- **Fonts and typography:** Playfair Display supplies the editorial title treatment; DM Sans and DM Mono maintain readable UI density and metadata hierarchy. Desktop and mobile wrapping remain intentional.
- **Spacing and layout rhythm:** 64px desktop shell gutters, row dividers, a left filter rail, and responsive stacking keep the schedule-like density without card overload.
- **Colors and visual tokens:** near-black, charcoal, warm paper-white, and BarrelBook orange map consistently across selected tabs, priority facts, and warnings. Green is limited to confirmed-day status.
- **Image quality and asset fidelity:** the actual BarrelBook logo asset is used. Product imagery is consciously absent pending rights-cleared bottle assets; no fake bottle imagery or CSS/inline-SVG substitutes were introduced.
- **Copy and content:** the page clearly labels its editorial rank, local-prototype status, source requirement, last-reviewed date, and pending timing. Detail pages use the same record instead of duplicating facts.

## Functional checks

- Friday tab reduced the list to the one Friday-confirmed release.
- Searching `larrikin` returned three releases; Clear restored all 26.
- A release row opened the correct Manuka Honey detail record; its source link and return navigation were present.
- Browser console: no warnings or errors observed.

## Follow-up polish

- Add rights-cleared, release-specific product images after publication clearance.
- Replace the prototype’s generic source registry with per-field primary-source citations before public launch.
- Add a true location map only when booth/location assignments are confirmed.

final result: passed
