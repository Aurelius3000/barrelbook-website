import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../src/app/api/bar-display/route';
import { DEFAULT_DISPLAY } from '../src/lib/bar-display';
import { readFileSync } from 'node:fs';

const origin = 'https://app-staging.barrelbook.app';
const project = 'barrelbook-staging-v2';
const appId = '1:387460631515:web:d70b9207059b90c55075fe';
const bucket = project + '.firebasestorage.app';
const account = 'bar-display@' + project + '.iam.gserviceaccount.com';
const alice = 'web-qa-alice';
const image = readFileSync(new URL('./fixtures/bookers-1-front.jpg', import.meta.url));
const uid = vi.hoisted(() => vi.fn());
vi.mock('firebase-admin/auth', () => ({ getAuth: () => ({ verifyIdToken: async () => ({
  uid: uid(), email_verified: true, firebase: { sign_in_provider: 'password' },
}) }) }));
vi.mock('firebase-admin/app-check', () => ({ getAppCheck: () => ({ verifyToken: async () => ({ appId }) }) }));
vi.mock('@vercel/oidc', () => ({ getVercelOidcToken: async () => 'fixture-oidc' }));

function status(at = origin) {
  return GET(new Request(at + '/api/bar-display'));
}
function preview() {
  return POST(new Request(origin + '/api/bar-display', {
    method: 'POST',
    headers: { Origin: origin, Authorization: 'Bearer fixture', 'X-Firebase-AppCheck': 'fixture' },
    body: JSON.stringify({ action: 'preview', settings: DEFAULT_DISPLAY }),
  }));
}

beforeEach(() => {
  nock.disableNetConnect();
  uid.mockReturnValue(alice);
  vi.stubEnv('BARRELBOOK_DISPLAY_HOSTED', 'true');
  vi.stubEnv('BARRELBOOK_PILOT_ORIGIN', origin);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', project);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', appId);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', bucket);
  vi.stubEnv('BARRELBOOK_WEB_ACCESS_MODE', 'pilot');
  vi.stubEnv('BARRELBOOK_PILOT_UIDS', alice);
  vi.stubEnv('BARRELBOOK_PILOT_WIF_PROVIDER', 'projects/387460631515/locations/global/workloadIdentityPools/fixture/providers/vercel');
  vi.stubEnv('BARRELBOOK_PILOT_SERVICE_ACCOUNT', account);
  for (const key of ['NEXT_PUBLIC_USE_FIREBASE_EMULATORS', 'FIRESTORE_EMULATOR_HOST',
    'FIREBASE_AUTH_EMULATOR_HOST', 'STORAGE_EMULATOR_HOST', 'FIREBASE_STORAGE_EMULATOR_HOST']) vi.stubEnv(key, undefined);
});
afterEach(() => { nock.cleanAll(); nock.enableNetConnect(); vi.unstubAllEnvs(); });

describe('hosted display', () => {
  it.each([
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'barrelbook-273cd'],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', 'other-app'],
    ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'production-bucket'],
    ['BARRELBOOK_WEB_ACCESS_MODE', 'members'],
    ['BARRELBOOK_PILOT_UIDS', ' , '],
    ['BARRELBOOK_DISPLAY_HOSTED', 'false'],
    ['FIRESTORE_EMULATOR_HOST', '127.0.0.1:9480'],
  ])('rejects a mismatched or disabled %s', async (key, value) => {
    vi.stubEnv(key, value);
    expect((await status()).status).toBe(404);
  });

  it('rejects a different origin and a signed-in account outside the fixture pilot', async () => {
    expect((await status('https://unlisted.example')).status).toBe(404);
    uid.mockReturnValue('other-fixture-owner');
    expect((await preview()).status).toBe(403);
  });

  it('opens the signed-out owner screen on the production and staging paths', async () => {
    expect(await (await status()).json()).toEqual({ mode: 'owner' });
    const prod = 'https://app.barrelbook.app';
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'barrelbook-273cd');
    vi.stubEnv('BARRELBOOK_PILOT_ORIGIN', prod);
    expect((await status(prod)).status).toBe(503); // staging identity cannot serve production
    vi.stubEnv('BARRELBOOK_PILOT_SERVICE_ACCOUNT', 'fixture@barrelbook-273cd.iam.gserviceaccount.com');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'barrelbook-273cd.appspot.com');
    expect(await (await status(prod)).json()).toEqual({ mode: 'owner' });
  });

  it('uses the federated identity for Firestore reads, snapshot writes and the included photo', async () => {
    // Exercise the installed Cloud client transports; all Google responses are local HTTP interceptors.
    const sts = nock('https://sts.googleapis.com').persist().post('/v1/token', body =>
      body.subject_token === 'fixture-oidc' && body.audience.endsWith('/providers/vercel')
    ).reply(200, { access_token: 'fixture-exchange', token_type: 'Bearer', expires_in: 3600 });
    const iam = nock('https://iamcredentials.googleapis.com', { reqheaders: { authorization: 'Bearer fixture-exchange' } })
      .persist().post('/v1/projects/-/serviceAccounts/' + account + ':generateAccessToken')
      .reply(200, { accessToken: 'fixture-access', expireTime: new Date(Date.now() + 3_600_000).toISOString() });
    const authorized = { reqheaders: { authorization: 'Bearer fixture-access' } };
    const db = nock('https://firestore.googleapis.com', authorized);
    const documents = 'projects/' + project + '/databases/(default)/documents';
    const owner = documents + '/users/' + alice;
    const time = '2026-11-27T12:00:00Z';
    const found = (name: string, fields: object) => ({ name, fields, createTime: time, updateTime: time });
    const path = 'users/' + alice + '/bottles/bookers/front.jpg';
    db.post('/v1/' + documents + ':batchGet', body => body.documents[0] === owner).query(true)
      .reply(200, [{ found: found(owner, {}), readTime: time }]);
    db.post('/v1/' + owner + ':runQuery').query(true).reply(200, [{ readTime: time,
      document: found(owner + '/bottles/bookers', {
        userId: { stringValue: alice }, name: { stringValue: 'Booker’s' }, status: { stringValue: 'Opened' },
        imageURL: { stringValue: 'gs://' + bucket + '/' + path },
      }),
    }]);
    db.post('/v1/' + documents + ':commit').query(true).times(3)
      .reply(200, { commitTime: time, writeResults: [{ updateTime: time }] });
    const storage = nock('https://storage.googleapis.com', authorized);
    storage.get('/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(path)).query(true)
      .reply(200, { size: String(image.length), contentType: 'image/jpeg' });
    storage.get('/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(path)).query(true)
      .reply(200, image, { 'Content-Type': 'image/jpeg' });
    const response = await preview();
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('Secure');
    const { shelf } = await response.json();
    expect(shelf.cards).toHaveLength(1);
    expect(shelf.cards[0]).toMatchObject({ name: 'Booker’s', photos: [expect.stringMatching(/^[a-zA-Z0-9]{20}$/)] });
    for (const scope of [sts, iam, db, storage]) scope.done();
  });
});
