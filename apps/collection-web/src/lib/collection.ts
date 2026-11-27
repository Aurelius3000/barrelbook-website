import { statusLabel, type BottleRecord } from './records';

export const RENDER_PAGE_SIZE = 24;
export const SORTS = ['Collection order', 'Name A–Z', 'Highest proof', 'Highest rated', 'Lowest fill'] as const;
export const QUICK_FILTERS = ['All', 'Bourbon', 'Rye', 'Store picks', 'Unopened', 'Open', 'Five stars'] as const;
type QuickFilter = typeof QUICK_FILTERS[number];

function qualifies(bottle: BottleRecord, chip: QuickFilter) {
  switch (chip) {
    case 'All': return true;
    case 'Bourbon': case 'Rye': return (bottle.type || '').toLowerCase().split(/[^a-z]+/).includes(chip.toLowerCase());
    case 'Open': return bottle.status === 'Opened';
    case 'Unopened': return bottle.status === 'Unopened';
    case 'Store picks': return bottle.isStorePick === true;
    case 'Five stars': return bottle.rating === 5;
  }
}

export interface CollectionView {
  chip: QuickFilter;
  query: string;
  status: string;
  rating: string;
  tag: string;
  sort: string;
  view: 'table' | 'grid';
  limit: number;
  detailId: string | null;
}
export const INITIAL_VIEW: CollectionView = { chip: 'All', query: '', status: 'Active', rating: '0', tag: '', sort: 'Collection order', view: 'grid', limit: RENDER_PAGE_SIZE, detailId: null };

const normalize = (value: string) => value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();

export function collectionResults(bottles: BottleRecord[], view: CollectionView): BottleRecord[] {
  const terms = normalize(view.query).trim().split(/\s+/).filter(Boolean);
  const matches = bottles.filter(b => {
    if (!qualifies(b, view.chip)) return false;
    if (view.status !== 'All' && (view.status === 'Active' ? b.status === 'Archived' : b.status !== view.status)) return false;
    if (Number(view.rating) > 0 && (b.rating === null || b.rating < Number(view.rating))) return false;
    if (view.tag && !b.tags.includes(view.tag)) return false;
    const searchable = normalize([b.name, b.brand, b.release, b.edition, b.type, b.proof, b.size, b.barrelNumber, b.warehouse, b.distilledBy, b.storageLocation, b.notes, b.tastingNotes, statusLabel(b.status), ...b.tags].filter(v => v !== null).join(' '));
    return terms.every(term => searchable.includes(term));
  });
  const numeric = (value: number | null) => value ?? -1;
  if (view.sort !== 'Collection order') matches.sort((a, b) => {
    const difference = view.sort === 'Name A–Z' ? a.name.localeCompare(b.name)
      : view.sort === 'Highest proof' ? numeric(b.proof) - numeric(a.proof)
      : view.sort === 'Highest rated' ? numeric(b.rating) - numeric(a.rating)
      : view.sort === 'Lowest fill' ? (a.fillLevel ?? Infinity) - (b.fillLevel ?? Infinity) : 0;
    return difference || a.id.localeCompare(b.id);
  });
  return matches;
}

export function collectionSummary(bottles: BottleRecord[]) {
  return { records: bottles.length, units: bottles.reduce((sum, bottle) => sum + bottle.quantity, 0), rated: bottles.filter(b => b.rating !== null).length };
}

export interface RecordPage<T> { bottles: BottleRecord[]; cursor: T | null; hasMore: boolean }

// Keep the whole owner-scoped record set searchable while downloading photos only on demand.
export async function collectPages<T>(read: (cursor: T | null) => Promise<RecordPage<T>>, isCurrent: () => boolean, onPage: (page: RecordPage<T>, records: BottleRecord[]) => void): Promise<void> {
  const records = new Map<string, BottleRecord>();
  let cursor: T | null = null;
  while (isCurrent()) {
    const page = await read(cursor);
    if (!isCurrent()) return;
    const previousSize = records.size;
    for (const bottle of page.bottles) records.set(bottle.id, bottle);
    if (page.hasMore && (!page.cursor || page.cursor === cursor || records.size === previousSize)) throw new Error('Collection pagination did not advance');
    onPage(page, [...records.values()]);
    if (!page.hasMore) return;
    cursor = page.cursor;
  }
}


export function shelfTotals(bottles: BottleRecord[]) {
  const totals = { units: 0, unopened: 0, storePicks: 0, estimated: 0, priced: 0 };
  for (const b of bottles) {
    if (b.status !== 'Opened' && b.status !== 'Unopened') continue;
    totals.units += b.quantity;
    if (b.status === 'Unopened') totals.unopened += b.quantity;
    if (b.isStorePick) totals.storePicks += b.quantity;
    if (b.secondaryPrice !== null) {
      totals.estimated += b.quantity * b.secondaryPrice;
      totals.priced += b.quantity;
    }
  }
  return totals;
}

export const money = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2
}).format(amount);

export function priceComparison(estimate: number | null, msrp: number | null) {
  if (estimate === null || msrp === null || msrp <= 0) return null;
  const percent = Math.round((estimate / msrp - 1) * 100);
  return (percent > 0 ? '+' : '') + percent + '% vs. MSRP';
}


export function visiblePage(matches: BottleRecord[], limit: number) {
  return { visible: matches.slice(0, limit), nextCount: Math.min(RENDER_PAGE_SIZE, Math.max(0, matches.length - limit)) };
}
