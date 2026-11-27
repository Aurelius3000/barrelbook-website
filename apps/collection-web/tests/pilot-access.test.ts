import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../src/app/api/pilot-access/route';
import { canEditBottle, parseEnvironment } from '../src/lib/config';

const { verifyIdToken, verifyToken, initializeApp, applicationDefault, fromJSON, getVercelOidcToken } = vi.hoisted(() => ({
  verifyIdToken: vi.fn(), verifyToken: vi.fn(), initializeApp: vi.fn(), applicationDefault: vi.fn(),
  fromJSON: vi.fn(), getVercelOidcToken: vi.fn(),
}));
vi.mock('firebase-admin/app', () => ({
  getApps: () => [],
  initializeApp,
  applicationDefault,
}));
vi.mock('firebase-admin/auth', () => ({ getAuth: () => ({ verifyIdToken }) }));
vi.mock('firebase-admin/app-check', () => ({ getAppCheck: () => ({ verifyToken }) }));
vi.mock('@vercel/oidc', () => ({ getVercelOidcToken }));
vi.mock('google-auth-library', () => ({ ExternalAccountClient: { fromJSON } }));

const origin = 'https://app.barrelbook.app';
const appId = '1:123456:web:pilot';
const provider = 'projects/123456/locations/global/workloadIdentityPools/pilot/providers/vercel';
const serviceAccount = 'collection-web-pilot@barrelbook-273cd.iam.gserviceaccount.com';
const account = { uid: 'invited', firebase: { sign_in_provider: 'password' }, email_verified: true };

function request(overrides: Record<string, string> = {}) {
  return new Request(origin + '/api/pilot-access', {
    method: 'POST',
    headers: { origin, authorization: 'Bearer fixture-id-token', 'x-firebase-appcheck': 'fixture-app-token', ...overrides },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'barrelbook-273cd');
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', appId);
  vi.stubEnv('BARRELBOOK_PILOT_ORIGIN', origin);
  vi.stubEnv('BARRELBOOK_PILOT_UIDS', 'invited');
  vi.stubEnv('BARRELBOOK_WEB_ACCESS_MODE', 'pilot');
  vi.stubEnv('BARRELBOOK_PILOT_WIF_PROVIDER', provider);
  vi.stubEnv('BARRELBOOK_PILOT_SERVICE_ACCOUNT', serviceAccount);
  fromJSON.mockReset().mockReturnValue({});
  verifyIdToken.mockReset().mockResolvedValue(account);
  verifyToken.mockReset().mockResolvedValue({ appId });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('pilot access route', () => {
  it('requires admission for a production client even without the staging switch', () => {
    const config = parseEnvironment({
      apiKey: 'fixture', authDomain: 'example.invalid', projectId: 'barrelbook-273cd',
      storageBucket: 'example.invalid', appId, appCheckSiteKey: 'fixture', stagingPilot: 'false',
    }, 'production', 'app.barrelbook.app', origin);
    expect(config.pilotRequired).toBe(true);
    expect(canEditBottle(config, 'fixture')).toBe(false);
  });

  it('admits only the UID in a verified session attested by the pilot app', async () => {
    const result = await POST(request());
    expect(result.status).toBe(204);
    expect(result.headers.get('Cache-Control')).toBe('private, no-store');
    expect(verifyIdToken).toHaveBeenCalledWith('fixture-id-token', true);
    expect(verifyToken).toHaveBeenCalledWith('fixture-app-token');
    expect(await result.text()).toBe('');
    verifyIdToken.mockResolvedValue({ ...account, uid: 'uninvited' });
    expect((await POST(request({ 'x-uid': 'invited' }))).status).toBe(403);
  });

  it('rejects signed-out, cross-origin and closed pilot requests', async () => {
    expect((await POST(request({ authorization: '' }))).status).toBe(401);
    expect((await POST(request({ origin: 'https://other.example' }))).status).toBe(403);
    vi.stubEnv('BARRELBOOK_PILOT_UIDS', '');
    expect((await POST(request())).status).toBe(403);
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it('denies an unrelated app, an unverified password account, or a revoked token', async () => {
    verifyToken.mockResolvedValueOnce({ appId: 'different-app' });
    expect((await POST(request())).status).toBe(401);
    verifyIdToken.mockResolvedValueOnce({ ...account, email_verified: false });
    expect((await POST(request())).status).toBe(401);
    verifyIdToken.mockRejectedValueOnce(new Error('revoked'));
    expect((await POST(request())).status).toBe(401);
  });

  it('supplies the Vercel runtime token and converts the impersonated credential for Firebase Admin', async () => {
    getVercelOidcToken.mockResolvedValueOnce('fixture-vercel-token');
    fromJSON.mockReturnValueOnce({
      getAccessToken: vi.fn().mockResolvedValue({ token: 'fixture-google-token' }),
      credentials: { expiry_date: Date.now() + 3_600_000 },
    });

    expect((await POST(request())).status).toBe(204);
    expect(applicationDefault).not.toHaveBeenCalled();
    const options = fromJSON.mock.calls[0][0];
    expect(options.audience).toBe(`//iam.googleapis.com/${provider}`);
    expect(options.service_account_impersonation_url).toBe(
      `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    );
    expect(await options.subject_token_supplier.getSubjectToken()).toBe('fixture-vercel-token');
    const token = await initializeApp.mock.calls[0][0].credential.getAccessToken();
    expect(token.access_token).toBe('fixture-google-token');
    expect(token.expires_in).toBeGreaterThan(3500);
    expect(token.expires_in).toBeLessThanOrEqual(3600);
  });

  it('denies production access when the federated configuration is missing or token exchange fails', async () => {
    vi.stubEnv('BARRELBOOK_PILOT_WIF_PROVIDER', '');
    expect((await POST(request())).status).toBe(401);
    expect(verifyIdToken).not.toHaveBeenCalled();
    expect(applicationDefault).not.toHaveBeenCalled();

    vi.stubEnv('BARRELBOOK_PILOT_WIF_PROVIDER', provider);
    fromJSON.mockReturnValueOnce({ getAccessToken: vi.fn().mockRejectedValue(new Error('exchange failed')) });
    verifyIdToken.mockImplementationOnce(() => initializeApp.mock.calls[0][0].credential.getAccessToken());
    expect((await POST(request())).status).toBe(401);
    expect(applicationDefault).not.toHaveBeenCalled();
  });

  it('allows staging checks only on the approved loopback origin when opted in', async () => {
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'barrelbook-staging');
    vi.stubEnv('NEXT_PUBLIC_BARRELBOOK_STAGING_PILOT', 'false');
    vi.stubEnv('BARRELBOOK_PILOT_ORIGIN', 'http://localhost:4181');
    expect((await POST(request({ origin: 'http://localhost:4181' }))).status).toBe(503);
    vi.stubEnv('NEXT_PUBLIC_BARRELBOOK_STAGING_PILOT', 'true');
    expect((await POST(request({ origin: 'http://localhost:4181' }))).status).toBe(204);
    expect(applicationDefault).toHaveBeenCalledOnce();
    expect(fromJSON).not.toHaveBeenCalled();
  });
});

describe('existing member admission', () => {
  const read = vi.fn<typeof fetch>();
  beforeEach(() => {
    read.mockReset();
    vi.stubGlobal('fetch', read);
    vi.stubEnv('BARRELBOOK_WEB_ACCESS_MODE', 'members');
    verifyIdToken.mockResolvedValue({ ...account, uid: 'outside-pilot' });
  });
  it('admits an unlisted member using only their own profile and caller credentials', async () => {
    read.mockResolvedValue(new Response('{}'));
    expect((await POST(request({ 'x-uid': 'different-person' }))).status).toBe(204);
    const [url, options] = read.mock.calls[0];
    expect(String(url)).toBe('https://firestore.googleapis.com/v1/projects/barrelbook-273cd/databases/(default)/documents/users/outside-pilot?fields=name');
    expect(options).toMatchObject({ cache: 'no-store', redirect: 'error', headers: {
      Authorization: 'Bearer fixture-id-token', 'X-Firebase-AppCheck': 'fixture-app-token',
    } });
  });
  it.each([[404, 403], [403, 403], [401, 401], [503, 503]])('fails closed on profile status %d', async (source, expected) => {
    read.mockResolvedValue(new Response(null, { status: source }));
    expect((await POST(request())).status).toBe(expected);
  });
  it('denies missing profiles even for original pilot users and handles an unavailable service', async () => {
    verifyIdToken.mockResolvedValue(account);
    read.mockResolvedValueOnce(new Response(null, { status: 404 })).mockRejectedValueOnce(new Error('offline'));
    expect((await POST(request())).status).toBe(403);
    expect((await POST(request())).status).toBe(503);
  });
  it('rejects anonymous, revoked, unattested and unverified sessions before reading a profile', async () => {
    verifyIdToken.mockResolvedValueOnce({ ...account, firebase: { sign_in_provider: 'anonymous' } });
    expect((await POST(request())).status).toBe(401);
    verifyIdToken.mockRejectedValueOnce(new Error('revoked'));
    expect((await POST(request())).status).toBe(401);
    verifyToken.mockResolvedValueOnce({ appId: 'foreign' });
    expect((await POST(request())).status).toBe(401);
    verifyIdToken.mockResolvedValueOnce({ ...account, email_verified: false });
    expect((await POST(request())).status).toBe(401);
    expect(read).not.toHaveBeenCalled();
  });
  it('only enables the explicit members mode and preserves the pilot rollback', async () => {
    vi.stubEnv('BARRELBOOK_WEB_ACCESS_MODE', 'typo');
    expect((await POST(request())).status).toBe(503);
    vi.stubEnv('BARRELBOOK_WEB_ACCESS_MODE', undefined);
    expect((await POST(request())).status).toBe(403);
    verifyIdToken.mockResolvedValue(account);
    expect((await POST(request())).status).toBe(204);
    expect(read).not.toHaveBeenCalled();
  });
  it('uses admission on canonical staging and requires the registered app and local origin', async () => {
    const projectId = 'barrelbook-staging-v2', appId = '1:387460631515:web:d70b9207059b90c55075fe';
    const origin = 'http://localhost:4182';
    expect(parseEnvironment({ projectId, appId, apiKey: 'fixture', storageBucket: 'bucket', authDomain: 'example.org', appCheckSiteKey: 'fixture' }, 'production', 'localhost', origin).pilotRequired).toBe(true);
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId);
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', appId);
    vi.stubEnv('BARRELBOOK_PILOT_ORIGIN', origin);
    verifyToken.mockResolvedValue({ appId });
    read.mockResolvedValue(new Response('{}'));
    expect((await POST(request({ origin }))).status).toBe(204);
    expect((await POST(request())).status).toBe(403);
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'different');
    expect((await POST(request({ origin }))).status).toBe(503);
  });
});
