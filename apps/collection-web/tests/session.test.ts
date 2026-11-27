import { describe, expect, it, vi } from 'vitest';
import { observeAccount, type Identity, type SessionPort, type SessionState } from '../src/lib/session';
import type { AccountProfile } from '../src/lib/records';

const identity = (uid: string): Identity => ({ uid, email: `${uid}@example.invalid`, isAnonymous: false, emailVerified: true, providers: ['password'] });
function deferred<T>() { let resolve!: (value: T) => void, reject!: () => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }
function harness(read: SessionPort['readProfile'], authorizePilot?: SessionPort['authorizePilot']) {
  let event!: (identity: Identity | null) => void, fail!: () => void;
  const states: SessionState[] = [], unsubscribe = vi.fn();
  const controller = observeAccount({ subscribe(callback, error) { event = callback; fail = error; return unsubscribe; }, readProfile: read, authorizePilot }, state => states.push(state));
  return { controller, event, fail, states, unsubscribe };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
describe('account isolation across async session work', () => {
  it('never publishes an old account after a newer sign-in', async () => {
    const a = deferred<AccountProfile | null>(), b = deferred<AccountProfile | null>();
    const h = harness(uid => uid === 'alice' ? a.promise : b.promise);
    h.event(identity('alice')); h.event(identity('bob'));
    a.resolve({ displayName: 'Alice', username: null }); await flush();
    expect(h.states.at(-1)?.kind).toBe('checking');
    b.resolve({ displayName: 'Bob', username: null }); await flush();
    expect(h.states.at(-1)).toMatchObject({ kind: 'ready', identity: { uid: 'bob' } });
    expect(h.states.some(s => s.kind === 'ready' && s.identity.uid === 'alice')).toBe(false);
  });
  it('clears visible private state immediately on account change and sign-out', async () => {
    const next = deferred<AccountProfile | null>();
    const h = harness(uid => uid === 'alice' ? Promise.resolve({ displayName: 'Alice', username: null }) : next.promise);
    h.event(identity('alice')); await flush(); expect(h.states.at(-1)?.kind).toBe('ready');
    h.event(identity('bob')); expect(h.states.at(-1)).toEqual({ kind: 'checking' });
    h.event(null); next.resolve({ displayName: 'Bob', username: null }); await flush(); expect(h.states.at(-1)).toEqual({ kind: 'signed-out' });
  });
  it('rejects guest/unverified identities without private reads', () => {
    const read = vi.fn(); const h = harness(read);
    h.event({ ...identity('guest'), isAnonymous: true }); expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'guest' });
    h.event({ ...identity('unverified'), emailVerified: false }); expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'unverified' }); expect(read).not.toHaveBeenCalled();
  });
  it('requires an existing BarrelBook profile and never creates one', async () => { const h = harness(async () => null); h.event(identity('new-oauth-id')); await flush(); expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'missing-account' }); });
  it('distinguishes read failure from missing account', async () => { const h = harness(async () => { throw new Error('offline'); }); h.event(identity('alice')); await flush(); expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'unavailable' }); });
  it('invalidates pending reads before sign-out completion', async () => { const pending = deferred<AccountProfile | null>(); const h = harness(() => pending.promise); h.event(identity('alice')); h.controller.invalidate(); pending.resolve({ displayName: 'Alice', username: null }); await flush(); expect(h.states.at(-1)).toEqual({ kind: 'checking' }); });
  it('never publishes results after the subscriber is stopped', async () => { const pending = deferred<AccountProfile | null>(); const h = harness(() => pending.promise); h.event(identity('alice')); h.controller.stop(); const count = h.states.length; pending.resolve({ displayName: 'Alice', username: null }); await flush(); expect(h.states).toHaveLength(count); expect(h.unsubscribe).toHaveBeenCalledOnce(); });
  it('fails closed when the identity observer fails', () => { const h = harness(async () => null); h.fail(); expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'unavailable' }); });
});

describe('pilot admission', () => {
  const profile = { displayName: 'Alice', username: null };

  it('checks an invitation before any profile read and blocks a denied account', async () => {
    const gate = deferred<boolean>();
    const read = vi.fn(async () => profile);
    const h = harness(read, () => gate.promise);
    h.event(identity('alice'));
    expect(read).not.toHaveBeenCalled();
    gate.resolve(false);
    await expect.poll(() => h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'pilot-access' });
    expect(read).not.toHaveBeenCalled();
    h.controller.stop();
  });

  it('ignores a previous account’s late authorization after switching accounts', async () => {
    const gate = deferred<boolean>();
    const read = vi.fn(async () => profile);
    const h = harness(read, uid => uid === 'alice' ? gate.promise : Promise.resolve(false));
    h.event(identity('alice'));
    h.event(identity('bob'));
    gate.resolve(true);
    await expect.poll(() => h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'pilot-access' });
    expect(read).not.toHaveBeenCalled();
    h.controller.stop();
  });

  it('removes the admitted workspace when the periodic check detects revocation', async () => {
    vi.useFakeTimers();
    const authorize = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const h = harness(async () => profile, authorize);
    try {
      h.event(identity('alice'));
      await vi.advanceTimersByTimeAsync(0);
      expect(h.states.at(-1)?.kind).toBe('ready');
      await vi.advanceTimersByTimeAsync(60_000);
      expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'pilot-access' });
      expect(authorize).toHaveBeenCalledTimes(2);
    } finally {
      h.controller.stop();
      vi.useRealTimers();
    }
  });

  it('fails closed if authorization never responds', async () => {
    vi.useFakeTimers();
    const read = vi.fn(async () => profile);
    const h = harness(read, () => new Promise(() => {}));
    try {
      h.event(identity('alice'));
      await vi.advanceTimersByTimeAsync(10_000);
      expect(h.states.at(-1)).toEqual({ kind: 'blocked', reason: 'unavailable' });
      expect(read).not.toHaveBeenCalled();
    } finally {
      h.controller.stop();
      vi.useRealTimers();
    }
  });
});
