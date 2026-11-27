import { afterEach, describe, expect, it, vi } from 'vitest';
const sdk = vi.hoisted(() => ({ getToken: vi.fn() }));
vi.mock('firebase/app-check', async importOriginal => ({ ...await importOriginal<typeof import('firebase/app-check')>(), getToken: sdk.getToken }));
import { readBottleForEdit, updateBottleDetails, type Runtime } from '../src/lib/firebase';
import { parseEnvironment } from '../src/lib/config';

const id = 'web-m3-staging-qualification-20261029';
const config = parseEnvironment({ apiKey: 'key', projectId: 'barrelbook-staging', appId: '1:560188226898:web:ea8c36fdcce8b2a4018e8b', authDomain: 'barrelbook-staging.firebaseapp.com', storageBucket: 'barrelbook-staging.firebasestorage.app', appCheckSiteKey: 'key', stagingEditBottleId: id }, 'production', 'localhost', 'http://localhost:4181');
function runtime() {
  return { auth: { currentUser: { uid: 'owner', isAnonymous: false, getIdToken: vi.fn().mockResolvedValue('id-token') } }, appCheck: {}, config } as unknown as Runtime;
}
const baseline = { bottleId: id, version: '1:000000001', fields: { notes: 'new' } };
afterEach(() => { vi.unstubAllGlobals(); vi.resetAllMocks(); });
describe('staging edit SDK credentials', () => {
  it('sends fresh App Check and ID tokens for both read and write', async () => {
    sdk.getToken.mockResolvedValue({ token: 'app-check-token' });
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ success: true, baseline }))));
    vi.stubGlobal('fetch', fetcher);
    const r = runtime();
    await readBottleForEdit(r, 'owner', id);
    await updateBottleDetails(r, 'owner', baseline, { notes: 'new' });
    expect(sdk.getToken).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Bearer id-token', 'X-Firebase-AppCheck': 'app-check-token' });
  });
  it('never makes a request when App Check fails or is missing', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    sdk.getToken.mockRejectedValue(new Error('attestation unavailable'));
    await expect(readBottleForEdit(runtime(), 'owner', id)).rejects.toThrow();
    const r = runtime(); r.appCheck = null;
    await expect(readBottleForEdit(r, 'owner', id)).rejects.toMatchObject({ status: 401 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('suppresses a request when the account changes during token collection', async () => {
    const r = runtime(), fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    sdk.getToken.mockImplementation(async () => { Object.assign(r.auth, { currentUser: null }); return { token: 'check' }; });
    await expect(readBottleForEdit(r, 'owner', id)).rejects.toMatchObject({ code: 'session/account-changed' });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects another bottle before collecting credentials', async () => {
    await expect(readBottleForEdit(runtime(), 'owner', 'another')).rejects.toMatchObject({ status: 503 });
    expect(sdk.getToken).not.toHaveBeenCalled();
  });
});
