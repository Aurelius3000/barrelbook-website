# Website Production Regression Recovery

- **Goal:** Restore production to canonical `origin/main` while preserving the approved BarrelBook 1.7.3 support experience.
- **Status:** Preview Ready; production approval pending
- **Branch:** `codex/restore-current-site-support-warning`
- **Worktree:** `/private/tmp/barrelbook-website-production-recovery`
- **Baseline:** `19694509f94d940e2c9c597fa5095233b2dc2557`
- **Current production rollback target:** `dpl_A6HpXB8hnDf2B45SrCdjFcMGXQEX`
- **Validated preview:** `dpl_7phXeQcBzdyPMAvTbksRPVv4nVdB`

The recovery must be deployed from this clean branch. The dirty primary checkout and its unrelated AppsFlyer, support, documentation, and local asset work are explicitly out of scope.
