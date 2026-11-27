import { describe, expect, it } from 'vitest';
import { buildPatch, changeDraft, draftFrom, EDIT_SECTIONS, isDirty, reconcileSave, saveFailureState } from '../src/lib/bottle-edit';
import { EDIT_FIELDS, type EditBaseline } from '../src/lib/records';
const baseline: EditBaseline = { bottleId: 'one', version: '123:000000042', fields: { name: 'Bottle', brand: 'Fixture', status: 'Opened', fillLevel: 50, quantity: 2, rating: 4.5, purchasePrice: 150, notes: 'Old notes', isFinished: true, finishDetails: 'Port cask', isStorePick: true, storeName: 'Shop', selectionDate: '2026-02-01T18:00:00.000Z', pickerName: 'Collector', tags: ['Exact tag', 'Other'] } };
describe('canonical bottle drafts', () => {
  it('covers the edit contract once and does not turn display fallbacks into writes', () => {
    expect(EDIT_SECTIONS.flatMap(section => section.fields.map(field => field.key)).sort()).toEqual([...EDIT_FIELDS].sort());
    const legacy: EditBaseline = { ...baseline, fields: { brand: 'Legacy', proof: 'unknown', quantity: null } };
    const draft = draftFrom(legacy); expect(draft.quantity).toBe(''); expect(draft.proof).toBe('unknown');
    expect(buildPatch(legacy, { ...draft, notes: 'A note' })).toEqual({ patch: { notes: 'A note' }, errors: {} });
    expect(isDirty(legacy, draft)).toBe(false);
  });
  it('sends only intended fields, supports explicit clears and preserves zero', () => {
    const draft = { ...draftFrom(baseline), rating: '', purchasePrice: '0', notes: 'New notes' };
    expect(buildPatch(baseline, draft)).toEqual({ patch: { purchasePrice: 0, rating: null, notes: 'New notes' }, errors: {} });
    expect(isDirty(baseline, draft)).toBe(true);
  });
  it('does not rewrite an untouched timestamp into midnight', () => {
    const draft = draftFrom(baseline); expect(draft.selectionDate).toBe('2026-02-01');
    expect(buildPatch(baseline, draft).patch).toEqual({});
    expect(buildPatch(baseline, { ...draft, selectionDate: '' }).patch).toEqual({ selectionDate: null });
  });
  it('maintains native status/fill dependencies and leaves archive changes out of scope', () => {
    let draft = changeDraft(draftFrom(baseline), 'status', 'Unopened'); expect(buildPatch(baseline, draft).patch).toEqual({ status: 'Unopened', fillLevel: 100 });
    draft = changeDraft(draftFrom(baseline), 'fillLevel', '0'); expect(draft.status).toBe('Finished');
    expect(buildPatch(baseline, { ...draftFrom(baseline), status: 'Archived' }).errors.status).toBeTruthy();
    const archived = { ...baseline, fields: { ...baseline.fields, status: 'Archived' } };
    expect(changeDraft(draftFrom(archived), 'fillLevel', '75').status).toBe('Archived');
    expect(buildPatch(archived, { ...draftFrom(archived), status: 'Opened' }).errors.status).toBeTruthy();
  });
  it('clears dependent optional fields only when the controlling value is explicitly disabled', () => {
    const draft = changeDraft(changeDraft(draftFrom(baseline), 'isFinished', 'false'), 'isStorePick', 'false');
    expect(buildPatch(baseline, draft).patch).toMatchObject({ isFinished: false, finishDetails: null, isStorePick: false, storeName: null, selectionDate: null, pickerName: null });
    expect(buildPatch(baseline, { ...draftFrom(baseline), notes: 'Edit' }).patch).toEqual({ notes: 'Edit' });
  });
  it.each([['quantity', '1.5'], ['quantity', '0'], ['rating', '5.1'], ['proof', '-1'], ['purchasePrice', 'NaN'], ['fillLevel', '101'], ['selectionDate', '2026-02-30'], ['brand', '   ']])('rejects invalid %s %s', (key, value) => {
    expect(buildPatch(baseline, { ...draftFrom(baseline), [key]: value }).errors).toHaveProperty(key);
  });
  it('preserves multiline tasting notes and literal tag semantics', () => {
    const result = buildPatch(baseline, { ...draftFrom(baseline), tastingNotes: 'Nose: oak\nPalate: cherry', tags: 'New tag\nExact tag\nNew tag' });
    expect(result.patch).toEqual({ tags: ['New tag', 'Exact tag'], tastingNotes: 'Nose: oak\nPalate: cherry' });
  });
});
describe('uncertain-save reconciliation without operation receipts', () => {
  const attempt = { baseline, patch: { notes: 'New' } };
  it('allows only the same baseline/patch retry when version is unchanged', () => { expect(reconcileSave(attempt, baseline)).toBe('unchanged'); });
  it('never treats matching newer values as an acknowledgement', () => {
    expect(reconcileSave(attempt, { ...baseline, version: '124:000000000', fields: { ...baseline.fields, notes: 'New' } })).toBe('matches-unconfirmed');
  });
  it('requires review on changed values, missing clears, or another bottle', () => {
    expect(reconcileSave(attempt, { ...baseline, version: '124:000000000' })).toBe('changed');
    expect(reconcileSave({ baseline, patch: { rating: null } }, { ...baseline, version: '124:000000000' })).toBe('changed');
    expect(() => reconcileSave(attempt, { ...baseline, bottleId: 'two' })).toThrow();
  });
});


describe('rejected retries retain the original uncertain attempt', () => {
  it.each([400, 401, 403, 404, 409, 429])('keeps the draft locked after an unconfirmed save then retry rejection %s', status => {
    expect(saveFailureState(true, { status, uncertain: false })).toBe('uncertain');
  });
  it('distinguishes a first-attempt rejection/conflict from an unknown outcome', () => {
    expect(saveFailureState(false, { status: 401 })).toBe('idle');
    expect(saveFailureState(false, { status: 409 })).toBe('conflict');
    expect(saveFailureState(false, { uncertain: true })).toBe('uncertain');
  });
});
