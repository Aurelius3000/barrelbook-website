import type { AccountProfile } from './records';

export interface Identity {
  uid: string; email: string | null; isAnonymous: boolean; emailVerified: boolean; providers: string[];
}
export type SessionState =
  | { kind: 'checking' }
  | { kind: 'signed-out' }
  | { kind: 'blocked'; reason: 'guest' | 'unverified' | 'missing-account' | 'unavailable' | 'pilot-access' }
  | { kind: 'ready'; identity: Identity; profile: AccountProfile; generation: number };

export interface SessionPort {
  subscribe(callback: (identity: Identity | null) => void, onError: () => void): () => void;
  readProfile(uid: string): Promise<AccountProfile | null>;
  authorizePilot?(uid: string, signal: AbortSignal): Promise<boolean>;
}

const PILOT_RECHECK_MS = 60_000;
const PILOT_REQUEST_TIMEOUT_MS = 10_000;

// Invalidate every in-flight read before another identity may publish private state.
export function observeAccount(port: SessionPort, publish: (state: SessionState) => void) {
  let generation = 0, stopped = false;
  let admitted: Identity | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: AbortController | undefined;
  const valid = (run: number) => !stopped && generation === run;
  const reset = () => {
    generation++;
    admitted = null;
    clearTimeout(timer);
    pending?.abort();
    pending = undefined;
  };
  const authorizePilot = port.authorizePilot;
  async function checkPilot(uid: string, authorize: NonNullable<SessionPort['authorizePilot']>) {
    const controller = new AbortController();
    pending = controller;
    const timeout = setTimeout(() => controller.abort(), PILOT_REQUEST_TIMEOUT_MS);
    const aborted = new Promise<never>((_, reject) => {
      controller.signal.addEventListener('abort', () => reject(controller.signal.reason), { once: true });
    });
    try {
      return await Promise.race([authorize(uid, controller.signal), aborted]);
    } finally {
      clearTimeout(timeout);
      if (pending === controller) pending = undefined;
    }
  }
  function schedule() { timer = setTimeout(recheck, PILOT_RECHECK_MS); }
  function recheck() {
    if (!authorizePilot || !admitted || pending) return;
    clearTimeout(timer);
    const run = generation;
    void checkPilot(admitted.uid, authorizePilot).then(allowed => {
      if (!valid(run)) return;
      if (allowed) schedule();
      else {
        reset();
        publish({ kind: 'blocked', reason: 'pilot-access' });
      }
    }, () => {
      if (!valid(run)) return;
      reset();
      publish({ kind: 'blocked', reason: 'unavailable' });
    });
  }
  const unsubscribe = port.subscribe(identity => {
    if (stopped) return;
    reset();
    const run = generation;
    publish({ kind: 'checking' });
    if (!identity) { publish({ kind: 'signed-out' }); return; }
    if (identity.isAnonymous) { publish({ kind: 'blocked', reason: 'guest' }); return; }
    if (identity.providers.includes('password') && !identity.emailVerified) { publish({ kind: 'blocked', reason: 'unverified' }); return; }
    const read = authorizePilot
      ? checkPilot(identity.uid, authorizePilot).then<AccountProfile | null | 'pilot-denied'>(allowed => {
        if (!valid(run)) return null;
        return allowed ? port.readProfile(identity.uid) : 'pilot-denied';
      })
      : port.readProfile(identity.uid);
    void read.then(profile => {
      if (!valid(run)) return;
      if (profile === 'pilot-denied') { publish({ kind: 'blocked', reason: 'pilot-access' }); return; }
      if (profile && authorizePilot) { admitted = identity; schedule(); }
      publish(profile ? { kind: 'ready', identity, profile, generation: run } : { kind: 'blocked', reason: 'missing-account' });
    }, () => { if (valid(run)) publish({ kind: 'blocked', reason: 'unavailable' }); });
  }, () => { reset(); if (!stopped) publish({ kind: 'blocked', reason: 'unavailable' }); });
  return {
    recheck,
    invalidate() { reset(); if (!stopped) publish({ kind: 'checking' }); },
    stop() { stopped = true; reset(); unsubscribe(); },
  };
}
