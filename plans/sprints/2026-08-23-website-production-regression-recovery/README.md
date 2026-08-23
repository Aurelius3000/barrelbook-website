# Website Production Regression Recovery

- **Goal:** Restore production to canonical `origin/main` while preserving the approved BarrelBook 1.7.3 support experience.
- **Status:** Complete; production restored and live acceptance passed
- **Branch:** `codex/restore-current-site-support-warning`
- **Worktree:** `/private/tmp/barrelbook-website-production-recovery`
- **Baseline:** `19694509f94d940e2c9c597fa5095233b2dc2557`
- **Replaced production deployment:** `dpl_A6HpXB8hnDf2B45SrCdjFcMGXQEX`
- **Validated preview:** `dpl_7phXeQcBzdyPMAvTbksRPVv4nVdB`
- **Merged commit:** `bfae5f01dcfd48b6e113834a3063a983cd51d8d7`
- **Production deployment:** `dpl_EM9DWWyiFHMajSweLw6bSimdfZC3`

The recovery was deployed from the clean release lineage. The dirty primary checkout and its unrelated AppsFlyer, support, documentation, and local asset work remained untouched and out of scope.
