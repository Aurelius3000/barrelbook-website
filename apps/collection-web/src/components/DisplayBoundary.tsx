'use client';

import { flushSync } from 'react-dom';
import { useEffect, useState, type ReactNode } from 'react';
import {
  allowOwnerSignIn,
  recoverDisplay,
  clearOwner,
  DISPLAY_EVENT,
  EPOCH,
  notifyDisplay,
  OWNER_LOCK,
  requestDisplay,
  status,
} from '../lib/display-client';
import type { DisplayState } from '../lib/bar-display';

export function LeaveDisplay({ onCancel }: { onCancel?: () => void }) {
  const [pin, setPin] = useState(''),
    [error, setError] = useState(''),
    [recover, setRecover] = useState(false);
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false);
  async function toggleRecovery() {
    setError('');
    if (recover) {
      setRecover(false);
      return;
    }
    setBusy(true);
    try {
      const { wait } = await requestDisplay<{ wait: number }>('recovery-ready');
      if (wait > 0) await new Promise((done) => setTimeout(done, wait + 50));
      setRecover(true);
    } catch {
      setError('Unable to start owner recovery. Try again.');
    } finally {
      setBusy(false);
    }
  }
  async function finish(provider?: 'google' | 'apple') {
    setBusy(true);
    setError('');
    try {
      if (recover) {
        await recoverDisplay(email, password, provider);
      } else await requestDisplay('end', { pin });
      notifyDisplay();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to end display.');
    } finally {
      setBusy(false);
      setPassword('');
      setPin('');
    }
  }
  return (
    <section aria-label="Leave Bar Display" className="display-exit">
      <h2>{recover ? 'Owner recovery' : 'Leave Bar Display'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void finish();
        }}
      >
        {recover ? (
          <>
            <label>
              Email address
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          </>
        ) : (
          <label>
            Display PIN
            <input
              autoFocus
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              type="password"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </label>
        )}
        <button disabled={busy}>{recover ? 'Verify owner' : 'End display'}</button>
      </form>
      {recover &&
        (['google', 'apple'] as const).map((provider) => (
          <button key={provider} disabled={busy} onClick={() => void finish(provider)}>
            Continue with {provider}
          </button>
        ))}
      <button disabled={busy} onClick={() => void toggleRecovery()}>
        {recover ? 'Use PIN' : 'Forgot PIN?'}
      </button>
      {onCancel && (
        <button disabled={busy} onClick={onCancel}>
          Cancel
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

export function DisplayBoundary({
  children,
  guest,
}: {
  children: ReactNode;
  guest: (expires: number) => ReactNode;
}) {
  const [state, setState] = useState<DisplayState | null>(null),
    [failed, setFailed] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true,
      sequence = 0,
      release: (() => void) | undefined,
      lease: Promise<boolean> | undefined,
      timer: ReturnType<typeof setTimeout>;
    let queue = Promise.resolve(),
      cleared = false,
      showedOwner = false;
    const cover = () => {
      document.documentElement.dataset.displayChecking = 'true';
    };
    const publish = (next: DisplayState) => {
      setState(next);
      setFailed(false);
    };
    function acquire() {
      if (!lease)
        lease = new Promise<boolean>((resolve, reject) => {
          navigator.locks
            .request(OWNER_LOCK, { mode: 'shared', ifAvailable: true }, (lock) => {
              if (!lock || !alive) {
                resolve(false);
                return;
              }
              return new Promise<void>((done) => {
                release = done;
                resolve(true);
              });
            })
            .catch(reject);
        });
      return lease;
    }
    const unlock = () => {
      release?.();
      release = undefined;
      lease = undefined;
    };
    function check(mask = true) {
      if (mask) cover();
      const run = ++sequence;
      queue = queue
        .then(async () => {
          if (!alive || run !== sequence) return;
          const started = performance.now();
          let next = await status();
          if (next.mode === 'owner') {
            if (!navigator.locks) throw new Error('Browser locking unavailable');
            if (!(await acquire())) {
              unlock();
              throw new Error('Display handoff in progress');
            }
            next = await status();
          }
          const changed = (localStorage.getItem(EPOCH) ?? '') !== (sessionStorage.getItem(EPOCH) ?? '');
          if (changed || (next.mode !== 'owner' && !cleared)) {
            await clearOwner();
            cleared = true;
          }
          if (next.mode !== 'owner') unlock();
          else {
            allowOwnerSignIn();
            cleared = false;
          }
          if (!alive || run !== sequence) return;
          if (next.mode === 'expired') {
            await requestDisplay('clear');
            notifyDisplay();
            return;
          }
          const deadline = next.remaining === undefined ? undefined : started + next.remaining;
          if (deadline !== undefined && performance.now() >= deadline) {
            check();
            return;
          }
          // Discard the owner's JavaScript heap and Firestore memory cache before guests use this tab.
          if (next.mode === 'guest' && showedOwner) {
            cover();
            window.location.reload();
            return;
          }
          if (next.mode === 'owner') showedOwner = true;
          flushSync(() => publish(next));
          clearTimeout(timer);
          if (deadline !== undefined) {
            const remaining = deadline - performance.now();
            if (remaining <= 0) {
              check();
              return;
            }
            timer = setTimeout(() => check(), remaining);
          }
          if (!document.hidden) delete document.documentElement.dataset.displayChecking;
        })
        .catch(() => {
          if (alive && run === sequence) {
            cover();
            setState(null);
            setFailed(true);
          }
        });
    }
    const event = () => check(),
      storage = (e: StorageEvent) => {
        if (e.key === EPOCH || e.key === null) check();
      };
    const visibility = () => {
      if (document.hidden) cover();
      else check();
    };
    window.addEventListener(DISPLAY_EVENT, event);
    window.addEventListener('storage', storage);
    window.addEventListener('pagehide', cover);
    window.addEventListener('pageshow', event);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('focus', event);
    check();
    const poll = setInterval(() => {
      if (!document.hidden) check(false);
    }, 10000);
    return () => {
      alive = false;
      clearInterval(poll);
      clearTimeout(timer);
      unlock();
      window.removeEventListener(DISPLAY_EVENT, event);
      window.removeEventListener('storage', storage);
      window.removeEventListener('pagehide', cover);
      window.removeEventListener('pageshow', event);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('focus', event);
    };
  }, [attempt]);
  if (!state)
    return (
      <main className="message-screen">
        <p role="status">
          {failed ? 'The display is locked. Check the connection and try again.' : 'Checking display access…'}
        </p>
        {failed && <button onClick={() => setAttempt((n) => n + 1)}>Retry</button>}
      </main>
    );
  if (state.mode === 'locked')
    return (
      <main className="message-screen">
        <h1>Securing this display</h1>
        <p>Other BarrelBook tabs must finish signing out.</p>
        <LeaveDisplay />
      </main>
    );
  return <div className="display-protected">{state.mode === 'owner' ? children : guest(state.expires!)}</div>;
}
