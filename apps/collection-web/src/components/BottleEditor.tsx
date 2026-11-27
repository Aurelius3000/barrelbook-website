'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowLeft, Check, RefreshCw, Save } from 'lucide-react';
import { readBottleForEdit, updateBottleDetails, type Runtime } from '../lib/firebase';
import { EditRequestError } from '../lib/services';
import { recordFromEdit, type BottleRecord, type EditBaseline, type EditField } from '../lib/records';
import { buildPatch, changeDraft, draftFrom, EDIT_SECTIONS, isDirty, reconcileSave, saveFailureState, type Draft, type Patch } from '../lib/bottle-edit';

export type NavigationGuard = (proceed: () => void) => void;
type Attempt = { baseline: EditBaseline; patch: Patch };
type SaveState = 'idle' | 'saving' | 'conflict' | 'uncertain' | 'retry' | 'matches' | 'changed';
export default function BottleEditor({ bottle, runtime, guardRef, onCancel, onSaved }: {
  bottle: BottleRecord; runtime: Runtime; guardRef: { current: NavigationGuard | null }; onCancel: () => void; onSaved: (bottle: BottleRecord) => void;
}) {
  const [baseline, setBaseline] = useState<EditBaseline | null>(null), [draft, setDraft] = useState<Draft | null>(null);
  const [state, setState] = useState<SaveState>('idle'), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<EditField, string>>>({}), [current, setCurrent] = useState<EditBaseline | null>(null);
  const [pending, setPending] = useState<{ proceed: () => void } | null>(null);
  const alive = useRef(false), generation = useRef(0), busy = useRef(false), attempt = useRef<Attempt | null>(null), abort = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null), confirmation = useRef<HTMLDivElement>(null), trigger = useRef<HTMLElement | null>(null);
  const dirty = !!baseline && !!draft && isDirty(baseline, draft);
  const locked = state !== 'idle';
  const message = (err: unknown) => err instanceof EditRequestError && [401, 403].includes(err.status) ? 'Your account could not be verified. Your draft is kept here; sign in again before saving.' : err instanceof EditRequestError && err.status === 404 ? 'This bottle is no longer available. Your draft is kept here.' : 'We couldn’t load the latest bottle. Check your connection and try again.';
  useEffect(() => {
    alive.current = true;
    const run = ++generation.current, controller = new AbortController(); abort.current = controller;
    void readBottleForEdit(runtime, bottle.ownerId, bottle.id, controller.signal).then(next => {
      if (alive.current && generation.current === run) { setBaseline(next); setDraft(draftFrom(next)); setLoading(false); }
    }, err => { if (alive.current && generation.current === run) { setError(message(err)); setLoading(false); } });
    return () => { alive.current = false; controller.abort(); abort.current?.abort(); };
  }, [runtime, bottle.id, bottle.ownerId]);
  useEffect(() => {
    guardRef.current = proceed => {
      if (busy.current) { setError('Please wait while the save or record check finishes.'); return; }
      if (!dirty && !attempt.current) { guardRef.current = null; proceed(); return; }
      trigger.current = document.activeElement as HTMLElement | null;
      setPending({ proceed });
    };
    return () => { guardRef.current = null; };
  }, [dirty, guardRef]);
  useEffect(() => {
    if (!dirty && !attempt.current) return;
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', leave);
    return () => window.removeEventListener('beforeunload', leave);
  }, [dirty, state]);
  useEffect(() => { if (pending) confirmation.current?.querySelector<HTMLButtonElement>('button')?.focus(); }, [pending]);
  useEffect(() => { if (baseline && !loading) form.current?.querySelector<HTMLInputElement>('input')?.focus(); }, [baseline, loading]);
  const cancel = () => guardRef.current ? guardRef.current(onCancel) : onCancel();
  async function checkCurrent() {
    if (busy.current || !baseline) return;
    busy.current = true; setError('');
    const run = generation.current, controller = new AbortController(); abort.current = controller;
    try {
      const latest = await readBottleForEdit(runtime, bottle.ownerId, bottle.id, controller.signal);
      if (!alive.current || run !== generation.current) return;
      setCurrent(latest);
      if (attempt.current) {
        const result = reconcileSave(attempt.current, latest);
        setState(result === 'unchanged' ? 'retry' : result === 'matches-unconfirmed' ? 'matches' : 'changed');
      }
    } catch (err) { if (alive.current && run === generation.current) setError(message(err)); }
    finally { busy.current = false; }
  }
  async function save(event?: FormEvent, retry = false) {
    event?.preventDefault();
    if (busy.current || !baseline || !draft || (!retry && locked)) return;
    const result = retry && attempt.current ? { patch: attempt.current.patch, errors: {} } : buildPatch(baseline, draft);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) { setError('Check the highlighted fields.'); requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus()); return; }
    if (!Object.keys(result.patch).length) { setError('No changes to save.'); return; }
    busy.current = true; setState('saving'); setError(''); setCurrent(null);
    const run = generation.current, controller = new AbortController(); abort.current = controller;
    const submitted = retry && attempt.current ? attempt.current : { baseline, patch: result.patch }; attempt.current = submitted;
    try {
      const saved = await updateBottleDetails(runtime, bottle.ownerId, submitted.baseline, submitted.patch, controller.signal);
      if (!alive.current || run !== generation.current) return;
      attempt.current = null; guardRef.current = null;
      onSaved(recordFromEdit(bottle, saved));
    } catch (err) {
      if (!alive.current || run !== generation.current) return;
      if (saveFailureState(retry, err instanceof EditRequestError ? err : {}) === 'uncertain') { setState('uncertain'); setError(retry ? 'The retry was not confirmed. The original save may still finish. Your draft is kept; check the current record again.' : 'We didn’t receive a save confirmation. Your draft is kept. Check the current record before doing anything else.'); }
      else if (err instanceof EditRequestError && err.status === 409) { attempt.current = null; setState('conflict'); setError('This bottle changed after you started editing. Your draft has been kept.'); }
      else { attempt.current = null; setState('idle'); setError(err instanceof EditRequestError && err.status === 400 ? 'The server rejected these changes. Check the values and try again.' : message(err)); }
    } finally { busy.current = false; }
  }
  function reloadCurrent() {
    if (!current || busy.current) return;
    trigger.current = document.activeElement as HTMLElement | null;
    setPending({ proceed: () => { attempt.current = null; setBaseline(current); setDraft(draftFrom(current)); setCurrent(null); setState('idle'); setError(''); setErrors({}); } });
  }
  const keepEditing = () => { setPending(null); requestAnimationFrame(() => trigger.current?.focus()); };
  return <div className="bottle-editor">
    <div inert={!!pending}><div className="editor-intro"><span className="eyebrow">EDIT EXISTING BOTTLE</span><h3>Edit bottle</h3><p>Changes stay in this draft until you save.</p></div>
    {loading ? <div className="editor-loading" role="status"><RefreshCw className="spinning" size={20} />Loading the latest bottle…</div> : null}
    {error && <div className="notice error editor-message" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
    {!baseline && !loading && <button className="button secondary" onClick={onCancel}>Back to details</button>}
    {draft && baseline && <>
      {state !== 'idle' && state !== 'saving' && <section className="editor-conflict" aria-label="Save review">
        <h4>{state === 'conflict' ? 'Review before saving' : 'Save outcome needs review'}</h4>
        {state === 'retry' && <p>The current record hasn’t changed. You can retry the same changes; we’ll check for conflicts again.</p>}
        {state === 'matches' && <p>The current values match your draft, but we couldn’t confirm your save. Review the current record before continuing.</p>}
        {state === 'changed' && <p>The bottle has changed. Review your draft alongside the current values before reloading.</p>}
        <button className="button secondary" onClick={() => void checkCurrent()}><RefreshCw size={15} />Check current record</button>
        {state === 'retry' && <button className="button primary" onClick={() => void save(undefined, true)}>Retry same save</button>}
        {current && <><div className="edit-comparison"><table><caption>Your draft and the current record</caption><thead><tr><th>Field</th><th>Your draft</th><th>Current</th></tr></thead><tbody>{EDIT_SECTIONS.flatMap(section => section.fields).filter(field => draft[field.key] !== draftFrom(current)[field.key]).map(field => <tr key={field.key}><th scope="row">{field.label}</th><td>{draft[field.key] || 'Not recorded'}</td><td>{draftFrom(current)[field.key] || 'Not recorded'}</td></tr>)}</tbody></table></div><button className="text-button" onClick={reloadCurrent}>Reload current record and discard draft</button><p className="muted">Reloading lets you start a new edit. It does not automatically apply the old draft.</p></>}
      </section>}
      <form ref={form} onSubmit={event => void save(event)} noValidate>
        <fieldset className="editor-fields" disabled={locked}>
          {EDIT_SECTIONS.map(section => <section className="edit-section" key={section.name}><h4>{section.name}</h4><div className="edit-field-grid">{section.fields.map(field => {
            const { key, label, kind } = field;
            const disabled = (key === 'finishDetails' && draft.isFinished !== 'true') || (['storeName', 'selectionDate', 'pickerName'].includes(key) && draft.isStorePick !== 'true') || (key === 'status' && baseline.fields.status === 'Archived');
            const common = { id: `edit-${key}`, value: draft[key], disabled, 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `error-${key}` : undefined, onChange: (event: { target: { value: string } }) => { setDraft(changeDraft(draft, key, event.target.value)); setErrors(previous => ({ ...previous, [key]: undefined })); } };
            return <div className={`edit-field ${['textarea', 'tags'].includes(kind) ? 'wide' : ''}`} key={key}><label htmlFor={`edit-${key}`}>{label}{field.required && <span aria-hidden="true"> *</span>}</label>{kind === 'boolean' ? <select {...common}><option value="" disabled>Not recorded</option><option value="true">Yes</option><option value="false">No</option></select> : kind === 'status' ? <select {...common}>{!['Unopened', 'Opened', 'Finished', 'Archived'].includes(draft.status) && <option value={draft.status} disabled>{draft.status || 'Not recorded'}</option>}{['Unopened', 'Opened', 'Finished', ...(baseline.fields.status === 'Archived' ? ['Archived'] : [])].map(status => <option key={status} value={status}>{status === 'Finished' ? 'Empty' : status}</option>)}</select> : ['textarea', 'tags'].includes(kind) ? <textarea {...common} rows={kind === 'tags' ? 3 : 5} /> : <input {...common} type={kind === 'date' ? 'date' : ['number', 'integer'].includes(kind) ? 'number' : 'text'} step={kind === 'integer' ? 1 : 'any'} min={['number', 'integer'].includes(kind) ? key === 'quantity' ? 1 : 0 : undefined} max={key === 'fillLevel' ? 100 : key === 'rating' ? 5 : undefined} placeholder="Not recorded" />}{errors[key] && <span id={`error-${key}`} className="field-error">{errors[key]}</span>}</div>;
          })}</div></section>)}
        </fieldset>
        <footer className="editor-actions"><span aria-live="polite">{state === 'saving' ? 'Saving changes…' : dirty ? 'Unsaved changes' : 'No changes yet'}</span><button type="button" className="button secondary" onClick={cancel} disabled={state === 'saving'}><ArrowLeft size={15} />Cancel</button><button type="submit" className="button primary" disabled={!dirty || locked}>{state === 'saving' ? <RefreshCw className="spinning" size={16} /> : <Save size={16} />}Save changes</button></footer>
      </form>
    </>}
    </div>
    {pending && <div className="discard-layer"><div ref={confirmation} role="alertdialog" aria-modal="true" aria-labelledby="discard-title" className="discard-dialog" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); keepEditing(); } }}><h3 id="discard-title">Discard this draft?</h3><p>{['uncertain', 'retry', 'matches', 'changed'].includes(state) ? 'The save outcome is unconfirmed. Leaving discards this draft, but does not cancel a save already received by the server.' : 'Your unsaved changes will be lost.'}</p><div><button className="button secondary" onClick={keepEditing}>Keep draft</button><button className="button primary" onClick={() => { const proceed = pending.proceed; setPending(null); guardRef.current = null; proceed(); }}><Check size={15} />Discard draft</button></div></div></div>}
  </div>;
}
