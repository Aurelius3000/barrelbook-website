'use client';

import { getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken, type AppCheck } from 'firebase/app-check';
import { getAuth, setPersistence, browserSessionPersistence, connectAuthEmulator, onAuthStateChanged, getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider, OAuthProvider, signOut, type User } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection, doc, getDocFromServer, getDocsFromServer, query, orderBy, documentId, limit, startAfter, type QueryDocumentSnapshot, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref, getBlob, getMetadata, type FirebaseStorage } from 'firebase/storage';
import { browserEnvironment, parseEnvironment, canEditBottle, type WebConfig } from './config';
import { decodeBottle, decodeProfile, ownedPhotoPath, type BottleRecord, type PlanSnapshot } from './records';
import { readServerPlan, requestService, requestBottleEdit, EditRequestError } from './services';
import type { Identity, SessionPort } from './session';
import { AskBBError, askBBHttpError, canAskBB, decodeAskBBPrivacy, decodeAskBBReply, isAskBBBottleId, type AskBBAccess, type AskBBEndpoint, type AskBBTurn } from './ask-bb';

export interface Runtime { auth: ReturnType<typeof getAuth>; db: Firestore; storage: FirebaseStorage; appCheck: AppCheck | null; config: WebConfig }
declare global { var barrelBookWebRuntime: Promise<Runtime> | undefined; }
export const PAGE_SIZE = 100;
export interface BottlePage { bottles: BottleRecord[]; cursor: QueryDocumentSnapshot | null; hasMore: boolean }

export function getRuntime(): Promise<Runtime> {
  if (!globalThis.barrelBookWebRuntime) {
    globalThis.barrelBookWebRuntime = (async () => {
      const config = parseEnvironment(browserEnvironment(), process.env.NODE_ENV, window.location.hostname, window.location.origin);
      const app = getApps().find(a => a.name === 'collection-web') || initializeApp(config.firebase, 'collection-web');
      const auth = getAuth(app), db = getFirestore(app), storage = getStorage(app);
      storage.maxOperationRetryTime = 15000;
      if (config.emulators) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9409', { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 9480);
        connectStorageEmulator(storage, '127.0.0.1', 9499);
      }
      const appCheck = config.emulators ? null : initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(config.appCheckSiteKey), isTokenAutoRefreshEnabled: true });
      // Verify attestation before accepting credentials or starting private reads.
      if (appCheck) await getToken(appCheck);
      await setPersistence(auth, browserSessionPersistence);
      return { auth, db, storage, appCheck, config };
    })();
  }
  return globalThis.barrelBookWebRuntime;
}

function identity(user: User): Identity {
  return { uid: user.uid, email: user.email, isAnonymous: user.isAnonymous, emailVerified: user.emailVerified, providers: user.providerData.map(p => p.providerId) };
}
export function assertOwner(runtime: Runtime, uid: string) {
  if (!runtime.auth.currentUser || runtime.auth.currentUser.uid !== uid || runtime.auth.currentUser.isAnonymous) throw Object.assign(new Error('Session changed'), { code: 'session/account-changed' });
}

export function sessionPort(runtime: Runtime): SessionPort {
  return {
    subscribe(callback, onError) { return onAuthStateChanged(runtime.auth, user => callback(user ? identity(user) : null), onError); },
    ...(runtime.config.pilotRequired && {
      async authorizePilot(uid: string, signal: AbortSignal) {
        assertOwner(runtime, uid);
        const [idToken, appToken] = await Promise.all([runtime.auth.currentUser!.getIdToken(), appCheckToken(runtime)]);
        assertOwner(runtime, uid);
        signal.throwIfAborted();
        if (!appToken) throw new Error('Pilot verification unavailable');
        const response = await fetch('/api/pilot-access', {
          method: 'POST', credentials: 'omit', cache: 'no-store', redirect: 'error', signal,
          headers: { Authorization: `Bearer ${idToken}`, 'X-Firebase-AppCheck': appToken },
        });
        assertOwner(runtime, uid);
        if (response.status === 403) return false;
        if (response.status !== 204) throw new Error('Pilot verification unavailable');
        return true;
      },
    }),
    async readProfile(uid) {
      assertOwner(runtime, uid);
      const snap = await getDocFromServer(doc(runtime.db, 'users', uid));
      assertOwner(runtime, uid);
      return snap.exists() ? decodeProfile(snap.data(), uid) : null;
    },
  };
}

export function signInEmail(runtime: Runtime, email: string, password: string) { return signInWithEmailAndPassword(runtime.auth, email.trim(), password); }
const provider = (kind: 'google' | 'apple') => kind === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');
export function signInProvider(runtime: Runtime, kind: 'google' | 'apple', redirect = false) {
  return redirect ? signInWithRedirect(runtime.auth, provider(kind)) : signInWithPopup(runtime.auth, provider(kind));
}
export function finishRedirect(runtime: Runtime) { return getRedirectResult(runtime.auth); }
export function endSession(runtime: Runtime) { return signOut(runtime.auth); }

async function appCheckToken(runtime: Runtime) { return runtime.appCheck ? (await getToken(runtime.appCheck)).token : undefined; }
export async function loadPlan(runtime: Runtime, uid: string, signal?: AbortSignal): Promise<PlanSnapshot> {
  assertOwner(runtime, uid);
  const user = runtime.auth.currentUser!;
  const [idToken, token] = await Promise.all([user.getIdToken(), appCheckToken(runtime)]);
  assertOwner(runtime, uid);
  const plan = await readServerPlan(runtime.config, { idToken, appCheckToken: token }, signal);
  assertOwner(runtime, uid);
  return plan;
}
export async function resetPassword(runtime: Runtime, email: string) {
  await requestService(runtime.config, 'sendPasswordResetEmail', { appCheckToken: await appCheckToken(runtime) }, email.trim());
}

export async function readBottles(runtime: Runtime, uid: string, cursor: QueryDocumentSnapshot | null = null): Promise<BottlePage> {
  assertOwner(runtime, uid);
  const records = collection(runtime.db, 'users', uid, 'bottles');
  const constraints = [orderBy(documentId()), ...(cursor ? [startAfter(cursor)] : []), limit(PAGE_SIZE + 1)];
  const result = await getDocsFromServer(query(records, ...constraints));
  assertOwner(runtime, uid);
  const docs = result.docs.slice(0, PAGE_SIZE);
  return { bottles: docs.map(d => decodeBottle(d.id, d.data(), uid)), cursor: docs.at(-1) || null, hasMore: result.size > PAGE_SIZE };
}

export async function readPhoto(runtime: Runtime, uid: string, location: string): Promise<Blob> {
  assertOwner(runtime, uid);
  const path = ownedPhotoPath(location, uid, runtime.config.firebase.storageBucket);
  if (!path) throw new Error('Photo unavailable');
  if (!runtime.config.emulators && !runtime.appCheck) throw new Error('Photo verification unavailable');
  const photo = ref(runtime.storage, path);
  const metadata = await getMetadata(photo);
  assertOwner(runtime, uid);
  if (!metadata.contentType || !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(metadata.contentType) || !Number.isFinite(metadata.size) || metadata.size <= 0 || metadata.size > 10 * 1024 * 1024) throw new Error('Unsupported photo');
  const blob = await getBlob(photo, 10 * 1024 * 1024);
  assertOwner(runtime, uid);
  if (blob.size !== metadata.size) throw new Error('Photo changed during download');
  // The SDK's bounded download slices the Blob and drops its MIME type.
  return new Blob([blob], { type: metadata.contentType });
}

export function isSessionError(error: unknown): boolean {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  return ['permission-denied', 'unauthenticated', 'auth/user-token-expired', 'auth/user-disabled', 'session/account-changed'].includes(code);
}


async function editCredentials(runtime: Runtime, uid: string, bottleId: string) {
  if (!canEditBottle(runtime.config, bottleId)) throw new EditRequestError(503);
  assertOwner(runtime, uid);
  const user = runtime.auth.currentUser!;
  if (!runtime.config.emulators && !runtime.appCheck) throw new EditRequestError(401);
  const [idToken, token] = await Promise.all([user.getIdToken(), appCheckToken(runtime)]);
  assertOwner(runtime, uid);
  if (!runtime.config.emulators && !token) throw new EditRequestError(401);
  return { idToken, appCheckToken: token };
}
export async function readBottleForEdit(runtime: Runtime, uid: string, bottleId: string, signal?: AbortSignal) {
  const credentials = await editCredentials(runtime, uid, bottleId);
  const baseline = await requestBottleEdit(runtime.config, 'getBottleForEdit', credentials, { bottleId }, signal);
  assertOwner(runtime, uid);
  return baseline;
}
export async function updateBottleDetails(runtime: Runtime, uid: string, baseline: import('./records').EditBaseline, patch: import('./bottle-edit').Patch, signal?: AbortSignal) {
  const credentials = await editCredentials(runtime, uid, baseline.bottleId);
  const result = await requestBottleEdit(runtime.config, 'updateBottleDetails', credentials, { bottleId: baseline.bottleId, expectedVersion: baseline.version, patch }, signal);
  assertOwner(runtime, uid);
  return result;
}

const ASK_BB_STAGING_APP = '1:387460631515:web:d70b9207059b90c55075fe';

export function canShowAskBB(runtime: Runtime) {
  const { config } = runtime;
  return config.pilotRequired === true && config.firebase.projectId === 'barrelbook-273cd' ||
    config.firebase.projectId === 'barrelbook-staging-v2' && config.firebase.appId === ASK_BB_STAGING_APP &&
    typeof window !== 'undefined' && window.location.hostname === 'localhost';
}

async function askBBRequest(runtime: Runtime, uid: string, endpoint: AskBBEndpoint, signal: AbortSignal, body?: AskBBTurn) {
  assertOwner(runtime, uid);
  signal.throwIfAborted();
  if (!canShowAskBB(runtime) || !runtime.appCheck) throw new AskBBError('session');
  const user = runtime.auth.currentUser!;
  const deadline = AbortSignal.timeout(body ? 65_000 : 15_000);
  const requestSignal = AbortSignal.any([signal, deadline]);
  try {
    const [idToken, token] = await Promise.all([user.getIdToken(), appCheckToken(runtime)]);
    assertOwner(runtime, uid);
    requestSignal.throwIfAborted();
    if (!token) throw new AskBBError('session');
    const response = await fetch(`${runtime.config.functionsOrigin}/${endpoint}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json', Authorization: `Bearer ${idToken}`, 'X-Firebase-AppCheck': token,
        ...(body && { 'Content-Type': 'application/json' })
      },
      ...(body && { body: JSON.stringify(body) }),
      signal: requestSignal, cache: 'no-store', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer'
    });
    const payload: unknown = await response.json().catch(() => null);
    assertOwner(runtime, uid);
    requestSignal.throwIfAborted();
    if (!response.ok) throw askBBHttpError(response.status, payload);
    return payload;
  } catch (error) {
    signal.throwIfAborted();
    if (deadline.aborted) throw new AskBBError('timeout');
    if (typeof navigator !== 'undefined' && !navigator.onLine) throw new AskBBError('offline');
    if (isSessionError(error)) throw new AskBBError('session');
    throw error;
  }
}

export async function readAskBBAccess(runtime: Runtime, uid: string, signal: AbortSignal): Promise<AskBBAccess> {
  assertOwner(runtime, uid);
  if (!canShowAskBB(runtime)) return 'ineligible';
  if (!navigator.onLine) throw new AskBBError('offline');
  const authorize = sessionPort(runtime).authorizePilot;
  if (authorize && !await authorize(uid, AbortSignal.any([signal, AbortSignal.timeout(10_000)]))) {
    throw new AskBBError('session');
  }
  const [flagSnapshot, profile] = await Promise.all([
    getDocFromServer(doc(runtime.db, 'config', 'feature_flags')),
    getDocFromServer(doc(runtime.db, 'users', uid))
  ]);
  signal.throwIfAborted();
  assertOwner(runtime, uid);
  if (!profile.exists() || !canAskBB(flagSnapshot.data(), profile.data())) return 'ineligible';
  return decodeAskBBPrivacy(await askBBRequest(runtime, uid, 'getAskBBPrivacyStatus', signal));
}

export async function sendAskBBTurn(runtime: Runtime, uid: string, turn: AskBBTurn, signal: AbortSignal) {
  const access = await readAskBBAccess(runtime, uid, signal);
  if (access !== 'ready') throw new AskBBError(access);
  return decodeAskBBReply(await askBBRequest(runtime, uid, 'askBBTurn', signal, turn));
}

export async function readAskBBBottle(runtime: Runtime, uid: string, id: string, signal: AbortSignal) {
  if (!isAskBBBottleId(id)) return null;
  assertOwner(runtime, uid);
  signal.throwIfAborted();
  const snapshot = await getDocFromServer(doc(runtime.db, 'users', uid, 'bottles', id));
  assertOwner(runtime, uid);
  signal.throwIfAborted();
  return snapshot.exists() ? decodeBottle(snapshot.id, snapshot.data(), uid) : null;
}
