import { canEditBottle, type WebConfig } from './config';
import { decodePlan, decodeEditBaseline, type PlanSnapshot } from './records';

export class ServiceError extends Error {
  constructor(public readonly status: number) { super('BarrelBook service unavailable'); this.name = 'ServiceError'; }
}
interface Credentials { idToken?: string; appCheckToken?: string }

export async function requestService(config: WebConfig, endpoint: 'getCredits' | 'sendPasswordResetEmail', credentials: Credentials, email?: string, signal?: AbortSignal): Promise<unknown> {
  if (!config.emulators && !credentials.appCheckToken) throw new ServiceError(401);
  if (endpoint === 'getCredits' && !credentials.idToken) throw new ServiceError(401);
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (credentials.idToken) headers.Authorization = `Bearer ${credentials.idToken}`;
  if (credentials.appCheckToken) headers['X-Firebase-AppCheck'] = credentials.appCheckToken;
  if (endpoint === 'sendPasswordResetEmail') headers['Content-Type'] = 'application/json';
  const response = await fetch(`${config.functionsOrigin}/${endpoint}`, {
    method: endpoint === 'getCredits' ? 'GET' : 'POST', headers,
    ...(email !== undefined ? { body: JSON.stringify({ email }) } : {}),
    cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new ServiceError(response.status);
  return response.json();
}

export async function readServerPlan(config: WebConfig, credentials: Credentials, signal?: AbortSignal): Promise<PlanSnapshot> {
  return decodePlan(await requestService(config, 'getCredits', credentials, undefined, signal));
}

export function friendlyAuthError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password', 'auth/invalid-email'].includes(code)) return 'We couldn’t sign you in. Check your email and password, or use the provider you chose in the app.';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Sign-in was canceled. You can try again.';
  if (code === 'auth/popup-blocked') return 'Your browser blocked the sign-in window. Try again, or continue in this tab.';
  if (code === 'auth/account-exists-with-different-credential') return 'Use the sign-in method already linked to your BarrelBook account.';
  if (code === 'auth/operation-not-allowed') return 'This sign-in method isn’t enabled for this workspace. Use another linked sign-in method or the iPhone app.';
  if (code === 'auth/unauthorized-domain') return 'Sign-in isn’t configured for this web address yet. Please use the iPhone app.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a little before trying again.';
  if (code === 'auth/network-request-failed') return 'We couldn’t connect. Check your connection and try again.';
  if (code === 'auth/user-disabled' || code === 'auth/user-token-expired') return 'This session is no longer available. Please sign in again.';
  return 'Sign-in is unavailable right now. Please try again, or use the iPhone app.';
}

export class EditRequestError extends ServiceError {
  constructor(status: number, public readonly uncertain = false) { super(status); this.name = 'EditRequestError'; }
}
export async function requestBottleEdit(config: WebConfig, endpoint: 'getBottleForEdit' | 'updateBottleDetails', credentials: Credentials, body: { bottleId: string; expectedVersion?: string; patch?: import('./bottle-edit').Patch }, signal?: AbortSignal): Promise<import('./records').EditBaseline> {
  if (!canEditBottle(config, body.bottleId)) throw new EditRequestError(503);
  if (!config.emulators && !credentials.appCheckToken) throw new EditRequestError(401);
  if (!credentials.idToken) throw new EditRequestError(401);
  let response: Response;
  try {
    response = await fetch(`${config.functionsOrigin}/${endpoint}`, {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${credentials.idToken}`, ...(credentials.appCheckToken ? { 'X-Firebase-AppCheck': credentials.appCheckToken } : {}) },
      body: JSON.stringify(body), cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    });
  } catch { throw new EditRequestError(0, endpoint === 'updateBottleDetails'); }
  if (!response.ok) throw new EditRequestError(response.status, endpoint === 'updateBottleDetails' && response.status >= 500);
  try {
    return decodeEditBaseline(await response.json(), body.bottleId);
  } catch { throw new EditRequestError(0, endpoint === 'updateBottleDetails'); }
}
