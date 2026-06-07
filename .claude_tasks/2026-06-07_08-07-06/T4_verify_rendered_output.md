# Task 4: Verify Rendered Output

## Description

Run the project build and inspect the output path usage so visible copy and JSON-LD remain consistent.

## Verification Commands

```bash
npm run build
rg -n "135\\+|reviewCount|APP_STORE_RATING" src .next/server/app
```

## Decisions

- Use `npm run build` as the primary website verification command.
- Inspect source and generated server output for both visible copy and structured metadata.

## Result

```text
npm run build
✓ Compiled successfully
✓ Generating static pages using 17 workers (22/22)
```

```text
.next/server/app/index.html:"reviewCount":"135"
.next/server/app/index.html:135+
```

No stale `125+`, `"reviewCount":"126"`, or `from 125` matches remain in `src` or the generated homepage artifacts.
