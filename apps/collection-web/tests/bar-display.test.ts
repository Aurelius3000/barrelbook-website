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
  it('publishes known bottle facts only and enforces all owner exclusions before the snapshot', () => {
    const data = {
      ...raw,
      release: '2025-01',
      warehouse: 'H',
      floor: 2,
      isFinished: false,
      bottlingDate: { toDate: () => new Date('2025-01-03T00:00:00Z') },
      tastingNotes: 'private',
      unknownField: 'private',
      tags: ['Favorite'],
    };
    const card = guestCard(
      record('a'),
      { ...DEFAULT_DISPLAY, excluded: ['proof', 'brand', 'warehouse'] },
      data,
    );
    expect(card.details).toEqual({
      release: '2025-01',
      floor: '2',
      isFinished: 'No',
      bottlingDate: '2025-01-03',
      tags: 'Favorite',
    });
    expect(card).not.toHaveProperty('proof');
    expect(card).not.toHaveProperty('brand');
    expect(JSON.stringify(card)).not.toContain('private');
    const { excluded, ...legacy } = DEFAULT_DISPLAY;
    expect(excluded).toEqual([]);
    expect(guestCard(record('a'), legacy, data)).not.toHaveProperty('details');
    expect(settingsValid({ ...DEFAULT_DISPLAY, excluded: ['notes'] as never })).toBe(false);
  });
  it('removes excluded brand and release from generated names for legacy records', () => {
    for (const name of [undefined, '   ', 42]) {
      const raw = { userId: 'fixture', name, brand: 'Private brand', release: 'Visible release' };
      const bottle = decodeBottle('id', raw, 'fixture');
      expect(guestCard(bottle, { ...DEFAULT_DISPLAY, excluded: ['brand'] }, raw).name).toBe('Visible release');
      expect(guestCard(bottle, { ...DEFAULT_DISPLAY, excluded: ['release'] }, raw).name).toBe('Private brand');
      expect(guestCard(bottle, { ...DEFAULT_DISPLAY, excluded: ['release', 'brand'] }, raw, 3).name).toBe(
        'Bottle 3',
      );
    }
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
