import { describe, expect, it } from 'vitest';
import { decodeBottle } from '../src/lib/records';
import {
  DEFAULT_DISPLAY,
  DISPLAY_LIFETIME,
  guestCard,
  inCategory,
  selectShelf,
  settingsValid,
} from '../src/lib/bar-display';

const raw = {
  userId: 'fixture',
  name: 'Sample',
  status: 'Opened',
  proof: 122.6,
  rating: 4.5,
  fillLevel: 65,
  secondaryPrice: 195.3,
  purchasePrice: 150,
  msrp: 150,
  quantity: 2,
  notes: 'private',
  storageLocation: 'private',
  tags: ['private'],
};
const record = (id: string, status = raw.status) => decodeBottle(id, { ...raw, status }, 'fixture');
describe('guest projection', () => {
  it('uses an explicit field list and keeps optional facts out of the payload', () => {
    expect(guestCard(record('a'), { ...DEFAULT_DISPLAY, ratings: false })).toEqual({
      name: 'Sample',
      brand: '',
      type: null,
      proof: 122.6,
      age: null,
      status: 'Opened',
      fill: 65,
      pick: false,
      photos: [],
    });
    expect(guestCard(record('a'), { ...DEFAULT_DISPLAY, values: true })).toMatchObject({
      rating: 4.5,
      estimatedValue: 195.3,
    });
    expect(
      guestCard(decodeBottle('z', { ...raw, secondaryPrice: null }, 'fixture'), {
        ...DEFAULT_DISPLAY,
        values: true,
      }).estimatedValue,
    ).toBeNull();
  });
  it('keeps flight and open shelf selections inside the eligible collection', () => {
    const records = ['Unopened', 'Opened', 'Finished', 'Archived', 'Unknown'].map((status, i) =>
      record(String(i), status),
    );
    expect(selectShelf(records, DEFAULT_DISPLAY).map((b) => b.id)).toEqual(['0', '1']);
    expect(selectShelf(records, { ...DEFAULT_DISPLAY, shelf: 'open' })).toEqual([records[1]]);
    expect(selectShelf(records, { ...DEFAULT_DISPLAY, shelf: 'flight', flight: ['1', '4'] })).toEqual([
      records[1],
    ]);
    expect(selectShelf([], { ...DEFAULT_DISPLAY, shelf: 'flight', flight: ['1'] })).toEqual([]);
    expect(settingsValid({ ...DEFAULT_DISPLAY, flight: ['1', '1'] })).toBe(false);
  });
  it('uses eight hours from activation and cannot infer a hidden rating from a category', () => {
    expect(DISPLAY_LIFETIME).toBe(28800000);
    const five = decodeBottle('a', { ...raw, rating: 5 }, 'fixture');
    expect(inCategory(guestCard(five, { ...DEFAULT_DISPLAY, ratings: false }), 'Five stars')).toBe(false);
    expect(inCategory(guestCard(five, DEFAULT_DISPLAY), 'Five stars')).toBe(true);
  });
});
