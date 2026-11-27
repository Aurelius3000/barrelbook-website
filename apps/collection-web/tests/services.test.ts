import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseEnvironment, canEditBottle } from '../src/lib/config';
import { friendlyAuthError, readServerPlan, requestService, requestBottleEdit, ServiceError } from '../src/lib/services';

const config = parseEnvironment({ apiKey: 'key', authDomain: 'project.firebaseapp.com', projectId: 'project', appId: 'app', storageBucket: 'project.appspot.com', appCheckSiteKey: 'key' }, 'production', 'app.barrelbook.app');
afterEach(() => vi.unstubAllGlobals());
describe('existing backend contracts', () => {
  it('sends Firebase ID and App Check tokens only to the configured function origin', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, plan: { planTier: 'plus', planCycle: 'annual' } })));
    vi.stubGlobal('fetch', fetcher);
    expect(await readServerPlan(config, { idToken: 'id', appCheckToken: 'check' })).toEqual({ tier: 'plus', cycle: 'annual' });
    expect(fetcher).toHaveBeenCalledWith('https://us-central1-project.cloudfunctions.net/getCredits', expect.objectContaining({ cache: 'no-store', credentials: 'omit', redirect: 'error', headers: expect.objectContaining({ Authorization: 'Bearer id', 'X-Firebase-AppCheck': 'check' }) }));
  });
  it('never falls back to an unauthenticated or missing-App-Check request', async () => { const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher); await expect(readServerPlan(config, { idToken: 'id' })).rejects.toBeInstanceOf(ServiceError); await expect(readServerPlan(config, { appCheckToken: 'check' })).rejects.toBeInstanceOf(ServiceError); expect(fetcher).not.toHaveBeenCalled(); });
  it.each([401, 403, 429, 500])('preserves service failure %s without inventing a plan', async status => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status }))); await expect(readServerPlan(config, { idToken: 'id', appCheckToken: 'check' })).rejects.toMatchObject({ status }); });
  it('uses BarrelBook password recovery without requiring an existing session', async () => { const fetcher = vi.fn().mockResolvedValue(new Response('{"success":true}')); vi.stubGlobal('fetch', fetcher); await requestService(config, 'sendPasswordResetEmail', { appCheckToken: 'check' }, 'collector@example.invalid'); expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('/sendPasswordResetEmail'), expect.objectContaining({ method: 'POST', body: '{"email":"collector@example.invalid"}', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Firebase-AppCheck': 'check' } })); });
  it('does not disclose whether a sign-in email exists', () => { expect(friendlyAuthError({ code: 'auth/user-not-found' })).toBe(friendlyAuthError({ code: 'auth/wrong-password' })); });
  it('distinguishes disabled providers and unconfigured origins from password mistakes', () => { expect(friendlyAuthError({ code: 'auth/operation-not-allowed' })).toContain('isn’t enabled'); expect(friendlyAuthError({ code: 'auth/unauthorized-domain' })).toContain('web address'); });
});

describe('local M3 edit transport', () => {
  const localEnvironment = { apiKey: 'key', authDomain: 'demo-barrelbook-web.firebaseapp.com', projectId: 'demo-barrelbook-web', appId: 'app', storageBucket: 'demo-barrelbook-web.appspot.com', emulators: 'true' };
  const local = parseEnvironment({ ...localEnvironment, localBottleEditing: 'true' }, 'development', '127.0.0.1');
  const body = { bottleId: 'one', expectedVersion: '123:000000001', patch: { notes: 'Edit' } };
  it.each([undefined, 'false', 'TRUE'])('keeps the local preview read-only for edit option %s', async localBottleEditing => {
    const preview = parseEnvironment({ ...localEnvironment, localBottleEditing }, 'development', '127.0.0.1');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    expect(canEditBottle(preview, 'one')).toBe(false);
    for (const endpoint of ['getBottleForEdit', 'updateBottleDetails'] as const) {
      await expect(requestBottleEdit(preview, endpoint, { idToken: 'id' }, body)).rejects.toMatchObject({ status: 503, uncertain: false });
    }
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('keeps hosted editing disabled when the local edit option is supplied', async () => {
    const hosted = parseEnvironment({ apiKey: 'key', authDomain: 'project.firebaseapp.com', projectId: 'project', appId: 'app', storageBucket: 'project.appspot.com', appCheckSiteKey: 'key', localBottleEditing: 'true' }, 'production', 'app.barrelbook.app');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    expect(canEditBottle(hosted, 'one')).toBe(false);
    await expect(requestBottleEdit(hosted, 'updateBottleDetails', { idToken: 'id', appCheckToken: 'check' }, body)).rejects.toMatchObject({ status: 503 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('prevents live/staging edit requests and refuses missing identity before dispatch', async () => {
    const { requestBottleEdit } = await import('../src/lib/services'); const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    await expect(requestBottleEdit(config, 'updateBottleDetails', { idToken: 'id', appCheckToken: 'check' }, body)).rejects.toMatchObject({ status: 503, uncertain: false });
    await expect(requestBottleEdit(local, 'updateBottleDetails', {}, body)).rejects.toMatchObject({ status: 401, uncertain: false }); expect(fetcher).not.toHaveBeenCalled();
  });
  it('sends exactly the immutable baseline/patch and accepts a validated acknowledgement', async () => {
    const { requestBottleEdit } = await import('../src/lib/services');
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, baseline: { bottleId: 'one', version: '124:000000001', fields: { notes: 'Edit' } } }))); vi.stubGlobal('fetch', fetcher);
    expect((await requestBottleEdit(local, 'updateBottleDetails', { idToken: 'id' }, body)).fields.notes).toBe('Edit');
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('/updateBottleDetails'), expect.objectContaining({ method: 'POST', body: JSON.stringify(body), cache: 'no-store', redirect: 'error' }));
  });
  it('distinguishes rejection/conflict from unknown commit outcomes', async () => {
    const { requestBottleEdit } = await import('../src/lib/services');
    for (const status of [400, 401, 403, 404, 409, 429, 500, 503]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
      await expect(requestBottleEdit(local, 'updateBottleDetails', { idToken: 'id' }, body)).rejects.toMatchObject({ status, uncertain: status >= 500 });
    }
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError')));
    await expect(requestBottleEdit(local, 'updateBottleDetails', { idToken: 'id' }, body)).rejects.toMatchObject({ uncertain: true });
    await expect(requestBottleEdit(local, 'getBottleForEdit', { idToken: 'id' }, { bottleId: 'one' })).rejects.toMatchObject({ uncertain: false });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"success":true}')));
    await expect(requestBottleEdit(local, 'updateBottleDetails', { idToken: 'id' }, body)).rejects.toMatchObject({ uncertain: true });
  });
});


describe('staging service policy', () => {
  const id = 'web-m3-staging-qualification-20261029';
  const staging = parseEnvironment({ apiKey: 'key', projectId: 'barrelbook-staging', appId: '1:560188226898:web:ea8c36fdcce8b2a4018e8b', authDomain: 'barrelbook-staging.firebaseapp.com', storageBucket: 'barrelbook-staging.firebasestorage.app', appCheckSiteKey: 'key', stagingEditBottleId: id }, 'production', 'localhost', 'http://localhost:4181');
  it('requires both tokens and fixture capability before fetch', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    for (const credentials of [{ idToken: 'id' }, { appCheckToken: 'check' }]) await expect(requestBottleEdit(staging, 'getBottleForEdit', credentials, { bottleId: id })).rejects.toMatchObject({ status: 401 });
    await expect(requestBottleEdit(staging, 'getBottleForEdit', { idToken: 'id', appCheckToken: 'check' }, { bottleId: 'another' })).rejects.toMatchObject({ status: 503 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('keeps failed staging writes uncertain and version conflicts explicit', async () => {
    for (const status of [409, 503]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
      await expect(requestBottleEdit(staging, 'updateBottleDetails', { idToken: 'id', appCheckToken: 'check' }, { bottleId: id, expectedVersion: '1:000000001', patch: { notes: 'draft' } })).rejects.toMatchObject({ status, uncertain: status === 503 });
    }
  });
});
