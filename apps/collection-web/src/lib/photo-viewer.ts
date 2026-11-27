export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;

export function clampZoom(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)) : MIN_ZOOM;
}

// Keep the same point under a finger/cursor when the scrollable image changes size.
export function zoomedOffset(offset: number, anchor: number, before: number, after: number): number {
  return Math.max(0, (offset + anchor) * clampZoom(after) / clampZoom(before) - anchor);
}

export function pinchZoom(startZoom: number, startDistance: number, distance: number): number {
  return startDistance > 0 && Number.isFinite(startDistance) && Number.isFinite(distance) && distance > 0
    ? clampZoom(startZoom * distance / startDistance) : clampZoom(startZoom);
}
