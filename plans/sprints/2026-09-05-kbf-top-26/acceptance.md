# Production acceptance criteria

Local QA for the master sync passed on Sept. 5, 2026. See `evidence.md` for results and known local warnings.
Staged-diff review passed for the approved local checkpoint. Public launch and deploy approval remain pending.

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

- Existing deep-link pages, App Store handoff, CTA analytics, and public route behavior are unchanged unless separately approved.
- Desktop and mobile browser QA pass; keyboard controls, search/filter states, source-link labels, contrast, and focus states are verified.
- TypeScript, lint, build, focused tests, source audit, and staged-diff review pass before an explicitly approved deploy.
