# KBF 2026 Release Radar

Status: the homepage now links to the radar. Commit `efc5921` is pushed, and its protected preview is Ready. Hosted phone and desktop checks passed. Local checks passed, including 25 browser tests with 5 expected skips. Production is unchanged.

The local and hosted previews show Pete's 25 named bottles in master order, with slot 26 open. Four parked bottles keep their detail pages. Production is unchanged.

Branch: `codex/kbf-release-radar`, based on `origin/main` at `a8acc0c`.
Worktree: `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`.
The original checkout and its unrelated edits remain in place.

[Preview homepage](https://barrelbook-website-eiwysckys-pete-petereillycs-projects.vercel.app/) | [KBF radar preview](https://barrelbook-website-eiwysckys-pete-petereillycs-projects.vercel.app/releases/kbf-2026) | [Master list and match-up](master-list.md) | [Local preview](http://127.0.0.1:4175/) | [Plan](plan.md) | [QA and changed files](evidence.md)

## Goal

Build a useful KBF release page. It should show what we know, state what we do not know, and link to the source.

## Source of truth

[master-list.md](master-list.md) is the master for selected bottles, social slots, parked entries, and swaps. It replaces the old roster and tiers. Lucy's bank belongs to this one plan.

The typed records in `src/lib/kbf-releases.ts` drive the list and all 29 detail pages. They hold bottle facts and source-backed sale days. Social slots do not overwrite those days. [sources.md](sources.md) records the source checks.

The active list has 9 Confirmed, 15 Reported, and 1 Watch. The sync retained 22 records, added 3, and parked 4. List numbers are not quality ranks. The open pick has no bottle page and does not count as a search result.

The prototype stays here as a visual reference. It is not production content.

## Rules

- Cite KBF, brand, and named press sources. Mark reported facts as reported.
- Show unknown details as TBD.
- Do not use a product image without rights to use it.
- Do not add a Want List link or new KBF analytics event. The approved recovery restores existing live-site Android events only.

## Next step

Review the preview homepage. Click `KBF 2026 Release Radar` below the intro to open the watchlist. The existing App Store and Android paths remain intact. The earlier recovery matched 12 live pages and passed all 29 bottle detail checks; the KBF source is unchanged. No merge or production deploy is approved. See `evidence.md` for the current plan and results.
Do not promote the original preview or upload a dirty checkout. Any launch must use a reviewed Git commit, a fresh live-site comparison, and the recorded rollback target. Keep production and preview protection unchanged until launch approval.
Google Analytics is not configured for this preview branch. App-association IDs are production-only. Event delivery and real iPhone handoff remain launch checks. The browser blocked the hosted sitemap XML; its local check passed. See `evidence.md` for the limits.
Before launch, compare again with the latest main branch and live deployment, then recheck sources and get production approval. Meta, photos, and production deploys remain separate steps. Slot 26 and the Barrell fallback need an approved pick or swap.
