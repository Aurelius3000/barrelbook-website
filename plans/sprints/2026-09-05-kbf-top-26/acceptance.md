# Production acceptance criteria

Local QA for the master sync passed on Sept. 5, 2026. See `evidence.md` for results and known local warnings.
The first hosted preview passed KBF checks but failed live-site parity. The approved recovery now restores the missing live changes. Local comparisons match 12 live pages. Typecheck, lint, build, promo checks, and all 22 browser tests pass, with 5 expected skips. The five refreshed screenshot baselines were reviewed. A fresh hosted preview still needs checks before any launch request.

Hosted checks cover all 29 detail pages, master order, filters, phone and desktop layout, metadata, and existing handoff links. Google Analytics has no setting for this preview branch, and app-association IDs are production-only. Event delivery and real iPhone handoff remain launch checks. The browser blocked hosted sitemap XML; the same code passed its local sitemap test.

## Data quality

- All 29 records have a source, a last-checked date, and a Confirmed, Reported, or Watch label.
- The 25 active records match the master slots exactly. Slot 26 stays open. Four records stay parked. Barrell appears once; its fallback is not active.
- Each known fact links to its source. Reported facts keep that label, even on a Confirmed record.
- No detail page displays an inferred or unsupported value as fact.
- Unknown timing is represented by the approved confidence model, not an artificial timetable.
- Every public image is approved for use and accurately represents its bottle.

## Product and SEO

- `/releases/kbf-2026` is indexable, canonical, accessible, and uses the current BarrelBook design system.
- All 29 releases resolve at `/releases/kbf-2026/[slug]`, including all 26 prior detail URLs. Invalid slugs and a fake flex slug return 404.
- Index and detail pages draw from the same typed records. They show source links and a last-checked date. Detail pages add our reason for each pick, unknowns, and related bottles.
- The list, filters, related links, and ItemList use only the 25 active bottles. The open pick is not a bottle, search result, or link. Numbers show list order, not a rating or tier.
- The four parked pages show their status and use noindex, follow. The sitemap includes the index and 25 active detail pages. Structured data makes no stock, price, or Offer claim.
- Social slots, Meta times, draft approval, and Lucy's bank stay in the editorial plan. Sale days retain their own sources and confidence labels.

## Safety and quality

- Existing App Store handoff, public routes, promo attribution, gift links, and app-association handlers stay unchanged. The separately approved recovery restores live Android buttons and their existing events.
- Desktop and mobile browser QA pass; keyboard controls, search/filter states, source-link labels, contrast, and focus states are verified.
- TypeScript, lint, build, focused tests, source audit, and staged-diff review pass before an explicitly approved deploy.
