'use client';

import { deleteApp, initializeApp } from 'firebase/app';
import {
  beforeAuthStateChanged,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  GoogleAuthProvider,
  inMemoryPersistence,
  initializeAuth,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getToken } from 'firebase/app-check';
import { endSession, getRuntime } from './firebase';
import type { DisplayState } from './bar-display';

export const displayEnabled = process.env.NEXT_PUBLIC_BAR_DISPLAY_ENABLED === 'true';
export const DISPLAY_EVENT = 'bb-display-change';
export const EPOCH = 'bb-display-epoch';
export const OWNER_LOCK = 'bb-owner-workspace';
export const api = '/api/bar-display';

export async function ownerHeaders() {
  const runtime = await getRuntime(),
    user = runtime.auth.currentUser;
  if (!user) throw new Error('Sign in again');
  const [id, check] = await Promise.all([
    user.getIdToken(),
    runtime.appCheck ? getToken(runtime.appCheck) : null,
  ]);
  if (runtime.auth.currentUser !== user) throw new Error('Account changed');
  return { Authorization: 'Bearer ' + id, ...(check ? { 'X-Firebase-AppCheck': check.token } : {}) };
}
export async function requestDisplay<T>(action?: string, fields: object = {}, owner = false): Promise<T> {
  const result = await fetch(api, {
    method: action ? 'POST' : 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    signal: action === 'preview' ? undefined : AbortSignal.timeout(10000),
    headers: {
      ...(action ? { 'Content-Type': 'application/json' } : {}),
      ...(owner ? await ownerHeaders() : {}),
    },
    ...(action ? { body: JSON.stringify({ action, ...fields }) } : {}),
  });
  if (!result.ok)
    throw new Error(
      result.status === 429
        ? 'Too many attempts. Try again in a minute.'
        : result.status === 403
          ? 'Access denied. Check your PIN or sign-in.'
          : 'Display unavailable. Please try again.',
    );
  return result.json();
}

export function notifyDisplay() {
  localStorage.setItem(EPOCH, crypto.randomUUID());
  window.dispatchEvent(new Event(DISPLAY_EVENT));
}
let unblock: (() => void) | undefined;

export function allowOwnerSignIn() {
  unblock?.();
  unblock = undefined;
}

export async function recoverDisplay(email: string, password: string, provider?: 'apple' | 'google') {
  const runtime = await getRuntime();
  const app = initializeApp(runtime.config.firebase, 'display-recovery-' + crypto.randomUUID());
  const auth = initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  if (runtime.config.emulators) connectAuthEmulator(auth, 'http://127.0.0.1:9409', { disableWarnings: true });
  try {
    const credential = provider
      ? await signInWithPopup(
          auth,
          provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com'),
        )
      : await signInWithEmailAndPassword(auth, email, password);
    const check = runtime.appCheck ? await getToken(runtime.appCheck) : null;
    const response = await fetch(api, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await credential.user.getIdToken()),
        ...(check ? { 'X-Firebase-AppCheck': check.token } : {}),
      },
      body: JSON.stringify({ action: 'recover' }),
    });
    if (!response.ok) throw new Error('Recovery requires the owner who started this display.');
  } finally {
    try {
      await signOut(auth);
    } finally {
      await deleteApp(app);
    }
  }
}

export async function clearOwner() {
  const runtime = await getRuntime();
  unblock ??= beforeAuthStateChanged(runtime.auth, (user) => {
    if (user) throw new Error('Display locked');
  });
  await runtime.auth.authStateReady();
  await endSession(runtime);
  if (runtime.auth.currentUser) throw new Error('Owner session still active');
  sessionStorage.setItem(EPOCH, localStorage.getItem(EPOCH) ?? '');
}
export async function startDisplay(revision: string, pin: string) {
  if (!navigator.locks) throw new Error('This browser cannot safely hand over the display.');
  document.documentElement.dataset.displayChecking = 'true';
  let activation: string;
  try {
    ({ activation } = await requestDisplay<{ activation: string }>('arm', { revision, pin }, true));
  } catch (error) {
    window.dispatchEvent(new Event(DISPLAY_EVENT));
    throw error;
  }
  notifyDisplay();
  // Each live owner tab signs out before releasing its shared lease.
  await navigator.locks.request(
    OWNER_LOCK,
    { mode: 'exclusive', signal: AbortSignal.timeout(15_000) },
    async () => {
      await clearOwner();
      await requestDisplay('activate', { activation });
    },
  );
  notifyDisplay();
}
export const status = () => requestDisplay<DisplayState>();
