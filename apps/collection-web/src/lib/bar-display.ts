import { type BottleRecord } from './records';

export const DISPLAY_LIFETIME = 8 * 60 * 60 * 1000;
export const PREVIEW_LIFETIME = 20 * 60 * 1000;
export type Settings = {
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
};
export type Card = {
  name: string;
  brand: string;
  type: string | null;
  proof: number | null;
  age: string | null;
  status: string;
  fill: number | null;
  pick: boolean;
  rating?: number | null;
  estimatedValue?: number | null;
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

export function guestCard(b: BottleRecord, settings: Settings): Card {
  return {
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
