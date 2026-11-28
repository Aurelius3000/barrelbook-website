import { type BottleRecord } from './records';

export const DISPLAY_LIFETIME = 8 * 60 * 60 * 1000;
export const PREVIEW_LIFETIME = 20 * 60 * 1000;
// Only these explicitly supported bottle fields can enter the guest snapshot.
const summaryFields = {
  name: 'Bottle name',
  brand: 'Brand',
  type: 'Type',
  proof: 'Proof',
  age: 'Age',
  status: 'Status',
  fill: 'Fill level',
  pick: 'Store pick',
} as const;
const detailFields = {
  release: 'Release',
  edition: 'Edition / batch',
  distilledBy: 'Distilled by',
  size: 'Bottle size',
  mashBill: 'Mash bill',
  isFinished: 'Cask finished',
  finishDetails: 'Finish details',
  barrelNumber: 'Barrel number',
  bottleNumber: 'Bottle number',
  totalBottles: 'Total bottles in release',
  warehouse: 'Warehouse',
  floor: 'Warehouse floor',
  bottlingDate: 'Bottling date',
  storeName: 'Store name',
  pickerName: 'Picked by',
  selectionDate: 'Selection date',
  tags: 'Personal tags',
} as const;
export const guestFields = { ...summaryFields, ...detailFields };
export type GuestField = keyof typeof guestFields;
export type Settings = {
  excluded?: GuestField[];
  shelf: 'whole' | 'open' | 'flight';
  flight: string[];
  values: boolean;
  ratings: boolean;
  seconds: 8 | 12 | 30;
  photos: boolean;
};
export const DEFAULT_DISPLAY: Settings = {
  shelf: 'whole',
  flight: [],
  values: false,
  ratings: true,
  seconds: 12,
  photos: true,
  excluded: [],
};
export type Card = {
  name: string;
  brand?: string;
  type?: string | null;
  proof?: number | null;
  age?: string | null;
  status?: string;
  fill?: number | null;
  pick?: boolean;
  rating?: number | null;
  estimatedValue?: number | null;
  details?: Partial<Record<keyof typeof detailFields, string>>;
  photos: string[];
};
export type Shelf = { cards: Card[]; seconds: 8 | 12 | 30; ratings: boolean };
export type DisplayState = {
  mode: 'owner' | 'locked' | 'expired' | 'guest';
  expires?: number;
  remaining?: number;
};

export function settingsValid(v: Settings): boolean {
  return (
    !!v &&
    (v.excluded === undefined ||
      (Array.isArray(v.excluded) &&
        v.excluded.every((k) => typeof k === 'string' && Object.hasOwn(guestFields, k)))) &&
    ['whole', 'open', 'flight'].includes(v.shelf) &&
    [8, 12, 30].includes(v.seconds) &&
    [v.ratings, v.values, v.photos].every((x) => typeof x === 'boolean') &&
    Array.isArray(v.flight) &&
    v.flight.every((id) => typeof id === 'string') &&
    new Set(v.flight).size === v.flight.length
  );
}

export function selectShelf(records: BottleRecord[], settings: Settings) {
  const selected = new Set(settings.flight);
  return records.filter(
    (b) =>
      (b.status === 'Opened' || b.status === 'Unopened') &&
      (settings.shelf !== 'open' || b.status === 'Opened') &&
      (settings.shelf !== 'flight' || selected.has(b.id)),
  );
}

function detailText(key: keyof typeof detailFields, value: unknown): string | undefined {
  if (value == null) return;
  if (key === 'tags')
    return Array.isArray(value)
      ? value.filter((v) => typeof v === 'string' && v.trim()).join(', ') || undefined
      : undefined;
  if (key === 'isFinished') return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : undefined;
  if (key === 'bottlingDate' || key === 'selectionDate') {
    const date =
      value instanceof Date
        ? value
        : typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function'
          ? value.toDate()
          : null;
    if (date instanceof Date && Number.isFinite(date.getTime())) return date.toISOString().slice(0, 10);
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
    return;
  }
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
}

export function detailEntries(card: Card): [string, string][] {
  return (Object.keys(detailFields) as (keyof typeof detailFields)[]).flatMap((key) => {
    const value = card.details?.[key];
    return value ? [[detailFields[key], value]] : [];
  });
}

export function guestFactEntries(card: Card): [string, string][] {
  const summary: [string, string | number | null | undefined][] = [
    ['Brand', card.brand],
    ['Type', card.type],
    ['Proof', card.proof],
    ['Age', card.age],
    ['Status', card.status],
    ['Fill level', card.fill != null ? card.fill + '% full' : null],
    ['Store pick', card.pick ? 'Yes' : null],
    ['Rating', card.rating != null ? card.rating + ' / 5' : null],
    ['Estimated value', card.estimatedValue != null ? '$' + card.estimatedValue.toFixed(2) : null],
  ];
  return [
    ...summary.flatMap(([label, value]): [string, string][] =>
      value != null && value !== '' ? [[label, String(value)]] : [],
    ),
    ...detailEntries(card),
  ];
}

export function guestCard(
  b: BottleRecord,
  settings: Settings,
  raw: Record<string, unknown> = {},
  position = 1,
): Card {
  const card: Card = {
    name: b.name,
    brand: b.brand,
    type: b.type,
    proof: b.proof,
    age: b.ageStatement ?? null,
    status: b.status,
    fill: b.fillLevel,
    pick: b.isStorePick === true,
    photos: [],
    ...(settings.ratings && { rating: b.rating }),
    ...(settings.values && { estimatedValue: b.secondaryPrice }),
  };
  // Older setup clients did not offer a preview of expanded fields.
  if (!settings.excluded) return card;
  const hidden = new Set(settings.excluded);
  for (const key of Object.keys(summaryFields) as (keyof typeof summaryFields)[]) {
    if (!hidden.has(key)) continue;
    if (key === 'name') card.name = 'Bottle ' + position;
    else delete card[key];
  }
  if (
    !hidden.has('name') &&
    !(typeof raw.name === 'string' && raw.name.trim().length > 0) &&
    (hidden.has('brand') || hidden.has('release'))
  ) {
    card.name =
      [!hidden.has('brand') && b.brand, !hidden.has('release') && b.release].filter(Boolean).join(' ') ||
      'Bottle ' + position;
  }
  for (const key of Object.keys(detailFields) as (keyof typeof detailFields)[]) {
    if (hidden.has(key)) continue;
    const value = detailText(key, raw[key]);
    if (value) (card.details ??= {})[key] = value;
  }
  return card;
}

export const categories = [
  'Everything',
  'Bourbon',
  'Rye',
  'Store picks',
  'Open to pour',
  'Five stars',
] as const;
export function inCategory(card: Card, category: string) {
  switch (category) {
    case 'Bourbon':
    case 'Rye':
      return card.type?.toLowerCase().includes(category.toLowerCase()) ?? false;
    case 'Store picks':
      return card.pick;
    case 'Open to pour':
      return card.status === 'Opened';
    case 'Five stars':
      return card.rating === 5;
    default:
      return true;
  }
}
