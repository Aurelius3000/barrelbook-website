import { initializeApp } from 'firebase/app';
import { getDocFromServer, getDocsFromServer, getFirestore, Timestamp, type DocumentSnapshot } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Runtime } from '../src/lib/firebase';
import { canBrowseLists, decodeList, decodeListItem, displayedItemCount, readLinkedBottle, readLists, sortListItems, sortLists } from '../src/lib/lists';

vi.mock('firebase/firestore', async load => ({
  ...await load<typeof import('firebase/firestore')>(),
  getDocFromServer: vi.fn(),
  getDocsFromServer: vi.fn(),
}));

const uid = 'list-owner';
const db = getFirestore(initializeApp({ projectId: 'demo-barrelbook-web' }, 'list-unit'));
const auth = { currentUser: { uid, isAnonymous: false } };
const runtime = { auth, db } as unknown as Runtime;
const reads = vi.mocked(getDocFromServer);
const listReads = vi.mocked(getDocsFromServer);
const signal = () => new AbortController().signal;

function document(data?: Record<string, unknown>, id = 'archived') {
  return { id, exists: () => data !== undefined, data: () => data } as unknown as DocumentSnapshot;
}

const listData = { userId: uid, name: 'Weekend picks', type: 'want', createdAt: Timestamp.fromMillis(1), updatedAt: Timestamp.fromMillis(2), itemCount: 7 };
const want = decodeList('weekend', listData, uid)!;
const tried = { ...want, kind: 'tried' as const };
const itemData = { userId: uid, listId: want.id, displayName: 'Old Forester', createdAt: Timestamp.fromMillis(2), updatedAt: Timestamp.fromMillis(3) };

beforeEach(() => {
  auth.currentUser = { uid, isAnonymous: false };
  reads.mockReset();
  listReads.mockReset();
});

describe('Lists availability', () => {
  it('accepts global enablement or beta with an explicit account grant', () => {
    expect(canBrowseLists({ lists_enabled: true })).toBe(true);
    expect(canBrowseLists({ lists_beta_enabled: true }, { featureAccess: { listsEnabled: true } })).toBe(true);
    expect(canBrowseLists({ lists_beta_enabled: true }, { featureAccess: { listsEnabled: 'true' } })).toBe(false);
    expect(canBrowseLists({}, { featureAccess: { listsEnabled: true } })).toBe(false);
  });

  it('checks the current owner’s grant and does not read lists for ineligible accounts', async () => {
    reads.mockResolvedValueOnce(document({ lists_beta_enabled: true })).mockResolvedValueOnce(document({ featureAccess: {} }));
    await expect(readLists(runtime, uid, signal())).resolves.toBeNull();
    expect(reads.mock.calls.map(([ref]) => ref.path)).toEqual(['config/feature_flags', 'users/list-owner']);
    expect(listReads).not.toHaveBeenCalled();
  });

  it('fails without reading lists when feature flags cannot be read', async () => {
    reads.mockRejectedValueOnce(new Error('offline'));
    await expect(readLists(runtime, uid, signal())).rejects.toThrow('offline');
    expect(listReads).not.toHaveBeenCalled();
  });
});

describe('List records', () => {
  it('keeps optional and zero values and skips malformed records', () => {
    expect(decodeList('empty', { ...listData, itemCount: undefined }, uid)?.itemCount).toBe(0);
    expect(decodeList('unknown', { ...listData, type: 'legacy' }, uid)).toBeNull();
    expect(decodeListItem('incomplete', { ...itemData, createdAt: undefined }, uid, want)).toBeNull();
    expect(decodeListItem('want', { ...itemData, wantFields: { targetPrice: 0, priority: 'high', privateNote: '  My note  ' } }, uid, want)?.fields)
      .toEqual([{ label: 'Target price', value: '$0.00' }, { label: 'Priority', value: 'High' }, { label: 'Private note', value: 'My note' }]);
    expect(decodeListItem('tried', { ...itemData, triedFields: { rating: 0, wouldBuy: 'maybe' } }, uid, tried)?.fields)
      .toEqual([{ label: 'Rating', value: '0 / 5' }, { label: 'Would buy again', value: 'Maybe' }]);
  });

  it('rejects list ownership and item parent mismatches', () => {
    expect(() => decodeList('wrong', { ...listData, userId: 'other' }, uid)).toThrow('ownership mismatch');
    expect(() => decodeListItem('wrong', { ...itemData, userId: 'other' }, uid, want)).toThrow('ownership mismatch');
    expect(() => decodeListItem('wrong', { ...itemData, listId: 'other' }, uid, want)).toThrow('parent mismatch');
  });

  it('sorts lists by update, Want by saved order and Tried by creation date', () => {
    const items = [
      decodeListItem('unordered', { ...itemData, createdAt: Timestamp.fromMillis(4) }, uid, want)!,
      decodeListItem('first', { ...itemData, sortOrder: 0 }, uid, want)!,
      decodeListItem('second', { ...itemData, sortOrder: 1, createdAt: Timestamp.fromMillis(1) }, uid, want)!,
    ];
    expect(sortLists([want, { ...want, id: 'recent', updatedAt: 9 }]).map(list => list.id)).toEqual(['recent', 'weekend']);
    expect(sortListItems(items, 'want').map(item => item.id)).toEqual(['first', 'second', 'unordered']);
    expect(sortListItems(items, 'tried').map(item => item.id)).toEqual(['unordered', 'first', 'second']);
    expect(displayedItemCount(want)).toBe(7);
    expect(displayedItemCount(want, { records: items, partial: false })).toBe(3);
    expect(displayedItemCount(want, { records: items, partial: true })).toBeNull();
  });
});

describe('Linked bottles', () => {
  const item = decodeListItem('link', { ...itemData, linkedBottleId: 'archived' }, uid, want)!;

  it('reads the same owner’s archived bottle directly and handles a missing record', async () => {
    reads.mockResolvedValueOnce(document({ userId: uid, status: 'Archived', name: 'My archived bottle' })).mockResolvedValueOnce(document());
    await expect(readLinkedBottle(runtime, uid, item, signal())).resolves.toMatchObject({ status: 'Archived', name: 'My archived bottle' });
    expect(reads.mock.calls[0][0].path).toBe('users/list-owner/bottles/archived');
    await expect(readLinkedBottle(runtime, uid, item, signal())).resolves.toBeNull();
  });

  it('does not read paths for absent or invalid links', async () => {
    const invalid = decodeListItem('link', { ...itemData, linkedBottleId: 'users/other/bottles/private' }, uid, want)!;
    await expect(readLinkedBottle(runtime, uid, invalid, signal())).resolves.toBeNull();
    expect(reads).not.toHaveBeenCalled();
  });

  it('preserves the exact linked document ID when a legacy ID contains spaces', async () => {
    const legacy = decodeListItem('link', { ...itemData, linkedBottleId: ' archived ' }, uid, want)!;
    reads.mockResolvedValueOnce(document());
    await expect(readLinkedBottle(runtime, uid, legacy, signal())).resolves.toBeNull();
    expect(reads.mock.calls[0][0].path).toBe('users/list-owner/bottles/ archived ');
  });

  it('discards a response after account switch or cancellation', async () => {
    reads.mockImplementationOnce(async () => {
      auth.currentUser = { uid: 'other', isAnonymous: false };
      return document({ userId: uid });
    });
    await expect(readLinkedBottle(runtime, uid, item, signal())).rejects.toMatchObject({ code: 'session/account-changed' });
    auth.currentUser = { uid, isAnonymous: false };
    const controller = new AbortController();
    reads.mockImplementationOnce(async () => {
      controller.abort();
      return document({ userId: uid });
    });
    await expect(readLinkedBottle(runtime, uid, item, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  });
});
