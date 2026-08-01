# Loop Instructions

Outcome: publish versioned Terms and Privacy pages without changing canonical routes, conversion behavior, analytics, or App Store handoffs.

Work only in the files listed in `plan.md`. Preserve supplied policy wording. Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then verify `/terms`, `/privacy`, `/terms/2025-09-17`, and `/privacy/2025-09-17` at desktop and mobile widths. Record results and blockers in `evidence.md`.
