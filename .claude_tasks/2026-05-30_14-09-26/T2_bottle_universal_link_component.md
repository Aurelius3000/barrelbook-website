# T2 Bottle Universal Link Component

## Description
Update the Apple App Site Association helper so BarrelBook can claim website bottle links for app handoff.

## Decisions
- Add a dedicated `/bottles/*` component with a bottle-specific comment.
- Preserve the existing `/scan`, `/collection`, `/store-picks`, `/p/*`, and `/gift/*` components.

## Test Notes
- AASA endpoint coverage will assert the new bottle component and the existing components remain present.

## Implementation Notes
- Added `BOTTLE_PATH_COMPONENT` for `/bottles/*`.
- Kept the existing shared AASA route handlers unchanged.
- Preserved `/scan`, `/collection`, `/store-picks`, `/p/*`, and `/gift/*` in the component list.
