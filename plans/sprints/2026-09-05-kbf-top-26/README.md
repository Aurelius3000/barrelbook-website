# KBF 2026 Release Radar

Status: Pete approved launch on Sept. 6, 2026. Release is in progress. The final pre-launch check passed. Main and production still match that check. The build, promo checks, typecheck, and 31 browser tests passed, with 8 expected skips. Only QA notes changed since the reviewed app source.

The local and hosted previews show Pete's 25 named bottles in master order, with slot 26 open. Four parked bottles keep their detail pages. Production is unchanged.

Branch: `codex/kbf-release-radar`, based on `origin/main` at `a8acc0c`.
Worktree: `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`.
The original checkout and its unrelated edits remain in place.

[Preview homepage](https://barrelbook-website-q2i56h45c-pete-petereillycs-projects.vercel.app/) | [KBF radar preview](https://barrelbook-website-q2i56h45c-pete-petereillycs-projects.vercel.app/releases/kbf-2026) | [Master list and match-up](master-list.md) | [Local preview](http://127.0.0.1:4175/) | [Plan](plan.md) | [QA and changed files](evidence.md)

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

Commit and push the QA notes, open and merge the release PR into main, then check the fresh Vercel production build. Pete approved these steps. The Sept. 6 check matched 12 existing live pages, apart from the approved homepage menu. All 29 local bottle detail URLs passed. Fresh phone and desktop menu checks passed. See `evidence.md` for the checks and limits.

Use a fresh production build from the reviewed main commit. Do not promote a preview artifact or upload the dirty original checkout. This preview branch has no Google Analytics setting, and app-association IDs are production-only. Keep both settings and access protection unchanged. The live site loads Google Analytics; event receipt and real iPhone handoff still need post-launch checks. Check the hosted sitemap too; its local check passed.

Recheck main and the live deployment just before release. Keep `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2` as the rollback reference. No commit, push, PR, merge, or production deploy was made in the final check. Meta and photos remain separate steps. Slot 26 and the Barrell fallback need an approved pick or swap.
