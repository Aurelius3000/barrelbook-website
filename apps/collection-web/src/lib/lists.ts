import { collection, doc, documentId, getDocFromServer, getDocsFromServer, limit, orderBy, query, startAfter, Timestamp, type QueryDocumentSnapshot } from 'firebase/firestore';
import { assertOwner, PAGE_SIZE, type Runtime } from './firebase';
import { decodeBottle } from './records';

export type ListKind = 'want' | 'tried';

export interface BottleList {
  id: string;
  kind: ListKind;
  name: string;
  description: string | null;
  itemCount: number;
  updatedAt: number;
}

export interface ListItem {
  id: string;
  name: string;
  brand: string | null;
  bottleType: string | null;
  linkedBottleId: string | null;
  createdAt: number;
  sortOrder: number | null;
  fields: { label: string; value: string }[];
}

interface ListRead<T> {
  records: T[];
  partial: boolean;
}

const fields = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
const finite = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : null;
const timestamp = (value: unknown) => value instanceof Timestamp ? value.toMillis() : null;
const nameOrder = new Intl.Collator('en-US', { sensitivity: 'base' });
const dateLabel = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const currencyLabel = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function documentSegment(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim() || value === '.' || value === '..') return null;
  return /[\/\\\u0000-\u001f]/.test(value) ? null : value;
}

export function canBrowseLists(flags: Record<string, unknown>, profile?: Record<string, unknown>): boolean {
  return flags.lists_enabled === true ||
    (flags.lists_beta_enabled === true && fields(profile?.featureAccess).listsEnabled === true);
}

export function decodeList(id: string, data: Record<string, unknown>, uid: string): BottleList | null {
  if (typeof data.userId === 'string' && data.userId !== uid) throw new Error('List ownership mismatch');
  const name = text(data.name), updatedAt = timestamp(data.updatedAt), count = finite(data.itemCount);
  if (data.userId !== uid || !name || updatedAt === null || timestamp(data.createdAt) === null ||
      (data.type !== 'want' && data.type !== 'tried')) return null;
  return { id, kind: data.type, name, description: text(data.description),
    itemCount: count !== null && Number.isSafeInteger(count) && count >= 0 ? count : 0, updatedAt };
}

function namedChoice(value: unknown, choices: Record<string, string>) {
  return typeof value === 'string' && Object.hasOwn(choices, value) ? choices[value] : null;
}

export function decodeListItem(id: string, data: Record<string, unknown>, uid: string, list: BottleList): ListItem | null {
  if (typeof data.userId === 'string' && data.userId !== uid) throw new Error('List item ownership mismatch');
  if (typeof data.listId === 'string' && data.listId !== list.id) throw new Error('List item parent mismatch');
  const name = text(data.displayName), createdAt = timestamp(data.createdAt);
  if (data.userId !== uid || data.listId !== list.id || !name || createdAt === null || timestamp(data.updatedAt) === null) return null;

  const want = fields(data.wantFields), tried = fields(data.triedFields);
  const price = finite(want.targetPrice), rating = finite(tried.rating), triedDate = timestamp(tried.dateTried);
  const pairs: [string, string | null][] = list.kind === 'want' ? [
    ['Target price', price !== null && price >= 0 ? currencyLabel.format(price) : null],
    ['Priority', namedChoice(want.priority, { high: 'High', medium: 'Medium', low: 'Low' })],
    ['Source', text(want.source)],
    ['Public note', text(want.publicNote)],
    ['Private note', text(want.privateNote)],
  ] : [
    ['Date tried', triedDate === null ? null : dateLabel.format(triedDate)],
    ['Where tried', text(tried.whereTried)],
    ['Occasion', text(tried.occasion)],
    ['Rating', rating !== null && rating >= 0 && rating <= 5 ? `${rating} / 5` : null],
    ['Would buy again', namedChoice(tried.wouldBuy, { yes: 'Yes', maybe: 'Maybe', no: 'No' })],
    ['Tasting notes', text(tried.tastingNotes)],
    ['Private note', text(tried.privateNote)],
  ];
  const sortOrder = finite(data.sortOrder);
  return { id, name, brand: text(data.brand), bottleType: text(data.bottleType),
    linkedBottleId: documentSegment(data.linkedBottleId), createdAt,
    sortOrder: Number.isSafeInteger(sortOrder) ? sortOrder : null,
    fields: pairs.flatMap(([label, value]) => value === null ? [] : [{ label, value }]) };
}

export function sortLists(lists: BottleList[]) {
  return [...lists].sort((a, b) => b.updatedAt - a.updatedAt || nameOrder.compare(a.name, b.name) || a.id.localeCompare(b.id));
}

export function sortListItems(items: ListItem[], kind: ListKind) {
  return [...items].sort((a, b) => {
    if (kind === 'want' && a.sortOrder !== b.sortOrder) {
      if (a.sortOrder === null) return 1;
      if (b.sortOrder === null) return -1;
      return a.sortOrder - b.sortOrder;
    }
    return (kind === 'want' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt) ||
      nameOrder.compare(a.name, b.name) || a.id.localeCompare(b.id);
  });
}

function assertCurrent(runtime: Runtime, uid: string, signal: AbortSignal) {
  signal.throwIfAborted();
  assertOwner(runtime, uid);
}

export async function readListsAvailability(runtime: Runtime, uid: string, signal: AbortSignal): Promise<boolean> {
  assertCurrent(runtime, uid, signal);
  const flagDoc = await getDocFromServer(doc(runtime.db, 'config', 'feature_flags'));
  assertCurrent(runtime, uid, signal);
  if (!flagDoc.exists()) return false;
  const flags = flagDoc.data();
  if (canBrowseLists(flags)) return true;
  if (flags.lists_beta_enabled !== true) return false;
  const profile = await getDocFromServer(doc(runtime.db, 'users', uid));
  assertCurrent(runtime, uid, signal);
  return profile.exists() && canBrowseLists(flags, profile.data());
}

async function readPages<T>(
  runtime: Runtime, uid: string, signal: AbortSignal,
  path: ReturnType<typeof collection>,
  decode: (id: string, data: Record<string, unknown>) => T | null,
): Promise<ListRead<T>> {
  const records: T[] = [];
  let partial = false, cursor: QueryDocumentSnapshot | undefined;
  do {
    assertCurrent(runtime, uid, signal);
    const page = await getDocsFromServer(query(path, orderBy(documentId()), ...(cursor ? [startAfter(cursor)] : []), limit(PAGE_SIZE + 1)));
    assertCurrent(runtime, uid, signal);
    const docs = page.docs.slice(0, PAGE_SIZE);
    for (const record of docs) {
      const value = decode(record.id, record.data());
      if (value === null) partial = true;
      else records.push(value);
    }
    cursor = page.size > PAGE_SIZE ? docs.at(-1) : undefined;
  } while (cursor);
  return { records, partial };
}

export async function readLists(runtime: Runtime, uid: string, signal: AbortSignal): Promise<ListRead<BottleList> | null> {
  if (!await readListsAvailability(runtime, uid, signal)) return null;
  const result = await readPages(runtime, uid, signal, collection(runtime.db, 'users', uid, 'lists'),
    (id, data) => decodeList(id, data, uid));
  return { ...result, records: sortLists(result.records) };
}

export async function readListItems(runtime: Runtime, uid: string, list: BottleList, signal: AbortSignal): Promise<ListRead<ListItem>> {
  if (documentSegment(list.id) !== list.id) throw new Error('List unavailable');
  const result = await readPages(runtime, uid, signal, collection(runtime.db, 'users', uid, 'lists', list.id, 'items'),
    (id, data) => decodeListItem(id, data, uid, list));
  return { ...result, records: sortListItems(result.records, list.kind) };
}

export async function readLinkedBottle(runtime: Runtime, uid: string, item: ListItem, signal: AbortSignal) {
  const id = item.linkedBottleId;
  if (!id || documentSegment(id) !== id) return null;
  assertCurrent(runtime, uid, signal);
  const snapshot = await getDocFromServer(doc(runtime.db, 'users', uid, 'bottles', id));
  assertCurrent(runtime, uid, signal);
  return snapshot.exists() ? decodeBottle(snapshot.id, snapshot.data(), uid) : null;
}

export function displayedItemCount(list: BottleList, items?: ListRead<ListItem>): number | null {
  return items ? (items.partial ? null : items.records.length) : list.itemCount;
}
