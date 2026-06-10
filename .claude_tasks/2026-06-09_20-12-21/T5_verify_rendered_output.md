# Task 5: Verify Rendered Output

## Description

Build the site and inspect generated homepage output for the new reviews and structured review count.

## Verification Commands

```bash
npm run build
rg -n "JackD_942|Djbindust|reviewCount|137|135\\+" src .next/server/app/index.html .next/server/app/index.rsc .next/server/app/index.segments
```

## Result

```text
npm run build
✓ Compiled successfully
✓ Generating static pages using 17 workers (22/22)
```

Generated homepage output contains:

```text
"reviewCount":"137"
135+
JackD_942
Djbindust
Cewj2000
```

Ordering check passed: `JackD_942` appears before `Djbindust`, and `Djbindust` appears before the previous first review, `Cewj2000`. No `vundefined` footer text appears in generated homepage output.
