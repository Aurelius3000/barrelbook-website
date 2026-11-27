import { statusLabel, type BottleRecord } from './records';

export const RENDER_PAGE_SIZE = 48;
export const SORTS = ['Collection order', 'Name A–Z', 'Highest proof', 'Highest rated', 'Lowest fill'] as const;
export interface CollectionView {
  query: string;
  status: string;
  rating: string;
  tag: string;
  sort: string;
  view: 'table' | 'grid';
  limit: number;
  selectedId: string | null;
  detailId: string | null;
  photoViewer: boolean;
}
export const INITIAL_VIEW: CollectionView = { query: '', status: 'Active', rating: '0', tag: '', sort: 'Collection order', view: 'grid', limit: RENDER_PAGE_SIZE, selectedId: null, detailId: null, photoViewer: false };

const normalize = (value: string) => value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();

export function collectionResults(bottles: BottleRecord[], view: CollectionView): BottleRecord[] {
  const terms = normalize(view.query).trim().split(/\s+/).filter(Boolean);
  const matches = bottles.filter(b => {
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
