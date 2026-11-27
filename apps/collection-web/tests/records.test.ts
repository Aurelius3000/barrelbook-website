import { describe, expect, it } from 'vitest';
import { decodeBottle, decodePlan, ownedPhotoPath, statusLabel } from '../src/lib/records';

describe('canonical collection records', () => {
  it('rejects a record belonging to another owner, even under an otherwise readable path', () => { expect(() => decodeBottle('b', { userId: 'bob', name: 'Private' }, 'alice')).toThrow(); });
  it('preserves unknown values without inventing prices, ratings, fill or proof', () => { const b = decodeBottle('b', { userId: 'alice', brand: 'Sample', release: 'Single Barrel' }, 'alice'); expect(b.name).toBe('Sample Single Barrel'); expect([b.proof, b.fillLevel, b.rating, b.purchasePrice]).toEqual([null, null, null, null]); expect(b.quantity).toBe(1); });
  it('keeps zero distinct from missing values and matches canonical lifecycle values', () => { const b = decodeBottle('b', { userId: 'alice', proof: 0, fillLevel: 0, rating: 0, purchasePrice: 0, quantity: 3, status: 'Finished', notes: 'Private notes', tastingNotes: 'Nose: oak\nPalate: cherry\nFinish: long' }, 'alice'); expect([b.proof, b.fillLevel, b.rating, b.purchasePrice, b.quantity]).toEqual([0, 0, 0, 0, 3]); expect(statusLabel(b.status)).toBe('Empty'); expect(b.tastingNotes).toContain('\nPalate: cherry\n'); });
  it('reads legacy and multi-photo records with a safe cover index', () => { const legacy = decodeBottle('b', { userId: 'alice', imageURL: 'legacy' }, 'alice'); expect(legacy.photos).toEqual(['legacy']); const newer = decodeBottle('b', { userId: 'alice', imageURLs: ['one', 'two'], primaryImageIndex: 99 }, 'alice'); expect(newer.primaryImageIndex).toBe(1); });
  it('does not silently treat an unknown status as unopened', () => { expect(decodeBottle('b', { userId: 'alice', status: 'surprise' }, 'alice').status).toBe('Unknown'); });
  it('does not default an unavailable server plan to Free', () => { expect(() => decodePlan({ success: true })).toThrow(); expect(() => decodePlan({ success: false, plan: { planTier: 'pro', planCycle: 'annual' } })).toThrow(); });
});

describe('private image references', () => {
  const bucket = 'approved.appspot.com';
  it('extracts an owned path while discarding download tokens', () => { expect(ownedPhotoPath(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o/users%2Falice%2Fbottles%2Fb%2Ffront.jpg?alt=media&token=private`, 'alice', bucket)).toBe('users/alice/bottles/b/front.jpg'); });
  it('supports gs references and exact owned raw paths', () => { expect(ownedPhotoPath(`gs://${bucket}/users/alice/bottles/b/front.jpg`, 'alice', bucket)).toBe('users/alice/bottles/b/front.jpg'); });
  it.each([
    'users/bob/bottles/b/front.jpg', 'users/alice/lists/l/items/i/front.jpg',
    'users/alice/bottles/../bob/front.jpg', 'users/alice/bottles/b\\front.jpg',
    'https://evil.example/users/alice/bottles/front.jpg', 'gs://other.appspot.com/users/alice/bottles/b/front.jpg',
    `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/users%2Fbob%2Fbottles%2Fb%2Ffront.jpg`,
  ])('rejects foreign, traversal and arbitrary external references: %s', value => { expect(ownedPhotoPath(value, 'alice', bucket)).toBeNull(); });
});

describe('authoritative edit adapter', () => {
  it('keeps raw optional/unknown values distinct from read-only defaults', async () => {
    const { decodeEditBaseline } = await import('../src/lib/records');
    const baseline = decodeEditBaseline({ success: true, baseline: { bottleId: 'b', version: '123:000000042', fields: { brand: 'Fixture', proof: 'legacy', notes: '', purchasePrice: 0 } } }, 'b');
    expect(baseline.fields).toEqual({ brand: 'Fixture', proof: 'legacy', notes: '', purchasePrice: 0 }); expect(Object.hasOwn(baseline.fields, 'quantity')).toBe(false);
  });
  it('rejects mismatched identity, rounded versions and fields outside the edit contract', async () => {
    const { decodeEditBaseline } = await import('../src/lib/records');
    for (const baseline of [{ bottleId: 'other', version: '1:000000001', fields: {} }, { bottleId: 'b', version: '1:1', fields: {} }, { bottleId: 'b', version: '1:000000001', fields: { userId: 'other' } }]) expect(() => decodeEditBaseline({ success: true, baseline }, 'b')).toThrow();
  });
});
