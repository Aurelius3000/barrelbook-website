# Public Want List Mobile Preview

Implement a compact mobile preview for the public Want-list page at `/w/[token]`.

## Constraints
- Keep the existing public-share data contract.
- Do not change backend behavior.
- Keep security headers and `cache: "no-store"` behavior untouched.
- Keep the desktop layout readable.
- Do not commit until Pete approves the visual direction.

## Verification Commands
```bash
npm run build
```

## Browser Preview
- Run the website locally.
- Use mock public-list data if an active production token is unavailable.
- Check mobile and desktop widths.
