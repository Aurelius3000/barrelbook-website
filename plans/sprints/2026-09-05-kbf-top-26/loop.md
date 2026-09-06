# Production loop

Outcome: launch a source-backed KBF 2026 watchlist at `/releases/kbf-2026` with reusable bottle details.

Status: master sync and live-source recovery complete. Commit `950b351` is pushed. Preview `dpl_5krR4YUJ267ScdPxRBnR3kf3kYe9` is Ready and passes signed-in checks: 12 live pages match, all 29 details work, and filters pass. Typecheck, lint, build, promo tests, and 22 local browser tests pass. Read the current recovery record at the top of `evidence.md`, then `master-list.md`. Production is unchanged.

Next: stop for Pete's review of the fresh preview. The old preview lacks the live fixes and must not be promoted. Before launch, recheck sources, remote main, and production parity. Get separate approval to merge and publish a reviewed Git commit. Keep the recorded rollback target. Do not upload a dirty checkout or weaken preview protection. Do not repeat the recovery or master sync. Do not treat social slots as sale dates or rankings. Do not rebuild the prototype or repeat the old primary-source gate.

Test limits: Google Analytics is not configured for this preview branch. App-association IDs are production-only. Event delivery and real iPhone handoff remain launch checks. The browser blocked hosted sitemap XML; local sitemap QA passed. Do not change settings to hide these limits.

Current approved scope: recover the seven live production files and two tests listed in `plan.md`, review five refreshed test snapshots, update sprint notes, then commit and push the feature branch. The five KBF source files stay unchanged. Photos are a separate pass. Preserve existing marketing routes, deep links, and analytics. Preserve parked detail URLs, but keep them out of active filters, related links, and the sitemap.

Target scope: 25 named bottles plus an open flex slot, until Pete approves a final pick. Lucy's bank is part of this one master. A Barrell fallback at slot 9 requires a change at slot 13. Cite reported facts and label them. Use TBD for gaps. Keep image rights, posts, tracking, and deploy approval as separate steps.
