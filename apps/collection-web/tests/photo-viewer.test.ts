import { describe, expect, it } from 'vitest';
import { clampZoom, pinchZoom, zoomedOffset } from '../src/lib/photo-viewer';

describe('photo zoom geometry', () => {
  it('bounds extreme and invalid input while allowing fractional pinch scales', () => {
    expect([0, 1, 1.37, 9, Infinity, NaN].map(clampZoom)).toEqual([1, 1, 1.37, 4, 1, 1]);
  });
  it('keeps the same image point beneath the zoom anchor', () => {
    const offset = zoomedOffset(200, 100, 2, 4);
    expect(offset).toBe(500);
    expect((offset + 100) / 4).toBe((200 + 100) / 2);
    expect(zoomedOffset(offset, 100, 4, 2)).toBe(200);
  });
  it('does not produce negative scrolling at the edges or on fit', () => {
    expect(zoomedOffset(0, 300, 5, 1)).toBe(0);
    expect(zoomedOffset(200, 0, 1, 2)).toBe(400);
  });
  it('scales from the initial two-finger distance without compounding move events', () => {
    expect(pinchZoom(1.5, 100, 200)).toBe(3);
    expect(pinchZoom(1.5, 100, 150)).toBe(2.25);
    expect(pinchZoom(1.5, 100, 1000)).toBe(4);
    expect(pinchZoom(1.5, 100, 10)).toBe(1);
  });
  it('ignores zero/invalid pinch geometry rather than jumping the image', () => {
    expect(pinchZoom(2, 0, 20)).toBe(2);
    expect(pinchZoom(2, 100, NaN)).toBe(2);
  });
});
