# KBF 2026 Release Radar

Status: master roster synced to the website. Local build and QA passed on Sept. 5.
Pete approved a local Git checkpoint after preview review. Push and deploy approval remain pending.

The local preview shows Pete's 25 named bottles in master order, with slot 26 open. Four parked bottles keep their detail pages. Deploy approval is still pending.

Branch: `codex/kbf-release-radar`, based on `origin/main` at `a8acc0c`.
Worktree: `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`.
The original checkout and its unrelated edits remain in place.

[Master list and match-up](master-list.md) | [Local preview](http://127.0.0.1:4174/releases/kbf-2026) | [Plan](plan.md) | [QA and changed files](evidence.md)

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
- Do not add a Want List link or new analytics event in this work.

## Next step

After the local checkpoint, get approval to push the feature branch for a hosted preview. Before launch, compare with the latest main branch and live deployment, then recheck sources.
Meta, photos, pushes, and deploys remain separate steps. Slot 26 and the Barrell fallback need an approved pick or swap.
