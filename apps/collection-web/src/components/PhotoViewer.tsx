'use client';
import { useCallback,useEffect,useRef,useState,type ReactNode } from 'react';
import {Check,ChevronLeft,ChevronRight,Maximize2,X,ZoomIn,ZoomOut} from 'lucide-react';
import { clampZoom, MAX_ZOOM, pinchZoom, zoomedOffset } from '../lib/photo-viewer';
export function PhotoViewer({bottle,index,onSelect,onClose,renderPhoto,compactSinglePhoto=false,displayFacts}:{
  displayFacts?:[string,string][];
  compactSinglePhoto?:boolean;
  bottle:{name:string;photos:string[];primaryImageIndex:number;proof:number|null;ageStatement?:string|null;release?:string;distilledBy?:string|null;size?:string|null};
  index:number;onSelect:(index:number)=>void;onClose:()=>void;renderPhoto:(location:string,name:string)=>ReactNode;
}) {
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
  const zoomTo = useCallback((value: number, anchor?: { x: number; y: number }) => {
    const host = viewport.current;
    if (!host) return;
    const next = clampZoom(value), before = zoomValue.current;
    const x = anchor?.x ?? host.clientWidth / 2, y = anchor?.y ?? host.clientHeight / 2;
    const left = next === 1 ? 0 : zoomedOffset(host.scrollLeft, x, before, next);
    const top = next === 1 ? 0 : zoomedOffset(host.scrollTop, y, before, next);
    zoomValue.current = next; setZoom(next);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { if (host.isConnected) { host.scrollLeft = left; host.scrollTop = top; } });
  }, []);
  useEffect(() => {
    const host = viewport.current;
    if (!host) return;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || !event.deltaY) return;
      event.preventDefault();
      const bounds = host.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? host.clientHeight : 1);
      zoomTo(zoomValue.current * Math.exp(-delta * 0.002), { x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    };
    host.addEventListener('wheel', wheel, { passive: false });
    return () => host.removeEventListener('wheel', wheel);
  }, [zoomTo]);
  const photoCount = bottle.photos.length;
  const multiple = photoCount > 1;
  const compact = compactSinglePhoto && !multiple;
  const photoLabel = (i: number) => i === bottle.primaryImageIndex ? 'Cover photo' : `Photo ${i + 1}`;
  const facts = displayFacts ?? [
    ['Proof', bottle.proof?.toString()], ['Age', bottle.ageStatement], ['Release', bottle.release],
    ['Distilled by', bottle.distilledBy], ['Size', bottle.size],
  ].filter(([, value]) => value);
  const choose = (position: number) => {
    const next = (position + photoCount) % photoCount;
    if (next === index) return;
    zoomTo(1); pointers.current.clear(); drag.current = null; pinch.current = null; onSelect(next);
    // On phones, choosing a thumbnail below the stage should reveal the new photo.
    const body = viewport.current?.closest('.d1-body');
    if (body) body.scrollTop = 0;
  };
  return <section ref={root} className={`fullscreen-photo-viewer d1-viewer${compact ? ' guest-single-photo' : ''}`} role="dialog" aria-modal="true" aria-labelledby="photo-viewer-title" aria-describedby="photo-viewer-help"
    onClickCapture={event => {
      // WebKit leaves clicked buttons unfocused. Keep subsequent keyboard input inside the viewer.
      (event.target as Element).closest('button')?.focus({ preventScroll: true });
    }} onKeyDown={e => {
    // The enclosing modal layer handles Tab for whichever dialog is active.
    if (e.key === 'Tab') return;
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(zoomValue.current + 0.5); }
    if (e.key === '-') { e.preventDefault(); zoomTo(zoomValue.current - 0.5); }
    if (e.key === '0') { e.preventDefault(); zoomTo(1); }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !(e.target === viewport.current && zoomValue.current > 1)) { e.preventDefault(); choose(index + (e.key === 'ArrowLeft' ? -1 : 1)); }
  }}>
    <header className="d1-header">
      <div>
        <h2 id="photo-viewer-title">{bottle.name}</h2>
        {!compact && <p role="status">Photo {index + 1} of {photoCount}{index === bottle.primaryImageIndex && ' · Cover photo'}</p>}
      </div>
      <button className="d1-control" aria-label="Close photo viewer" onClick={onClose}><X size={20} /> Close</button>
    </header>
    <div className="d1-body">
    <div className="d1-stage">
      {multiple && <button className="d1-arrow" aria-label="Previous photo" onClick={() => choose(index - 1)}><ChevronLeft /></button>}
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
      <div className="viewer-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>{renderPhoto(bottle.photos[index],bottle.name+', '+photoLabel(index))}</div>
    </div>
      {multiple && <button className="d1-arrow" aria-label="Next photo" onClick={() => choose(index + 1)}><ChevronRight /></button>}
    </div>
    <aside className="d1-panel" aria-label="Bottle photos and zoom">
      <div className="d1-tools">
        <div className="d1-tool-heading"><h3>Zoom</h3><span role="status" aria-label="Zoom level">{Math.round(zoom * 100)}%</span></div>
        <div className="d1-buttons" role="group" aria-label="Photo zoom">
          <button className="d1-control" disabled={zoom >= MAX_ZOOM} onClick={() => zoomTo(zoom + 0.5)}><ZoomIn size={18} />Zoom in</button>
          <button className="d1-control" disabled={zoom <= 1} onClick={() => zoomTo(zoom - 0.5)}><ZoomOut size={18} />Zoom out</button>
          <button className="d1-control" onClick={() => zoomTo(1)}><Maximize2 size={18} />Fit to screen</button>
        </div>
        <p id="photo-viewer-help">Scroll or pinch on the photo to zoom. Drag to pan.</p>
      </div>
      {multiple && <div className="d1-photos" role="group" aria-label="All bottle photos">
        {bottle.photos.map((location, i) => <button key={i} aria-label={`Show photo ${i + 1}${i === bottle.primaryImageIndex ? ', cover photo' : ''}`} aria-pressed={index === i} onClick={() => choose(i)}>
          {renderPhoto(location,photoLabel(i))}
          <span>{index === i && <Check size={16} aria-hidden="true" />}{photoLabel(i)}</span>
        </button>)}
      </div>}
      {!compact && facts.length > 0 && <section className="d1-facts"><h3>About this bottle</h3>
        <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>}
    </aside>
    </div>
  </section>;
}
