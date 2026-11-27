export type BottleStatus = 'Unopened' | 'Opened' | 'Finished' | 'Archived' | 'Unknown';
export interface BottleRecord {
  id: string; ownerId: string; name: string; brand: string; release: string;
  edition: string | null; type: string | null; proof: number | null; size: string | null;
  status: BottleStatus; fillLevel: number | null; quantity: number; rating: number | null;
  tags: string[]; notes: string | null; tastingNotes: string | null;
  barrelNumber: string | null; warehouse: string | null; distilledBy: string | null;
  purchasePrice: number | null; msrp: number | null; secondaryPrice: number | null;
  storageLocation: string | null; photos: string[]; primaryImageIndex: number;
}
export interface AccountProfile { displayName: string; username: string | null }
export interface PlanSnapshot { tier: string; cycle: string }

const text = (v: unknown): string | null => typeof v === 'string' && v.trim() ? v.trim() : null;
const number = (v: unknown, min = 0, max = Infinity): number | null => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : null;

export function decodeProfile(data: Record<string, unknown>, ownerId: string): AccountProfile {
  if (data.userId !== undefined && data.userId !== ownerId) throw new Error('Account ownership mismatch');
  return { displayName: text(data.displayName) || text(data.username) || 'Your account', username: text(data.username) };
}

export function decodeBottle(id: string, data: Record<string, unknown>, ownerId: string): BottleRecord {
  if (data.userId !== ownerId) throw new Error('Bottle ownership mismatch');
  const brand = text(data.brand) || '';
  const release = text(data.release) || '';
  const photos = Array.isArray(data.imageURLs) ? data.imageURLs.filter((p): p is string => typeof p === 'string' && p.trim().length > 0) : [];
  if (!photos.length && text(data.imageURL)) photos.push(text(data.imageURL)!);
  const index = number(data.primaryImageIndex) ?? 0;
  const status = ['Unopened', 'Opened', 'Finished', 'Archived'].includes(String(data.status)) ? data.status as BottleStatus : 'Unknown';
  return {
    id, ownerId, name: text(data.name) || [brand, release].filter(Boolean).join(' ') || 'Unnamed bottle', brand, release,
    edition: text(data.edition), type: text(data.type), proof: number(data.proof), size: text(data.size), status,
    fillLevel: Number.isInteger(data.fillLevel) ? number(data.fillLevel, 0, 100) : null,
    quantity: typeof data.quantity === 'number' && Number.isInteger(data.quantity) ? Math.max(data.quantity, 1) : 1,
    rating: number(data.rating, 0, 5), tags: Array.isArray(data.tags) ? [...new Set(data.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0))] : [],
    notes: text(data.notes), tastingNotes: text(data.tastingNotes), barrelNumber: text(data.barrelNumber), warehouse: text(data.warehouse), distilledBy: text(data.distilledBy),
    purchasePrice: number(data.purchasePrice), msrp: number(data.msrp), secondaryPrice: number(data.secondaryPrice), storageLocation: text(data.storageLocation), photos,
    primaryImageIndex: Math.min(Math.max(Math.trunc(index), 0), Math.max(photos.length - 1, 0)),
  };
}

export function decodePlan(value: unknown): PlanSnapshot {
  if (typeof value !== 'object' || value === null) throw new Error('Plan unavailable');
  const body = value as { success?: unknown; plan?: { planTier?: unknown; planCycle?: unknown } };
  const tier = text(body.plan?.planTier), cycle = text(body.plan?.planCycle);
  if (body.success !== true || !tier || !cycle) throw new Error('Plan unavailable');
  return { tier, cycle };
}

export const statusLabel = (status: BottleStatus) => status === 'Finished' ? 'Empty' : status;
export const planLabel = (tier: string) => ({ basic: 'Free', free: 'Free', plus: 'Plus', pro: 'Pro' })[tier.toLowerCase()] || 'Current plan';

export function ownedPhotoPath(value: string, ownerId: string, bucket: string): string | null {
  let path: string;
  try {
    if (value.startsWith('gs://')) {
      const url = new URL(value); if (url.hostname !== bucket) return null;
      path = decodeURIComponent(url.pathname.slice(1));
    } else if (value.startsWith('https://')) {
      const url = new URL(value);
      if (url.hostname !== 'firebasestorage.googleapis.com' || url.protocol !== 'https:' || url.port) return null;
      const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
      if (!match || decodeURIComponent(match[1]) !== bucket) return null;
      path = decodeURIComponent(match[2]);
    } else { path = value; }
  } catch { return null; }
  if (!path.startsWith(`users/${ownerId}/bottles/`) || path.split('/').some(s => !s || s === '.' || s === '..') || /[\u0000-\u001f\\]/.test(path)) return null;
  return path;
}

// Edit baselines are separate from display records: absent/unknown values are never defaulted for writing.
export const EDIT_FIELDS = ['name', 'brand', 'release', 'edition', 'type', 'distilledBy', 'mashBill', 'proof', 'size', 'isFinished', 'finishDetails', 'ageStatement', 'barrelNumber', 'bottleNumber', 'totalBottles', 'warehouse', 'floor', 'bottlingDate', 'isStorePick', 'storeName', 'selectionDate', 'pickerName', 'purchasePrice', 'quantity', 'msrp', 'secondaryPrice', 'fillLevel', 'status', 'storageLocation', 'tags', 'rating', 'tastingNotes', 'notes'] as const;
export type EditField = typeof EDIT_FIELDS[number];
export interface EditBaseline { bottleId: string; version: string; fields: Partial<Record<EditField, unknown>> }
export function decodeEditBaseline(value: unknown, bottleId: string): EditBaseline {
  const body = value as { success?: unknown; baseline?: EditBaseline } | null;
  const baseline = body?.baseline;
  if (body?.success !== true || !baseline || baseline.bottleId !== bottleId || !/^\d{1,12}:\d{9}$/.test(baseline.version) || !baseline.fields || typeof baseline.fields !== 'object' || Array.isArray(baseline.fields) || Object.keys(baseline.fields).some(key => !EDIT_FIELDS.includes(key as EditField))) throw new Error('Invalid edit response');
  return baseline;
}
export function recordFromEdit(bottle: BottleRecord, baseline: EditBaseline): BottleRecord {
  if (baseline.bottleId !== bottle.id) throw new Error('Bottle changed');
  return decodeBottle(bottle.id, { ...baseline.fields, userId: bottle.ownerId, imageURLs: bottle.photos, primaryImageIndex: bottle.primaryImageIndex }, bottle.ownerId);
}
