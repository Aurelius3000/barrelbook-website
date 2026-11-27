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
  vi.stubEnv('BARRELBOOK_PILOT_WIF_PROVIDER', provider);
  vi.stubEnv('BARRELBOOK_PILOT_SERVICE_ACCOUNT', serviceAccount);
  fromJSON.mockReset().mockReturnValue({});
  verifyIdToken.mockReset().mockResolvedValue(account);
  verifyToken.mockReset().mockResolvedValue({ appId });
});
afterEach(() => vi.unstubAllEnvs());

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
