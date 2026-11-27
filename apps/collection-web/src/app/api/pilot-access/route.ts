import { getVercelOidcToken } from '@vercel/oidc';
import { applicationDefault, getApps, initializeApp, type Credential } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';
import { getAuth } from 'firebase-admin/auth';
import { ExternalAccountClient } from 'google-auth-library';

export const runtime = 'nodejs';

function response(status: number) {
  return new Response(null, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

function pilotConfiguration() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const origin = process.env.BARRELBOOK_PILOT_ORIGIN;
  if (!appId || !origin) return null;

  if (projectId === 'barrelbook-273cd' && origin === 'https://app.barrelbook.app') {
    return { projectId, appId, origin };
  }
  if (projectId === 'barrelbook-staging-v2' && appId === '1:387460631515:web:d70b9207059b90c55075fe' &&
      origin === 'http://localhost:4182') {
    return { projectId, appId, origin };
  }
  if (projectId === 'barrelbook-staging' && process.env.NEXT_PUBLIC_BARRELBOOK_STAGING_PILOT === 'true' &&
      origin === 'http://localhost:4181') {
    return { projectId, appId, origin };
  }
  return null;
}

function productionCredential(): Credential {
  const provider = process.env.BARRELBOOK_PILOT_WIF_PROVIDER;
  const serviceAccount = process.env.BARRELBOOK_PILOT_SERVICE_ACCOUNT;
  if (!provider || !/^projects\/\d+\/locations\/global\/workloadIdentityPools\/[a-z0-9-]+\/providers\/[a-z0-9-]+$/.test(provider) ||
      !serviceAccount || !/^[a-z0-9-]+@barrelbook-273cd\.iam\.gserviceaccount\.com$/.test(serviceAccount)) {
    throw new Error('Production pilot credentials are not configured');
  }

  const client = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/${provider}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    subject_token_supplier: { getSubjectToken: () => getVercelOidcToken() },
  });
  if (!client) throw new Error('Production pilot credential could not be initialized');

  return {
    async getAccessToken() {
      const { token } = await client.getAccessToken();
      const expiry = client.credentials.expiry_date;
      const expiresIn = expiry ? Math.floor((expiry - Date.now()) / 1000) : 0;
      if (!token || expiresIn <= 0) throw new Error('Production pilot credential expired');
      return { access_token: token, expires_in: expiresIn };
    },
  };
}

export async function POST(request: Request) {
  const config = pilotConfiguration();
  if (!config) return response(503);
  if (request.headers.get('origin') !== config.origin) return response(403);

  const idToken = /^Bearer ([^\s,]+)$/.exec(request.headers.get('authorization') || '')?.[1];
  const appToken = request.headers.get('x-firebase-appcheck');
  if (!idToken || !appToken) return response(401);

  const allowedUids = (process.env.BARRELBOOK_PILOT_UIDS || '').split(',').map(uid => uid.trim()).filter(Boolean);
  const mode = process.env.BARRELBOOK_WEB_ACCESS_MODE ?? 'pilot';
  if (mode !== 'pilot' && mode !== 'members') return response(503);
  if (mode === 'pilot' && !allowedUids.length) return response(403);

  const name = `collection-web-pilot-${config.projectId}`;
  try {
    const app = getApps().find(entry => entry.name === name) ?? initializeApp({
      projectId: config.projectId,
      credential: config.projectId === 'barrelbook-273cd' ? productionCredential() : applicationDefault(),
    }, name);
    const [identity, attestation] = await Promise.all([
      getAuth(app).verifyIdToken(idToken, true),
      getAppCheck(app).verifyToken(appToken),
    ]);
    const provider = identity.firebase.sign_in_provider;
    if (attestation.appId !== config.appId || provider === 'anonymous' ||
        (provider === 'password' && identity.email_verified !== true)) return response(401);
    if (mode === 'pilot') return response(allowedUids.includes(identity.uid) ? 204 : 403);

    // Use the member's own credentials so Firestore applies the same rules as the app.
    // Request only the document name and discard the response body.
    const uid = identity.uid;
    if (!uid || uid === '.' || uid === '..' || uid.includes('/')) return response(403);
    const profile = new URL(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}`);
    profile.searchParams.set('fields', 'name');
    try {
      const result = await fetch(profile, {
        headers: { Authorization: `Bearer ${idToken}`, 'X-Firebase-AppCheck': appToken },
        cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000),
      });
      await result.body?.cancel();
      if (result.status === 200) return response(204);
      if (result.status === 403 || result.status === 404) return response(403);
      return response(result.status === 401 ? 401 : 503);
    } catch {
      return response(503);
    }
  } catch {
    return response(401);
  }
}
