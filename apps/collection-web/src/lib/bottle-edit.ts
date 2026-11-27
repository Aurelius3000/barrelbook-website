import { EDIT_FIELDS, type EditBaseline, type EditField } from './records';
export type Draft = Record<EditField, string>;
export type Patch = Partial<Record<EditField, string | number | boolean | string[] | null>>;
type Kind = 'text' | 'number' | 'integer' | 'boolean' | 'date' | 'tags' | 'status' | 'textarea';
export interface EditControl { key: EditField; label: string; kind: Kind; required?: boolean }
export const EDIT_SECTIONS: { name: string; fields: EditControl[] }[] = [
  { name: 'Basic information', fields: [
    { key: 'brand', label: 'Brand', kind: 'text', required: true }, { key: 'name', label: 'Bottle name', kind: 'text' }, { key: 'release', label: 'Release', kind: 'text' }, { key: 'edition', label: 'Edition / batch', kind: 'text' }, { key: 'type', label: 'Type', kind: 'text' }, { key: 'distilledBy', label: 'Distilled by', kind: 'text' }, { key: 'size', label: 'Bottle size', kind: 'text' }, { key: 'isFinished', label: 'Cask finished', kind: 'boolean' }, { key: 'finishDetails', label: 'Finish details', kind: 'text' }, { key: 'mashBill', label: 'Mash bill', kind: 'text' },
  ] },
  { name: 'Barrel information', fields: [
    { key: 'proof', label: 'Proof', kind: 'number', required: true }, { key: 'ageStatement', label: 'Age statement', kind: 'text' }, { key: 'barrelNumber', label: 'Barrel number', kind: 'text' }, { key: 'bottleNumber', label: 'Bottle number', kind: 'text' }, { key: 'totalBottles', label: 'Total bottles in release', kind: 'text' }, { key: 'warehouse', label: 'Warehouse', kind: 'text' }, { key: 'floor', label: 'Floor', kind: 'text' }, { key: 'bottlingDate', label: 'Bottling date', kind: 'date' },
  ] },
  { name: 'Store & purchase', fields: [
    { key: 'isStorePick', label: 'Store pick', kind: 'boolean' }, { key: 'storeName', label: 'Store name', kind: 'text' }, { key: 'selectionDate', label: 'Selection date', kind: 'date' }, { key: 'pickerName', label: 'Picked by', kind: 'text' }, { key: 'purchasePrice', label: 'Purchase price ($)', kind: 'number' },
  ] },
  { name: 'Valuation', fields: [{ key: 'msrp', label: 'MSRP ($)', kind: 'number' }, { key: 'secondaryPrice', label: 'Secondary estimate ($)', kind: 'number' }] },
  { name: 'Inventory', fields: [{ key: 'quantity', label: 'Quantity', kind: 'integer', required: true }, { key: 'status', label: 'Status', kind: 'status', required: true }, { key: 'fillLevel', label: 'Fill level (%)', kind: 'integer', required: true }, { key: 'storageLocation', label: 'Storage location', kind: 'text' }] },
  { name: 'Tags & tasting', fields: [{ key: 'tags', label: 'Tags (one per line)', kind: 'tags' }, { key: 'rating', label: 'My rating (0–5)', kind: 'number' }, { key: 'tastingNotes', label: 'Tasting notes', kind: 'textarea' }] },
  { name: 'Private notes', fields: [{ key: 'notes', label: 'Private notes', kind: 'textarea' }] },
];
const controls = EDIT_SECTIONS.flatMap(section => section.fields);
export function draftFrom(baseline: EditBaseline): Draft {
  return Object.fromEntries(EDIT_FIELDS.map(key => {
    const value = baseline.fields[key];
    const control = controls.find(field => field.key === key)!;
    const text = control.kind === 'tags' ? Array.isArray(value) && value.every(v => typeof v === 'string') ? value.join('\n') : '' : control.kind === 'date' ? typeof value === 'string' ? value.slice(0, 10) : '' : ['string', 'number', 'boolean'].includes(typeof value) ? String(value) : '';
    return [key, text];
  })) as Draft;
}
export function changeDraft(draft: Draft, key: EditField, value: string): Draft {
  const next = { ...draft, [key]: value };
  if (key === 'status') {
    if (value === 'Unopened') next.fillLevel = '100';
    if (value === 'Finished') next.fillLevel = '0';
    if (value === 'Opened' && !(Number(next.fillLevel) > 0 && Number(next.fillLevel) < 100)) next.fillLevel = '90';
  }
  if (key === 'fillLevel' && value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 100 && next.status !== 'Archived') next.status = Number(value) === 100 ? 'Unopened' : Number(value) === 0 ? 'Finished' : 'Opened';
  if (key === 'isFinished' && value === 'false') next.finishDetails = '';
  if (key === 'isStorePick' && value === 'false') { next.storeName = ''; next.selectionDate = ''; next.pickerName = ''; }
  return next;
}
export function buildPatch(baseline: EditBaseline, draft: Draft): { patch: Patch; errors: Partial<Record<EditField, string>> } {
  const initial = draftFrom(baseline), patch: Patch = {}, errors: Partial<Record<EditField, string>> = {};
  for (const field of controls) {
    const { key, kind, label } = field;
    if (draft[key] === initial[key]) continue;
    const value = draft[key];
    if (value === '' && !['tags', 'boolean', 'status'].includes(kind)) {
      if (field.required) errors[key] = `${label} is required.`;
      else if (['name', 'release', 'size'].includes(key)) patch[key] = '';
      else patch[key] = null;
    } else if (kind === 'number' || kind === 'integer') {
      const number = Number(value);
      if (!value.trim() || !Number.isFinite(number) || number < 0 || (kind === 'integer' && !Number.isSafeInteger(number)) || (key === 'quantity' && number < 1) || (key === 'fillLevel' && number > 100) || (key === 'rating' && number > 5)) errors[key] = `Enter a valid ${label.toLowerCase()}.`;
      else patch[key] = number;
    } else if (kind === 'boolean') {
      if (!['true', 'false'].includes(value)) errors[key] = 'Choose Yes or No.'; else patch[key] = value === 'true';
    } else if (kind === 'status') {
      if (!['Unopened', 'Opened', 'Finished'].includes(value) || initial.status === 'Archived') errors[key] = 'Archive and restore are managed separately.'; else patch[key] = value;
    } else if (kind === 'tags') {
      const tags = [...new Set(value.split('\n').map(tag => tag.trim()).filter(Boolean))];
      if (tags.length > 100 || tags.some(tag => tag.length > 100)) errors[key] = 'Use up to 100 tags, each up to 100 characters.'; else patch[key] = tags;
    } else if (kind === 'date') {
      const date = new Date(`${value}T00:00:00.000Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) errors[key] = 'Enter a valid date.'; else patch[key] = value;
    } else {
      if (value.length > (kind === 'textarea' ? 20000 : 1024) || (key === 'brand' && !value.trim())) errors[key] = `Enter a valid ${label.toLowerCase()}.`;
      else patch[key] = value;
    }
  }
  // Clearing dependent optional fields must also remove a legacy empty/invalid stored value.
  if (patch.isFinished === false && Object.hasOwn(baseline.fields, 'finishDetails')) patch.finishDetails = null;
  if (patch.isStorePick === false) for (const key of ['storeName', 'selectionDate', 'pickerName'] as const) if (Object.hasOwn(baseline.fields, key)) patch[key] = null;
  return { patch, errors };
}
export function isDirty(baseline: EditBaseline, draft: Draft): boolean {
  const initial = draftFrom(baseline);
  return EDIT_FIELDS.some(key => initial[key] !== draft[key]);
}
export type Reconciliation = 'unchanged' | 'matches-unconfirmed' | 'changed';
export function reconcileSave(attempt: { baseline: EditBaseline; patch: Patch }, current: EditBaseline): Reconciliation {
  if (current.bottleId !== attempt.baseline.bottleId) throw new Error('Bottle changed');
  if (current.version === attempt.baseline.version) return 'unchanged';
  return Object.entries(attempt.patch).every(([key, value]) => value === null ? !Object.hasOwn(current.fields, key) : JSON.stringify(['bottlingDate', 'selectionDate'].includes(key) && typeof current.fields[key as EditField] === 'string' ? (current.fields[key as EditField] as string).slice(0, 10) : current.fields[key as EditField]) === JSON.stringify(value)) ? 'matches-unconfirmed' : 'changed';
}

// A rejected retry says nothing about an earlier request whose acknowledgement was lost.
export function saveFailureState(retryingUnconfirmed: boolean, error: { uncertain?: boolean; status?: number }): 'uncertain' | 'conflict' | 'idle' {
  if (retryingUnconfirmed || error.uncertain) return 'uncertain';
  return error.status === 409 ? 'conflict' : 'idle';
}
