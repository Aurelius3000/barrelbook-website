import { describe, expect, it } from 'vitest';
import { collectPages, collectionResults, collectionSummary, visiblePage, money, shelfTotals, priceComparison, QUICK_FILTERS, INITIAL_VIEW } from '../src/lib/collection';
import { decodeBottle, type BottleRecord } from '../src/lib/records';

const bottle = (id: string, values: Record<string, unknown> = {}) => decodeBottle(id, { userId: 'alice', name: `Bottle ${id}`, status: 'Opened', ...values }, 'alice');

describe('complete collection browsing', () => {
  it('finds collector fields, private notes, tasting notes and accent-insensitive multi-term searches', () => {
    const records = [bottle('a', { distilledBy: 'Míchter’s', warehouse: 'H', storageLocation: 'Cabinet', notes: 'Birthday gift', tastingNotes: 'Black cherry', barrelNumber: '2168', tags: ['Store pick'] })];
    for (const query of ['michter cabinet', 'birthday', 'black cherry', '2168', 'store pick']) expect(collectionResults(records, { ...INITIAL_VIEW, query })).toHaveLength(1);
    expect(collectionResults(records, { ...INITIAL_VIEW, query: 'birthday missing' })).toHaveLength(0);
  });
  it('combines canonical status, minimum rating and exact stored-tag filters without merging duplicates', () => {
    const records = [bottle('a', { name: 'Same bottle', rating: 4.5, tags: ['Pick'] }), bottle('b', { name: 'Same bottle', rating: 5, tags: ['Pick'] }), bottle('c', { rating: 5, tags: ['Pick something'] }), bottle('d', { rating: 5, tags: ['Pick'], status: 'Archived' })];
    expect(collectionResults(records, { ...INITIAL_VIEW, rating: '4', tag: 'Pick' }).map(b => b.id)).toEqual(['a', 'b']);
    expect(collectionResults(records, { ...INITIAL_VIEW, status: 'Archived', tag: 'Pick' }).map(b => b.id)).toEqual(['d']);
    expect(collectionResults([bottle('empty', { status: 'Finished' })], { ...INITIAL_VIEW, status: 'All', query: 'empty' })).toHaveLength(1);
  });
  it('sorts unknown numeric values last, preserves zeros, and resolves ties consistently', () => {
    const records = [bottle('c'), bottle('b', { fillLevel: 0, proof: 0, rating: 0 }), bottle('a', { fillLevel: 50, proof: 100, rating: 5 })];
    for (const sort of ['Highest proof', 'Highest rated']) expect(collectionResults(records, { ...INITIAL_VIEW, sort }).map(b => b.id)).toEqual(['a', 'b', 'c']);
    expect(collectionResults(records, { ...INITIAL_VIEW, sort: 'Lowest fill' }).map(b => b.id)).toEqual(['b', 'a', 'c']);
  });
  it('distinguishes records, bottle units and zero ratings from unknown ratings', () => {
    expect(collectionSummary([bottle('a', { quantity: 3, rating: 0 }), bottle('b')])).toEqual({ records: 2, units: 4, rated: 1 });
    expect(collectionSummary([])).toEqual({ records: 0, units: 0, rated: 0 });
  });
  it('loads and searches a 1,000-record collection beyond the first page without a silent cap', async () => {
    const all = Array.from({ length: 1000 }, (_, i) => bottle(String(i), { name: i === 999 ? 'Last-page discovery' : `Sample ${i}` }));
    let calls = 0, final: BottleRecord[] = [];
    await collectPages<number>(async cursor => { calls++; const start = cursor ?? 0; return { bottles: all.slice(start, start + 100), cursor: start + 100, hasMore: start + 100 < all.length }; }, () => true, (_, records) => { final = records; });
    expect(calls).toBe(10); expect(final).toHaveLength(1000);
    expect(collectionResults(final, { ...INITIAL_VIEW, query: 'last-page' }).map(b => b.id)).toEqual(['999']);
  });
  it('does not deliver a page after an account switch or superseded refresh', async () => {
    let current = true, delivered = false;
    await collectPages<number>(async () => { current = false; return { bottles: [bottle('private')], cursor: null, hasMore: false }; }, () => current, () => { delivered = true; });
    expect(delivered).toBe(false);
  });
  it('surfaces a later-page failure and stops non-advancing pagination', async () => {
    let visible: BottleRecord[] = [];
    await expect(collectPages<number>(async cursor => { if (cursor) throw new Error('Offline'); return { bottles: [bottle('a')], cursor: 1, hasMore: true }; }, () => true, (_, records) => { visible = records; })).rejects.toThrow('Offline');
    expect(visible).toHaveLength(1);
    await expect(collectPages<number>(async () => ({ bottles: [], cursor: 1, hasMore: true }), () => true, () => {})).rejects.toThrow('did not advance');
  });
});

describe('Library shelf and detail facts', () => {
  const stock = [
    bottle('a', { type: 'Straight Bourbon Whiskey', isStorePick: true, ageStatement: 'NAS', secondaryPrice: 172, msrp: 100, quantity: 2, rating: 5 }),
    bottle('b', { type: 'Rye Whiskey', status: 'Unopened', secondaryPrice: 0 }),
    bottle('c', { status: 'Unopened' }), bottle('d', { status: 'Finished', secondaryPrice: 300 }),
    bottle('e', { status: 'Archived' })
  ];
  it('counts physical units and reports partial valuation across eligible inventory', () => {
    expect(shelfTotals(stock)).toEqual({ units: 4, unopened: 2, storePicks: 2, estimated: 344, priced: 3 });
    expect(stock[0].ageStatement).toBe('NAS');
    expect(shelfTotals([]).priced).toBe(0);
  });
  it('maps every quick filter and intersects it with existing filters', () => {
    const expected = [['a','b','c','d'], ['a'], ['b'], ['a'], ['b','c'], ['a'], ['a']];
    QUICK_FILTERS.forEach((chip, index) => {
      expect(collectionResults(stock, { ...INITIAL_VIEW, chip }).map(b => b.id)).toEqual(expected[index]);
    });
    expect(collectionResults(stock, { ...INITIAL_VIEW, chip: 'Bourbon', status: 'Unopened' })).toEqual([]);
  });
  it('preserves missing and zero values in the price comparison', () => {
    expect([172, 83, 100, 0, null].map(value => priceComparison(value, 100)))
      .toEqual(['+72% vs. MSRP', '-17% vs. MSRP', '0% vs. MSRP', '-100% vs. MSRP', null]);
    expect(priceComparison(100, 0)).toBeNull();
    expect(priceComparison(100, null)).toBeNull();
    expect(INITIAL_VIEW.limit).toBe(24);
  });
});


it.each([0, 1, 24, 25, 48, 49])('reveals %i matching records in exact pages', count => {
  const matches = Array.from({ length: count }, (_, i) => bottle(String(i)));
  let limit = INITIAL_VIEW.limit;
  while (true) {
    const { visible, nextCount } = visiblePage(matches, limit);
    expect(visible.map(b => b.id)).toEqual(matches.slice(0, Math.min(limit, count)).map(b => b.id));
    expect(nextCount).toBe(Math.min(24, count - visible.length));
    if (!nextCount) break;
    limit += nextCount;
  }
  expect(money(195.3)).toBe('$195.30');
});
