'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { assertOwner, type Runtime } from '../lib/firebase';

const sizes = ['Standard', 'Large', 'Extra large'] as const;
type Size = typeof sizes[number];

export function ReadingSize({ runtime, uid, children }: { runtime: Runtime; uid: string; children: (control: ReactNode) => ReactNode }) {
  const [size, setSize] = useState<Size>('Large');
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'read-error' | 'write-error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const changed = useRef(false);
  const sequence = useRef(0);
  const alive = useRef(false);
  useEffect(() => {
    let current = true;
    alive.current = true;
    async function load() {
      assertOwner(runtime, uid);
      const snapshot = await getDocFromServer(doc(runtime.db, 'users', uid, 'webPreferences', 'reading'));
      assertOwner(runtime, uid);
      if (!current || changed.current) return;
      const saved = snapshot.data()?.textSize;
      setSize(sizes.includes(saved) ? saved : 'Large');
      setStatus('ready');
    }
    void load().catch(() => { if (current && !changed.current) setStatus('read-error'); });
    return () => { current = false; alive.current = false; };
  }, [runtime, uid, attempt]);

  async function save(next: Size) {
    const run = ++sequence.current;
    const current = () => alive.current && sequence.current === run;
    const timeout = window.setTimeout(() => {
      if (current()) setStatus('write-error');
    }, 8000);
    changed.current = true;
    setSize(next);
    setStatus('saving');
    try {
      assertOwner(runtime, uid);
      if (!navigator.onLine) throw new Error('Offline');
      await setDoc(doc(runtime.db, 'users', uid, 'webPreferences', 'reading'), { textSize: next });
      assertOwner(runtime, uid);
      if (current()) setStatus('ready');
    } catch {
      if (current()) setStatus('write-error');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const control = <div className="reading-control">
    <label>Text size<select aria-label="Text size" value={size} disabled={status === 'saving'} onChange={event => void save(event.target.value as Size)}>
      {sizes.map(option => <option key={option}>{option}</option>)}
    </select></label>
    {status === 'write-error' && <span role="status">Save unconfirmed. <button onClick={() => void save(size)}>Retry save</button></span>}
    {status === 'read-error' && <span role="status">Size unavailable. <button onClick={() => setAttempt(i => i + 1)}>Retry load</button></span>}
    {status === 'saving' && <span className="sr-only" role="status">Saving text size</span>}
  </div>;
  return <div className="owner-workspace" data-size={size}>{children(control)}</div>;
}
