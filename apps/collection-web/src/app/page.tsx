'use client';

import Link from 'next/link';
import BottleEditor, { type NavigationGuard } from '../components/BottleEditor';
import ListsView from '../components/ListsView';
import AskBBView from '../components/AskBBView';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, ArrowUpDown, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Eye, EyeOff, ImageOff, Images, LayoutGrid, List, LockKeyhole, LogOut, Maximize2, MessageCircle, RefreshCw, Search, ShieldCheck, SlidersHorizontal, Smartphone, Star, UserRound, Wine, X, ZoomIn, ZoomOut } from 'lucide-react';
import { canShowAskBB, endSession, finishRedirect, getRuntime, isSessionError, loadPlan, readBottles, readPhoto, resetPassword, sessionPort, signInEmail, signInProvider, type BottlePage, type Runtime } from '../lib/firebase';
import { observeAccount, type SessionState } from '../lib/session';
import { planLabel, statusLabel, type BottleRecord, type PlanSnapshot } from '../lib/records';
import { friendlyAuthError } from '../lib/services';
import { ConfigurationError, canEditBottle } from '../lib/config';
import { clampZoom, pinchZoom, zoomedOffset } from '../lib/photo-viewer';
import { collectPages, collectionResults, collectionSummary, INITIAL_VIEW, RENDER_PAGE_SIZE, SORTS, type CollectionView } from '../lib/collection';

function Button({ children, onClick, disabled = false, secondary = false, type = 'button' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; secondary?: boolean; type?: 'button' | 'submit' }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`button ${secondary ? 'secondary' : 'primary'}`}>{children}</button>;
}

function Photo({ runtime, uid, location, name }: { runtime: Runtime; uid: string; location?: string; name: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const [image, setImage] = useState<{ location: string; url: string } | null>(null);
  const [photoError, setPhotoError] = useState<{ location: string; code: string } | null>(null);
  useEffect(() => {
    let alive = true, url: string | null = null, started = false;
    const element = host.current;
    if (!location || !element) return;
    const observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      void readPhoto(runtime, uid, location).then(blob => {
        if (!alive) return;
        url = URL.createObjectURL(blob); setImage({ location, url });
      }, error => { if (alive) setPhotoError({ location, code: /^storage\/[a-z-]+$/.test(String(error?.code)) ? String(error.code) : 'photo/unavailable' }); });
    }, { rootMargin: '150px' });
    observer.observe(element);
    return () => { alive = false; observer.disconnect(); if (url) URL.revokeObjectURL(url); };
  }, [runtime, uid, location]);
  const error = photoError?.location === location ? photoError?.code : '';
  return <span ref={host} className="photo">{image && image.location === location ? <img src={image.url} alt={name} /> : <span role="img" aria-label={error ? 'Photo unavailable' : location ? 'Loading photo' : 'No photo'} data-storage-error-code={error || undefined}><ImageOff size={20} /><span className="photo-state">{error ? 'Photo unavailable' : location ? 'Loading photo…' : 'No photo recorded'}</span></span>}</span>;
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return <span className="muted">Not rated</span>;
  return <span className="rating" aria-label={`${value} out of 5 stars`}><Star size={17} fill="currentColor" /><span>{value.toFixed(1)}</span><span className="rating-max">/ 5</span></span>;
}
function Status({ value }: { value: BottleRecord['status'] }) { return <span className={`status status-${value.toLowerCase()}`}><span />{statusLabel(value)}</span>; }
function Fill({ value }: { value: number | null }) { return value === null ? <span className="muted">Not recorded</span> : <span className="fill"><span>{value}%</span><span className="fill-track"><span style={{ width: `${value}%` }} /></span></span>; }

function PhotoViewer({ bottle, runtime, index, onSelect, onClose }: { bottle: BottleRecord; runtime: Runtime; index: number; onSelect: (index: number) => void; onClose: () => void }) {
  const root = useRef<HTMLElement>(null), viewport = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const zoomValue = useRef(1), frame = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const pinch = useRef<{ zoom: number; distance: number } | null>(null);
  useEffect(() => {
    root.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => cancelAnimationFrame(frame.current);
  }, []);
  const zoomTo = (value: number, anchor?: { x: number; y: number }) => {
    const host = viewport.current;
    if (!host) return;
    const next = clampZoom(value), before = zoomValue.current;
    const x = anchor?.x ?? host.clientWidth / 2, y = anchor?.y ?? host.clientHeight / 2;
    const left = next === 1 ? 0 : zoomedOffset(host.scrollLeft, x, before, next);
    const top = next === 1 ? 0 : zoomedOffset(host.scrollTop, y, before, next);
    zoomValue.current = next; setZoom(next);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { if (host.isConnected) { host.scrollLeft = left; host.scrollTop = top; } });
  };
  const choose = (next: number) => {
    if (next < 0 || next >= bottle.photos.length || next === index) return;
    zoomTo(1); pointers.current.clear(); drag.current = null; pinch.current = null; onSelect(next);
  };
  return <section ref={root} className="fullscreen-photo-viewer" role="dialog" aria-modal="true" aria-labelledby="photo-viewer-title" aria-describedby="photo-viewer-help" onKeyDown={e => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key === 'Tab') {
      const controls = [...(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]') || [])].filter(el => el.getClientRects().length);
      if (e.shiftKey && document.activeElement === controls[0]) { e.preventDefault(); controls.at(-1)?.focus(); }
      else if (!e.shiftKey && document.activeElement === controls.at(-1)) { e.preventDefault(); controls[0]?.focus(); }
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(zoomValue.current + 0.5); }
    if (e.key === '-') { e.preventDefault(); zoomTo(zoomValue.current - 0.5); }
    if (e.key === '0') { e.preventDefault(); zoomTo(1); }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !(e.target === viewport.current && zoomValue.current > 1)) { e.preventDefault(); choose(index + (e.key === 'ArrowLeft' ? -1 : 1)); }
  }}>
    <header className="viewer-heading"><div><span className="eyebrow">YOUR BOTTLE PHOTOS</span><h2 id="photo-viewer-title">{bottle.name}</h2></div><button className="icon-button" aria-label="Close photo viewer" onClick={onClose}><X /></button></header>
    <div className="viewer-toolbar"><div className="viewer-zoom-controls" role="group" aria-label="Photo zoom"><button className="icon-button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => zoomTo(zoomValue.current - 0.5)}><ZoomOut size={19} /></button><span role="status" aria-label="Zoom level">{Math.round(zoom * 100)}%</span><button className="icon-button" aria-label="Zoom in" disabled={zoom >= 5} onClick={() => zoomTo(zoomValue.current + 0.5)}><ZoomIn size={19} /></button><button className="fit-photo" onClick={() => zoomTo(1)}>Fit</button></div><div className="viewer-photo-navigation"><button className="icon-button" aria-label="Previous photo" disabled={index === 0} onClick={() => choose(index - 1)}><ChevronLeft size={20} /></button><span role="status">Photo {index + 1} of {bottle.photos.length}</span><button className="icon-button" aria-label="Next photo" disabled={index === bottle.photos.length - 1} onClick={() => choose(index + 1)}><ChevronRight size={20} /></button></div></div>
    <div ref={viewport} className={`viewer-viewport ${zoom > 1 ? 'is-zoomed' : ''}`} tabIndex={0} role="region" aria-label="Bottle photo; drag to pan when zoomed" onDoubleClick={e => { const bounds = e.currentTarget.getBoundingClientRect(); zoomTo(zoomValue.current === 1 ? 2 : 1, { x: e.clientX - bounds.left, y: e.clientY - bounds.top }); }} onDragStart={e => e.preventDefault()} onPointerDown={e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.currentTarget.focus({ preventScroll: true }); e.currentTarget.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) drag.current = { x: e.clientX, y: e.clientY, left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop };
      if (pointers.current.size === 2) { const [a, b] = [...pointers.current.values()]; pinch.current = { zoom: zoomValue.current, distance: Math.hypot(a.x - b.x, a.y - b.y) }; drag.current = null; }
    }} onPointerMove={e => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2 && pinch.current) {
        const [a, b] = [...pointers.current.values()], bounds = e.currentTarget.getBoundingClientRect();
        zoomTo(pinchZoom(pinch.current.zoom, pinch.current.distance, Math.hypot(a.x - b.x, a.y - b.y)), { x: (a.x + b.x) / 2 - bounds.left, y: (a.y + b.y) / 2 - bounds.top });
      } else if (pointers.current.size === 1 && drag.current && zoomValue.current > 1) { e.currentTarget.scrollLeft = drag.current.left + drag.current.x - e.clientX; e.currentTarget.scrollTop = drag.current.top + drag.current.y - e.clientY; }
    }} onPointerUp={e => {
      pointers.current.delete(e.pointerId); pinch.current = null;
      const remaining = [...pointers.current.values()][0];
      drag.current = remaining ? { ...remaining, left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop } : null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    }} onPointerCancel={() => { pointers.current.clear(); drag.current = null; pinch.current = null; }}>
      <div className="viewer-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><Photo key={bottle.photos[index]} runtime={runtime} uid={bottle.ownerId} location={bottle.photos[index]} name={`${bottle.name}, photo ${index + 1}`} /></div>
    </div>
    <div className="viewer-thumbnails" role="group" aria-label="All bottle photos">{bottle.photos.map((location, i) => <button key={i} aria-label={`Show photo ${i + 1}`} aria-pressed={index === i} onClick={() => choose(i)}><Photo runtime={runtime} uid={bottle.ownerId} location={location} name={`Photo ${i + 1}`} /><span>{i + 1}</span></button>)}</div>
    <p id="photo-viewer-help" className="viewer-help">Double-click or pinch to zoom · Drag or scroll to pan · + / − to zoom · 0 to fit · Esc to close</p>
  </section>;
}

function BottleDetails({ bottle, runtime, onClose, onSaved, navigationGuard, initialPhotoViewer = false }: { bottle: BottleRecord; runtime: Runtime; onClose: () => void; onSaved?: (bottle: BottleRecord) => void; navigationGuard: { current: NavigationGuard | null }; initialPhotoViewer?: boolean }) {
  const [editing, setEditing] = useState(false), [saved, setSaved] = useState(false);
  const requestClose = useCallback(() => { if (navigationGuard.current) navigationGuard.current(onClose); else onClose(); }, [navigationGuard, onClose]);
  const [tab, setTab] = useState(initialPhotoViewer ? 'Photos' : 'Details'), [photoIndex, setPhotoIndex] = useState(bottle.primaryImageIndex), [viewerOpen, setViewerOpen] = useState(initialPhotoViewer && bottle.photos.length > 0);
  const viewerTrigger = useRef<HTMLElement | null>(null);
  const openViewer = (trigger: HTMLElement) => { viewerTrigger.current = trigger; setViewerOpen(true); };
  const closeViewer = () => { setViewerOpen(false); requestAnimationFrame(() => { const trigger = viewerTrigger.current?.isConnected ? viewerTrigger.current : root.current?.querySelector<HTMLElement>('[aria-label="Open photo viewer"]'); trigger?.focus({ preventScroll: true }); }); };
  const root = useRef<HTMLDivElement>(null);
  const sections = ['Details', 'Tasting', 'Photos'];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); }
      if (e.key === 'Tab') {
        const scope = root.current?.querySelector<HTMLElement>('[role=alertdialog]') || root.current;
        const controls = [...(scope?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled)') || [])].filter(el => el.getClientRects().length && !el.closest('[inert]'));
        if (e.shiftKey && document.activeElement === controls[0]) { e.preventDefault(); controls.at(-1)?.focus(); }
        else if (!e.shiftKey && document.activeElement === controls.at(-1)) { e.preventDefault(); controls[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus({ preventScroll: true }); };
  }, [requestClose]);
  const money = (value: number | null) => value === null ? 'Not recorded' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  const rows = [['Brand', bottle.brand], ['Release', bottle.release], ['Edition', bottle.edition], ['Distilled by', bottle.distilledBy], ['Type', bottle.type], ['Proof', bottle.proof?.toFixed(1)], ['Size', bottle.size], ['Quantity', String(bottle.quantity)], ['Barrel number', bottle.barrelNumber], ['Warehouse', bottle.warehouse], ['Purchase price', money(bottle.purchasePrice)], ['MSRP', money(bottle.msrp)], ['Secondary estimate', money(bottle.secondaryPrice)], ['Storage location', bottle.storageLocation]];
  return <div className="modal-layer" onMouseDown={e => { if (e.target === e.currentTarget) requestClose(); }}>
    <section ref={root} role="dialog" aria-modal="true" aria-labelledby="bottle-title" className="bottle-dialog" inert={viewerOpen} aria-hidden={viewerOpen || undefined}>
      <header className="dialog-heading"><span>Bottle details</span><button className="icon-button" aria-label="Close bottle details" onClick={requestClose}><X /></button></header>
      <div className="dialog-hero"><button className="bottle-photo-button" aria-label="View bottle photos" disabled={!bottle.photos.length} onClick={e => { setTab('Photos'); openViewer(e.currentTarget); }}><Photo key={bottle.photos[photoIndex] || 'none'} runtime={runtime} uid={bottle.ownerId} location={bottle.photos[photoIndex]} name={bottle.name} /></button><div><span className="eyebrow">YOUR COLLECTION</span><h2 id="bottle-title">{bottle.name}</h2><p>{bottle.proof === null ? 'Proof not recorded' : `${bottle.proof.toFixed(1)} proof`} · {bottle.size || 'Size not recorded'}</p><span className="private-line"><LockKeyhole size={12} />Private to your account</span></div></div>
      {!editing && <div className="detail-tabs" role="tablist" aria-label="Bottle sections">{sections.map((t, index) => <button key={t} role="tab" id={`tab-${t}`} aria-controls={`panel-${t}`} aria-selected={tab === t} tabIndex={tab === t ? 0 : -1} onClick={() => setTab(t)} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? sections.length - 1 : (index + (e.key === 'ArrowLeft' ? -1 : 1) + sections.length) % sections.length; setTab(sections[next]); e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next].focus(); } }}>{t}{t === 'Photos' && bottle.photos.length ? ` (${bottle.photos.length})` : ''}</button>)}</div>}
      {saved && !editing && <p className="saved-notice" role="status"><Check size={16} />Changes saved.</p>}
      <div className="dialog-body">
        {editing ? <BottleEditor bottle={bottle} runtime={runtime} guardRef={navigationGuard} onCancel={() => setEditing(false)} onSaved={next => { onSaved?.(next); setEditing(false); setSaved(true); }} /> : tab === 'Details' ? <div role="tabpanel" id="panel-Details" aria-labelledby="tab-Details"><div className="detail-stats"><div><span>Status</span><Status value={bottle.status} /></div><div><span>Fill level</span><Fill value={bottle.fillLevel} /></div><div><span>My rating</span><Rating value={bottle.rating} /></div></div><dl className="detail-fields">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not recorded'}</dd></div>)}</dl><section className="notes"><h3>Tags</h3><div className="tags">{bottle.tags.length ? bottle.tags.map(t => <span key={t}>{t}</span>) : <span className="muted">No tags recorded</span>}</div><h3>Private notes</h3><p>{bottle.notes || 'No notes recorded.'}</p></section></div>
          : tab === 'Tasting' ? <section role="tabpanel" id="panel-Tasting" aria-labelledby="tab-Tasting" className="notes"><h3>My rating</h3><Rating value={bottle.rating} /><h3>Tasting notes</h3><p>{bottle.tastingNotes || 'No tasting notes recorded.'}</p></section>
          : <section role="tabpanel" id="panel-Photos" aria-labelledby="tab-Photos" className="photo-gallery"><button className="open-photo-viewer" aria-label="Open photo viewer" disabled={!bottle.photos.length} onClick={e => openViewer(e.currentTarget)}><Photo key={bottle.photos[photoIndex] || 'none'} runtime={runtime} uid={bottle.ownerId} location={bottle.photos[photoIndex]} name={`${bottle.name}, photo ${photoIndex + 1}`} />{bottle.photos.length > 0 && <span><Maximize2 size={16} />Enlarge & zoom</span>}</button>{bottle.photos.length > 1 && <div className="detail-photo-thumbnails" role="group" aria-label="All bottle photos">{bottle.photos.map((location, i) => <button key={i} aria-label={`Show photo ${i + 1}`} aria-pressed={photoIndex === i} onClick={() => setPhotoIndex(i)}><Photo runtime={runtime} uid={bottle.ownerId} location={location} name={`Photo ${i + 1}`} /><span>{i + 1}</span></button>)}</div>}{bottle.photos.length > 0 ? <><div className="gallery-controls"><button className="icon-button" aria-label="Previous photo" disabled={photoIndex === 0} onClick={() => setPhotoIndex(i => i - 1)}><ChevronLeft size={20} /></button><span role="status">Photo {photoIndex + 1} of {bottle.photos.length}</span><button className="icon-button" aria-label="Next photo" disabled={photoIndex === bottle.photos.length - 1} onClick={() => setPhotoIndex(i => i + 1)}><ChevronRight size={20} /></button></div><p>Existing photos · Private to your account</p></> : <p>No photos recorded for this bottle.</p>}</section>}
      </div>
      <footer className="dialog-footer" hidden={editing}>{onSaved && canEditBottle(runtime.config, bottle.id) ? <Button secondary onClick={() => { setSaved(false); setEditing(true); }}>Edit bottle</Button> : <span><Smartphone size={16} />Manage bottle details in the iPhone app.</span>}<Button secondary onClick={requestClose}>Done</Button></footer>
    </section>{viewerOpen && <PhotoViewer bottle={bottle} runtime={runtime} index={photoIndex} onSelect={setPhotoIndex} onClose={closeViewer} />}
  </div>;
}

function SignIn({ runtime, redirectError, redirectErrorCode }: { runtime: Runtime; redirectError: string; redirectErrorCode: string }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [reset, setReset] = useState(false), [sent, setSent] = useState(false), [blockedProvider, setBlockedProvider] = useState<'apple' | 'google' | null>(null), [authErrorCode, setAuthErrorCode] = useState(''), [showPassword, setShowPassword] = useState(false);
  async function emailSubmit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setSent(false); setAuthErrorCode(''); setShowPassword(false);
    try { if (reset) { await resetPassword(runtime, email); setSent(true); } else { await signInEmail(runtime, email, password); setPassword(''); } }
    catch (err) { setError(friendlyAuthError(err)); setAuthErrorCode(typeof err === 'object' && err !== null && 'code' in err && /^auth\/[a-z-]+$/.test(String(err.code)) ? String(err.code) : ''); }
    finally { setBusy(false); }
  }
  function providerSubmit(kind: 'apple' | 'google', redirect = false) {
    setBusy(true); setError(''); setBlockedProvider(null); setAuthErrorCode(''); setShowPassword(false);
    void signInProvider(runtime, kind, redirect).catch(err => {
      setError(friendlyAuthError(err)); setAuthErrorCode(/^auth\/[a-z-]+$/.test(String(err?.code)) ? String(err.code) : ''); if (err?.code === 'auth/popup-blocked') setBlockedProvider(kind);
    }).finally(() => setBusy(false));
  }
  return <main className="signin-main"><section className="signin-story"><span className="eyebrow">YOUR BARRELBOOK. MORE ROOM TO EXPLORE.</span><h1>Your collection,<br />at your fingertips.</h1><p>A closer look at the bottles, picks, and pours that make your shelf yours.</p><div className="story-details"><span><BookOpen />Your collection, on a bigger screen.</span><span><ShieldCheck />Same account. Your private shelf.</span><span><Smartphone />Connected to your iPhone collection.</span></div><a href="https://www.barrelbook.app/">Explore BarrelBook<ArrowRight size={15} /></a></section><section className="signin-form" aria-labelledby="signin-title"><span className="private-line"><LockKeyhole size={14} />PRIVATE COLLECTION ACCESS</span><h2 id="signin-title">{reset ? 'Reset your password' : 'Welcome back.'}</h2><p>{reset ? 'Enter the email you use for BarrelBook.' : 'Sign in with the same account you use in the app.'}</p>{!reset && <><div className="provider-buttons"><Button secondary disabled={busy} onClick={() => providerSubmit('apple')}>Continue with Apple</Button><Button secondary disabled={busy} onClick={() => providerSubmit('google')}>Continue with Google</Button></div><div className="or-divider"><span />or use email<span /></div></>}<form onSubmit={emailSubmit}><label>Email address<input name="email" autoComplete="username" type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></label>{!reset && <div className="password-field"><label htmlFor="signin-password">Password</label><span className="password-control"><input id="signin-password" name="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} disabled={busy} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}<span>{showPassword ? 'Hide' : 'Show'}</span></button></span></div>}{(error || redirectError) && <p className="form-error" role="alert" data-auth-error-code={authErrorCode || redirectErrorCode || undefined}>{error || redirectError}</p>}{sent && <p className="form-success" role="status"><Check size={17} />If this email can receive a reset, you’ll get instructions shortly.</p>}<Button type="submit" disabled={busy}>{busy ? 'Please wait…' : reset ? 'Send reset instructions' : 'Log in'}{!busy && <ArrowRight size={16} />}</Button></form>{blockedProvider && <Button secondary disabled={busy} onClick={() => providerSubmit(blockedProvider, true)}>Continue in this tab<ArrowRight size={15} /></Button>}<button className="text-button reset-link" disabled={busy} onClick={() => { setReset(v => !v); setError(''); setAuthErrorCode(''); setSent(false); setPassword(''); setShowPassword(false); }}>{reset ? 'Back to log in' : 'Forgot your password?'}</button><p className="signin-footnote">New to BarrelBook? Get started in the iPhone app.<br />Use your existing sign-in method to keep one collection.</p></section></main>;
}

type WorkspaceView = CollectionView & { surface: 'collection' | 'lists' | 'ask-bb'; listId: string | null };
const INITIAL_WORKSPACE_VIEW: WorkspaceView = { ...INITIAL_VIEW, surface: 'collection', listId: null };

function useCollectionNavigation() {
  const [browse, setBrowse] = useState(INITIAL_WORKSPACE_VIEW);
  const current = useRef(browse);
  const leaveGuard = useRef<NavigationGuard | null>(null);
  const navigation = useRef<{ scope: string; position: number; allowPop: boolean; undo: (() => void) | null; entries: Map<string, { browse: WorkspaceView; scroll: number; focus: HTMLElement | null }> } | null>(null);
  const restore = useRef<{ scroll: number; focus: HTMLElement | null } | null>(null);
  useEffect(() => {
    const nav = { scope: crypto.randomUUID(), position: 0, allowPop: false, undo: null as (() => void) | null, entries: new Map<string, { browse: WorkspaceView; scroll: number; focus: HTMLElement | null }>() };
    navigation.current = nav;
    const entry = crypto.randomUUID();
    nav.entries.set(entry, { browse: current.current, scroll: window.scrollY, focus: null });
    window.history.replaceState({ ...window.history.state, bbCollection: { scope: nav.scope, entry, position: 0 } }, '');
    const pop = (event: PopStateEvent) => {
      const key = event.state?.bbCollection;
      if (nav.undo) { const ask = nav.undo; nav.undo = null; ask(); return; }
      const target = key?.scope === nav.scope && Number.isInteger(key.position) ? key.position : 0;
      const delta = target - nav.position;
      if (leaveGuard.current && !nav.allowPop && delta) {
        nav.undo = () => {
          const proceed = () => { leaveGuard.current = null; nav.allowPop = true; window.history.go(delta); };
          if (leaveGuard.current) leaveGuard.current(proceed); else proceed();
        };
        window.history.go(-delta); return;
      }
      nav.allowPop = false; nav.position = target;
      const snapshot = key?.scope === nav.scope ? nav.entries.get(key.entry) : null;
      const next = snapshot?.browse || INITIAL_WORKSPACE_VIEW;
      current.current = next; restore.current = snapshot || { scroll: 0, focus: null }; setBrowse(next);
    };
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('popstate', pop); nav.entries.clear(); navigation.current = null; leaveGuard.current = null; };
  }, []);
  useEffect(() => {
    if (!restore.current) return;
    const snapshot = restore.current; restore.current = null;
    const frame = requestAnimationFrame(() => { window.scrollTo({ top: snapshot.scroll, behavior: 'instant' }); if (snapshot.focus?.isConnected) snapshot.focus.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [browse]);
  const update = useCallback((patch: Partial<WorkspaceView>, push = false) => {
    const nav = navigation.current;
    if (!nav) return;
    const marker = window.history.state?.bbCollection;
    if (push && marker?.scope === nav.scope) nav.entries.set(marker.entry, { browse: current.current, scroll: window.scrollY, focus: document.activeElement as HTMLElement | null });
    const next = { ...current.current, ...patch };
    const entry = push || marker?.scope !== nav.scope ? crypto.randomUUID() : marker.entry;
    if (push) nav.position += 1;
    nav.entries.set(entry, { browse: next, scroll: window.scrollY, focus: document.activeElement as HTMLElement | null });
    window.history[push ? 'pushState' : 'replaceState']({ ...window.history.state, bbCollection: { scope: nav.scope, entry, detail: !!next.detailId, position: nav.position } }, '');
    current.current = next; setBrowse(next);
  }, []);
  const closeDetails = useCallback(() => {
    if (window.history.state?.bbCollection?.scope === navigation.current?.scope && window.history.state?.bbCollection?.detail) window.history.back();
    else update({ detailId: null });
  }, [update]);
  const closeList = useCallback(() => {
    const marker = window.history.state?.bbCollection;
    const steps = marker?.detail ? 2 : 1;
    if (marker?.scope === navigation.current?.scope && marker?.position >= steps && current.current.listId) window.history.go(-steps);
    else update({ listId: null, detailId: null });
  }, [update]);
  return { browse, update, closeDetails, closeList, leaveGuard };
}

function Workspace({ runtime, session, onSignOut, onExpired }: { runtime: Runtime; session: Extract<SessionState, { kind: 'ready' }>; onSignOut: () => void; onExpired: () => void }) {
  const uid = session.identity.uid;
  const [bottles, setBottles] = useState<BottleRecord[]>([]), [page, setPage] = useState<BottlePage | null>(null), [loading, setLoading] = useState(true), [loadError, setLoadError] = useState(false), [account, setAccount] = useState(false), [filtersOpen, setFiltersOpen] = useState(false);
  const [plan, setPlan] = useState<PlanSnapshot | null>(null), [planError, setPlanError] = useState(false), [planLoading, setPlanLoading] = useState(true), [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const { browse, update, closeDetails, closeList, leaveGuard } = useCollectionNavigation();
  const live = useRef(true), request = useRef(0), planRequest = useRef(0);
  const load = useCallback(async () => {
    const run = ++request.current;
    const isCurrent = () => live.current && request.current === run;
    try {
      await runtime.auth.currentUser?.reload();
      const profile = await sessionPort(runtime).readProfile(uid);
      if (!isCurrent()) return;
      if (!profile) { onExpired(); return; }
      await collectPages<BottlePage['cursor']>(cursor => readBottles(runtime, uid, cursor), isCurrent, (next, records) => { setBottles(records); setPage(next); });
    } catch (err) {
      if (isCurrent()) { if (isSessionError(err)) onExpired(); else setLoadError(true); }
    } finally { if (isCurrent()) setLoading(false); }
  }, [runtime, uid, onExpired]);
  const requestLoad = () => { setLoading(true); setLoadError(false); setPage(null); void load(); };
  const refreshPlan = useCallback(async () => {
    const run = ++planRequest.current;
    try { const next = await loadPlan(runtime, uid); if (live.current && planRequest.current === run) { setPlan(next); setPlanError(false); } }
    catch { if (live.current && planRequest.current === run) { setPlan(null); setPlanError(true); } }
    finally { if (live.current && planRequest.current === run) setPlanLoading(false); }
  }, [runtime, uid]);
  useEffect(() => {
    live.current = true;
    // Both callbacks await Firebase; stale responses are fenced by request generation and owner checks.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(); void refreshPlan();
    const connection = () => setOnline(navigator.onLine);
    window.addEventListener('online', connection); window.addEventListener('offline', connection);
    return () => { live.current = false; window.removeEventListener('online', connection); window.removeEventListener('offline', connection); };
  }, [load, refreshPlan]);
  const matches = useMemo(() => collectionResults(bottles, browse), [bottles, browse]);
  const summary = collectionSummary(matches), visible = matches.slice(0, browse.limit);
  const tags = useMemo(() => [...new Set(bottles.flatMap(b => b.tags))].sort((a, b) => a.localeCompare(b)), [bottles]);
  const showLists = browse.surface === 'lists';
  const askAvailable = canShowAskBB(runtime);
  const showAskBB = askAvailable && browse.surface === 'ask-bb';
  const [referencedBottles, setReferencedBottles] = useState<Map<string, BottleRecord>>(() => new Map());
  const askDetail = showAskBB && browse.detailId ? referencedBottles.get(browse.detailId) : undefined;
  const openAskBottle = (bottle: BottleRecord) => {
    setReferencedBottles(records => new Map(records).set(bottle.id, bottle));
    update({ detailId: bottle.id, photoViewer: false }, true);
  };
  const selected = matches.find(b => b.id === browse.selectedId);
  const detail = showLists || showAskBB ? undefined : bottles.find(b => b.id === browse.detailId);
  const complete = !!page && !page.hasMore && !loading && !loadError;
  const filterCount = Number(browse.status !== 'Active') + Number(browse.rating !== '0') + Number(!!browse.tag);
  const filter = (patch: Partial<CollectionView>) => update({ ...patch, limit: RENDER_PAGE_SIZE, selectedId: null });
  const resetFilters = () => filter({ query: '', status: 'Active', rating: '0', tag: '' });
  const openDetails = (bottle: BottleRecord, photoViewer = false) => update({ detailId: bottle.id, photoViewer }, true);
  const planText = planLoading ? 'Checking your plan…' : planError ? 'Plan unavailable' : plan ? `${planLabel(plan.tier)} · ${plan.cycle}` : 'Plan unavailable';
  const accountPanel = account && <section className="account-panel" aria-label="Your account"><div><span className="eyebrow">YOUR ACCOUNT</span><h2>{session.profile.displayName}</h2>{session.identity.email && <p>{session.identity.email}</p>}</div><div><span className="eyebrow">MEMBERSHIP</span><p className="plan-label" aria-live="polite">{planText}</p>{planError && <button className="text-button" onClick={() => { setPlanLoading(true); setPlanError(false); void refreshPlan(); }}>Retry plan check</button>}</div><p className="account-help">Your current BarrelBook plan applies here. Manage purchases and account settings in the iPhone app.</p></section>;
  const selectSurface = (surface: WorkspaceView['surface']) => {
    if (surface !== browse.surface) update({ surface, listId: null, detailId: null, photoViewer: false }, true);
  };
  return <>
    <nav className="workspace-nav" aria-label="Workspace navigation">
      <div className="workspace-sections">
        <button aria-current={!showLists && !showAskBB ? 'page' : undefined} onClick={() => selectSurface('collection')}><List size={17} />Collection</button>
        <button aria-current={showLists ? 'page' : undefined} onClick={() => selectSurface('lists')}><BookOpen size={17} />Lists</button>
        {askAvailable && <button aria-current={showAskBB ? 'page' : undefined} onClick={() => selectSurface('ask-bb')}><MessageCircle size={17} />Ask B.B.</button>}
      </div>
      <div><button onClick={() => setAccount(v => !v)} aria-expanded={account}><UserRound size={17} />Account</button><button onClick={() => leaveGuard.current ? leaveGuard.current(onSignOut) : onSignOut()}><LogOut size={16} />Sign out</button></div>
    </nav>
    {askAvailable && <AskBBView runtime={runtime} uid={uid} active={showAskBB} modalOpen={!!askDetail} online={online}
      accountPanel={accountPanel} onOpenBottle={openAskBottle} onSessionLost={onExpired} />}
    {askDetail && <BottleDetails key={askDetail.id} bottle={askDetail} runtime={runtime} onClose={closeDetails} navigationGuard={leaveGuard} />}
    {showAskBB ? null : showLists ? <ListsView runtime={runtime} uid={uid} listId={browse.listId} itemId={browse.detailId}
      accountPanel={accountPanel}
      onOpenList={listId => update({ listId, detailId: null }, true)} onCloseList={closeList}
      onOpenItem={detailId => update({ detailId }, !browse.detailId)}
      renderBottle={bottle => <BottleDetails key={bottle.id} bottle={bottle} runtime={runtime} onClose={closeDetails} navigationGuard={leaveGuard} />}
    /> : <>
    <main className={`workspace-main ${browse.view === 'grid' ? 'catalog-view' : ''}`} inert={!!detail}>
      {accountPanel}
      <div className="collection-heading"><div><div className="title-line"><h1>My collection</h1><span className="private-line"><LockKeyhole size={14} />Private collection</span></div><p>{summary.records} {summary.records === 1 ? 'record' : 'records'} · {summary.units} {summary.units === 1 ? 'bottle' : 'bottles'}{!complete && (loading ? ' · Loading your collection…' : ' · Collection incomplete')}</p></div><span className="read-only"><ShieldCheck size={15} />{runtime.config.emulators && runtime.config.localEditingEnabled ? 'Local edit testing' : runtime.config.stagingEditBottleId ? 'Staging pilot · test bottle only' : 'Read-only access'}</span></div>
      {!online && <div className="notice" role="status">You’re offline. Loaded records may be out of date. Reconnect to refresh.</div>}
      {loadError && <div className="notice error" role="alert">We couldn’t finish loading your collection. Search covers only the records shown; results may be incomplete or out of date.<button className="text-button" onClick={requestLoad}>Retry</button></div>}
      <div className="collection-toolbar">
        <label className="search-field"><Search size={20} /><input aria-label="Search bottles" aria-describedby="collection-results" placeholder="Search bottles, batches, tags, notes…" value={browse.query} onChange={e => filter({ query: e.target.value })} />{browse.query && <button aria-label="Clear search" className="icon-button" onClick={() => filter({ query: '' })}><X size={16} /></button>}</label>
        <button className={`filter-button ${filterCount ? 'has-filters' : ''}`} aria-expanded={filtersOpen} aria-controls="collection-filters" onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={17} /><span>Filters{filterCount > 0 ? ` (${filterCount})` : ''}</span><ChevronDown size={14} /></button>
        <label className="sort-field"><ArrowUpDown size={17} /><select aria-label="Sort bottles" value={browse.sort} onChange={e => filter({ sort: e.target.value })}>{SORTS.map(s => <option key={s}>{s}</option>)}</select></label>
        <div className="view-toggle" role="group" aria-label="Collection view"><button aria-label="Table view" aria-pressed={browse.view === 'table'} onClick={() => update({ view: 'table' })}><List size={20} /><span>Table</span></button><button aria-label="Grid view" aria-pressed={browse.view === 'grid'} onClick={() => update({ view: 'grid' })}><LayoutGrid size={18} /><span>Grid</span></button></div>
        <button className="icon-button refresh-button" aria-label="Refresh collection" disabled={loading} onClick={requestLoad}><RefreshCw className={loading ? 'spinning' : ''} size={19} /></button>
      </div>
      {filtersOpen && <section id="collection-filters" className="collection-filters" aria-label="Collection filters"><label>Status<select aria-label="Bottle status" value={browse.status} onChange={e => filter({ status: e.target.value })}>{['Active', 'All', 'Unopened', 'Opened', 'Finished', 'Archived', 'Unknown'].map(s => <option key={s} value={s}>{s === 'Finished' ? 'Empty' : s}</option>)}</select></label><label>My rating<select aria-label="Minimum rating" value={browse.rating} onChange={e => filter({ rating: e.target.value })}><option value="0">Any rating</option><option value="3">3 stars and up</option><option value="4">4 stars and up</option><option value="4.5">4.5 stars and up</option><option value="5">5 stars</option></select></label><label>Tag<select aria-label="Filter by tag" value={browse.tag} onChange={e => filter({ tag: e.target.value })}><option value="">All tags</option>{tags.map(t => <option key={t}>{t}</option>)}</select></label><button className="text-button" onClick={resetFilters}>Reset filters</button><button className="icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={17} /></button></section>}
      <div className={`collection-results ${browse.view === 'grid' && complete && !browse.query && !filterCount ? 'sr-only' : ''}`} id="collection-results" role="status" aria-live="polite"><span>{summary.records} {summary.records === 1 ? 'record' : 'records'} · {summary.units} {summary.units === 1 ? 'bottle' : 'bottles'}{!complete && ' in loaded records'}{loading && ' · Searching the rest of your collection…'}</span><span>{summary.rated} rated{(browse.query || filterCount > 0) && <button className="text-button" onClick={resetFilters}>Clear search & filters</button>}</span></div>
      {selected && <section className="selected-summary" aria-label="Selected bottle"><Photo runtime={runtime} uid={uid} location={selected.photos[selected.primaryImageIndex]} name={selected.name} /><div className="summary-main"><span className="eyebrow">SELECTED BOTTLE</span><h2>{selected.name}</h2><dl>{[['Barrel', selected.barrelNumber], ['Warehouse', selected.warehouse], ['Proof', selected.proof?.toFixed(1)], ['Type', selected.type]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not recorded'}</dd></div>)}</dl><div className="tags">{selected.tags.map(tag => <button key={tag} onClick={() => filter({ tag })}>{tag}</button>)}</div></div><button className="text-button" onClick={() => openDetails(selected)}>View details<ArrowRight size={15} /></button><button className="icon-button" aria-label="Clear selected bottle" onClick={() => update({ selectedId: null })}><X size={16} /></button></section>}
      {loading && !bottles.length ? <div className="loading-state" role="status"><RefreshCw className="spinning" /><p>Loading your collection…</p></div> : !matches.length ? <section className="empty-state"><Wine size={30} /><h2>{!complete ? 'No matches in loaded records yet' : bottles.length || browse.query || filterCount ? 'No matching bottles' : 'Your collection starts in the app.'}</h2><p>{!complete ? 'Results are incomplete until your collection finishes loading.' : bottles.length || browse.query || filterCount ? 'Try another search or filter.' : 'Bottles saved in BarrelBook will appear here.'}</p>{(browse.query || filterCount > 0) && <Button secondary onClick={resetFilters}>Clear filters</Button>}</section> : browse.view === 'grid' ? <div className="bottle-grid" aria-label="Collection grid">{visible.map(bottle => <article key={bottle.id} className={`bottle-card ${selected?.id === bottle.id ? 'selected' : ''}`}><button className="card-photo" aria-label={`View photos for ${bottle.name}`} onClick={() => openDetails(bottle, true)}><Photo runtime={runtime} uid={uid} location={bottle.photos[bottle.primaryImageIndex]} name={bottle.name} />{bottle.photos.length > 0 && <span className="card-photo-count"><Images size={13} />{bottle.photos.length} {bottle.photos.length === 1 ? 'photo' : 'photos'}</span>}</button><div className="card-content"><button className="bottle-name" onClick={() => openDetails(bottle)}>{bottle.name}</button><p className="card-subtitle" title={[bottle.edition, bottle.brand || bottle.type].filter(Boolean).join(' · ') || 'Bottle details'}>{[bottle.edition, bottle.brand || bottle.type].filter(Boolean).join(' · ') || 'Bottle details'}</p><div className="card-facts"><span>{bottle.proof === null ? 'Proof not recorded' : `${bottle.proof.toFixed(1)} proof`}</span><span className="fact-separator" aria-hidden="true">·</span><Status value={bottle.status} /></div><div className="card-rating"><Rating value={bottle.rating} />{bottle.quantity > 1 && <span className="card-quantity">{bottle.quantity} bottles</span>}</div><button className="card-details text-button" aria-label={`Details for ${bottle.name}`} onClick={() => openDetails(bottle)}>View details<ArrowRight size={14} /></button></div></article>)}</div> : <div className="collection-table"><table><caption className="sr-only">Your private collection, {summary.records} matching records</caption><thead><tr><th scope="col">Bottle</th><th scope="col">Proof</th><th scope="col">Status</th><th scope="col">Fill</th><th scope="col">My rating</th></tr></thead><tbody>{visible.map(bottle => <tr key={bottle.id} className={selected?.id === bottle.id ? 'selected' : ''}><td className="bottle-cell"><button className="bottle-photo-button" aria-label={`View photos for ${bottle.name}`} onClick={() => openDetails(bottle, true)}><Photo runtime={runtime} uid={uid} location={bottle.photos[bottle.primaryImageIndex]} name={bottle.name} /></button><div><button className="bottle-name" onClick={() => openDetails(bottle)}>{bottle.name}</button><span className="bottle-subtitle">{[bottle.edition, bottle.barrelNumber ? `Barrel ${bottle.barrelNumber}` : null, bottle.brand].filter(Boolean).join(' · ') || bottle.type || 'Bottle details'}{bottle.quantity > 1 ? ` · Qty ${bottle.quantity}` : ''}</span><span className="mobile-meta">{bottle.proof === null ? 'Proof unknown' : `${bottle.proof.toFixed(1)} proof`}<Status value={bottle.status} /></span></div></td><td className="proof-cell">{bottle.proof?.toFixed(1) ?? '—'}</td><td className="status-cell"><Status value={bottle.status} /></td><td className="fill-cell"><Fill value={bottle.fillLevel} /></td><td className="rating-cell"><Rating value={bottle.rating} /><button className="icon-button preview-button" aria-label={`Preview ${bottle.name}`} aria-pressed={selected?.id === bottle.id} onClick={() => update({ selectedId: selected?.id === bottle.id ? null : bottle.id })}><Eye size={16} /></button><button className="mobile-details text-button" onClick={() => openDetails(bottle)} aria-label={`Details for ${bottle.name}`}>Details<ArrowRight size={12} /></button></td></tr>)}</tbody></table></div>}
      {matches.length > visible.length && <div className="pagination"><p>Showing {visible.length} of {matches.length} matching records.</p><Button secondary onClick={() => update({ limit: browse.limit + RENDER_PAGE_SIZE })}>Show {Math.min(RENDER_PAGE_SIZE, matches.length - visible.length)} more<ChevronDown size={16} /></Button></div>}
      <footer className="collection-footer"><span><LockKeyhole size={12} />Your shelf stays private.</span><span><Smartphone size={14} />{runtime.config.emulators && runtime.config.localEditingEnabled ? 'Add bottles in the iPhone app.' : 'Add and manage bottles in the iPhone app.'}</span></footer>
    </main>{detail && <BottleDetails key={detail.id} bottle={detail} runtime={runtime} onClose={closeDetails} navigationGuard={leaveGuard} onSaved={next => setBottles(previous => previous.map(record => record.id === next.id ? next : record))} initialPhotoViewer={browse.photoViewer} />}
    </>}
  </>;
}

export default function Page() {
  const [runtime, setRuntime] = useState<Runtime | null>(null), [session, setSession] = useState<SessionState>({ kind: 'checking' }), [setupFailed, setSetupFailed] = useState<'configuration' | 'verification' | null>(null), [redirectError, setRedirectError] = useState(''), [redirectErrorCode, setRedirectErrorCode] = useState('');
  const controller = useRef<ReturnType<typeof observeAccount> | null>(null);
  useEffect(() => {
    let alive = true;
    void getRuntime().then(client => {
      if (!alive) return;
      setRuntime(client); controller.current = observeAccount(sessionPort(client), setSession);
      void finishRedirect(client).catch(error => { if (alive) { setRedirectError(friendlyAuthError(error)); setRedirectErrorCode(/^auth\/[a-z-]+$/.test(String(error?.code)) ? String(error.code) : ''); } });
    }, error => { if (alive) setSetupFailed(error instanceof ConfigurationError ? 'configuration' : 'verification'); });
    const recheck = () => controller.current?.recheck();
    window.addEventListener('focus', recheck);
    return () => {
      alive = false;
      window.removeEventListener('focus', recheck);
      controller.current?.stop();
    };
  }, []);
  const signOut = useCallback(() => {
    if (!runtime) return;
    controller.current?.invalidate();
    void endSession(runtime).catch(() => setSession({ kind: 'blocked', reason: 'unavailable' }));
  }, [runtime]);
  const blockedCopy = session.kind === 'blocked' ? {
    guest: 'To open your collection on the web, first link your guest collection to an account in the iPhone app.',
    unverified: 'Finish verifying your email in the iPhone app, then sign in again.',
    'missing-account': 'No existing BarrelBook collection account is linked to this sign-in. Use the same sign-in method you use in the iPhone app.',
    'pilot-access': 'This account doesn’t have access to the BarrelBook web pilot. Sign in with the account that received the invitation.',
    unavailable: 'We couldn’t verify your account right now. Check your connection and try signing in again.',
  }[session.reason] : '';
  return <><a className="skip-link" href="#main-content">Skip to content</a><header className={`site-header ${session.kind === 'ready' ? 'workspace-header' : ''}`}><Link href="/" aria-label="BarrelBook collection"><img src="/barrelbook-logo.png" alt="BarrelBook" width="190" height="52" /></Link><span className="header-note">Your shelf, wherever you are.</span></header>{runtime?.config.emulators ? <div className="test-environment" role="status">Local test environment · No live account data</div> : ['barrelbook-staging', 'barrelbook-staging-v2'].includes(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '') ? <div className="test-environment" role="status">Staging environment · Your staging account and collection</div> : null}<div id="main-content">{setupFailed ? <main className="message-screen"><ShieldCheck size={34} /><h1>{setupFailed === 'verification' ? 'We couldn’t verify this browser.' : 'Web sign-in is being prepared.'}</h1><p>{setupFailed === 'verification' ? 'Browser verification could not complete. Check your connection and try again. Your collection has not been opened.' : 'Please use the BarrelBook iPhone app while we finish setting up this workspace.'}</p>{setupFailed === 'verification' && <Button secondary onClick={() => window.location.reload()}>Try again</Button>}<a href="https://www.barrelbook.app/" className="button secondary">Go to BarrelBook<ArrowRight size={16} /></a></main> : !runtime || session.kind === 'checking' ? <main className="message-screen" role="status"><RefreshCw className="spinning" size={26} /><p>Opening your workspace…</p></main> : session.kind === 'signed-out' ? <SignIn runtime={runtime} redirectError={redirectError} redirectErrorCode={redirectErrorCode} /> : session.kind === 'blocked' ? <main className="message-screen"><LockKeyhole size={30} /><h1>Let’s connect the right account.</h1><p>{blockedCopy}</p><Button onClick={signOut}>Back to log in<ArrowRight size={16} /></Button></main> : <Workspace key={`${session.identity.uid}:${session.generation}`} runtime={runtime} session={session} onSignOut={signOut} onExpired={signOut} />}</div><footer className="site-footer"><span>BarrelBook</span><div><a href="https://www.barrelbook.app/privacy">Privacy</a><a href="https://www.barrelbook.app/support"><CircleHelp size={13} />Support</a></div></footer></>;
}
