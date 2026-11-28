'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid2X2,
  LockKeyhole,
  Pause,
  Play,
  Star,
  Wine,
} from 'lucide-react';
import {
  categories,
  detailEntries,
  guestFactEntries,
  inCategory,
  type Card,
  type Shelf,
} from '../lib/bar-display';
import { api } from '../lib/display-client';
import { LeaveDisplay } from './DisplayBoundary';
import { PhotoViewer } from './PhotoViewer';
import './bar-display.css';

function viewportChanged(listener: () => void) {
  window.addEventListener('resize', listener);
  return () => window.removeEventListener('resize', listener);
}
const columns = () => (window.innerWidth >= 1300 ? 5 : window.innerWidth >= 800 ? 3 : 2);
const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Picture({ id, name }: { id?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!id || failed)
    return (
      <span className="bar-silhouette" role="img" aria-label={'Bottle silhouette for ' + name}>
        <Wine aria-hidden="true" />
      </span>
    );
  return (
    <img
      src={api + '?photo=' + encodeURIComponent(id)}
      alt={name}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

function Facts({ card }: { card: Card }) {
  const facts = [
    ['Proof', card.proof],
    ['Age', card.age],
    ['Status', card.status],
    [
      'Estimated value',
      card.estimatedValue == null
        ? null
        : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(card.estimatedValue),
    ],
  ];
  return (
    <>
      <dl className="bar-facts">
        {facts
          .filter(([, value]) => value != null)
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
      {card.fill != null && (
        <div className="bar-fill">
          <span>{card.fill}% full</span>
          <meter aria-label="Bottle fill" min={0} max={100} value={card.fill} />
        </div>
      )}
      {card.rating != null && (
        <div className="bar-rating" aria-label={card.rating + ' out of five stars'}>
          <Star fill="currentColor" aria-hidden="true" /> {card.rating} / 5
        </div>
      )}
    </>
  );
}

function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!,
      prior = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('input,button')?.focus();
    return () => {
      dialog.close();
      if (prior instanceof HTMLElement && prior.isConnected) prior.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="bar-modal"
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        const stops = [...e.currentTarget.querySelectorAll<HTMLElement>('button,input,[tabindex]')].filter(
          (el) => el.tabIndex >= 0 && !el.matches(':disabled') && el.getClientRects().length,
        );
        if (!stops.length) return;
        e.preventDefault();
        const current = stops.indexOf(document.activeElement as HTMLElement);
        stops[(current + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
      }}
    >
      {children}
    </dialog>
  );
}

function Gallery({ shelf }: { shelf: Shelf }) {
  const [index, select] = useState(0),
    [paused, setPaused] = useState(prefersStill);
  const [browse, setBrowse] = useState(false),
    [category, setCategory] = useState('Everything'),
    [page, setPage] = useState(0);
  const [detail, setDetail] = useState(false),
    [photo, setPhoto] = useState<number | null>(null),
    [leave, setLeave] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const count = shelf.cards.length,
    card = shelf.cards[index],
    width = useSyncExternalStore(viewportChanged, columns, () => 5),
    pageSize = width * 2;
  const filtered = shelf.cards.map((b, i) => (inCategory(b, category) ? i : -1)).filter((i) => i >= 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    currentPage = Math.min(page, totalPages - 1);
  const browseReturn = useRef<HTMLButtonElement>(null),
    showcaseBrowse = useRef<HTMLButtonElement>(null),
    previousBrowse = useRef(browse);
  useEffect(() => {
    if (previousBrowse.current === browse) return;
    (browse ? browseReturn : showcaseBrowse).current?.focus();
    previousBrowse.current = browse;
  }, [browse]);
  const toShowcase = useCallback(() => {
    setPhoto(null);
    setDetail(false);
    setBrowse(false);
    setPaused(prefersStill());
  }, []);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      if (query.matches) setPaused(true);
    };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (paused || browse || leave || photo !== null || count < 2) return;
    const timer = setTimeout(() => select((i) => (i + 1) % count), shelf.seconds * 1000);
    return () => clearTimeout(timer);
  }, [paused, browse, leave, photo, count, index, shelf.seconds]);
  useEffect(() => {
    if (!browse || leave) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(toShowcase, 60000);
    };
    const events = ['pointerdown', 'pointerup', 'keydown', 'wheel', 'touchmove'];
    reset();
    events.forEach((name) => window.addEventListener(name, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, reset));
    };
  }, [browse, leave, toShowcase]);
  useEffect(() => {
    let live = true,
      lock: WakeLockSentinel | undefined;
    const wake = async () => {
      if (document.hidden || !navigator.wakeLock) return;
      try {
        const next = await navigator.wakeLock.request('screen');
        if (live) lock = next;
        else await next.release();
      } catch {
        /* Browser power settings take precedence. */
      }
    };
    void wake();
    document.addEventListener('visibilitychange', wake);
    return () => {
      live = false;
      void lock?.release().catch(() => {});
      document.removeEventListener('visibilitychange', wake);
    };
  }, []);
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setFullscreenMessage('');
    } catch {
      setFullscreenMessage('Full screen is unavailable in this browser.');
    }
  }
  function showBrowse() {
    setBrowse(true);
    setCategory('Everything');
    setPage(Math.floor(index / pageSize));
  }
  function openPhoto() {
    setPhoto(0);
  }
  const heroImage = <Picture key={card.photos[0] || index} id={card.photos[0]} name={card.name} />;
  return (
    <main className="bar-display">
      <header className="bar-header">
        <div className="bar-brand">
          <img src="/barrelbook-logo.png" alt="BarrelBook" />
          <span>Bar Display</span>
        </div>
        <div>
          <button aria-label="Toggle full screen" onClick={() => void fullscreen()}>
            <Expand />
          </button>
          <button onClick={() => setLeave(true)}>
            <LockKeyhole />
            Leave Bar Display
          </button>
        </div>
      </header>
      {fullscreenMessage && <p role="status">{fullscreenMessage}</p>}
      {browse ? (
        <section aria-label="Browse shelf" className="bar-browse">
          <div className="bar-section-heading">
            <h1>Browse the shelf</h1>
            <button ref={browseReturn} onClick={toShowcase}>
              <ArrowLeft />
              Back to showcase
            </button>
          </div>
          <div className="bar-categories" role="group" aria-label="Bottle categories">
            {categories
              .filter((c) => {
                if (c === 'Five stars') return shelf.ratings;
                if (c === 'Bourbon' || c === 'Rye') return shelf.cards.some((card) => 'type' in card);
                if (c === 'Store picks') return shelf.cards.some((card) => 'pick' in card);
                if (c === 'Open to pour') return shelf.cards.some((card) => 'status' in card);
                return true;
              })
              .map((c) => (
                <button
                  key={c}
                  aria-pressed={c === category}
                  onClick={() => {
                    setCategory(c);
                    setPage(0);
                  }}
                >
                  {c}
                </button>
              ))}
          </div>
          <div className="bar-grid" style={{ gridTemplateColumns: 'repeat(' + width + ', minmax(0,1fr))' }}>
            {filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((i) => (
              <button
                className="bar-tile"
                key={i}
                aria-label={shelf.cards[i].name}
                onClick={(e) => {
                  e.currentTarget.focus();
                  select(i);
                  setDetail(true);
                }}
              >
                <Picture name={shelf.cards[i].name} id={shelf.cards[i].photos[0]} />
                <strong>{shelf.cards[i].name}</strong>
              </button>
            ))}
          </div>
          {!filtered.length && <p>No bottles in this category.</p>}
          <nav className="bar-paging" aria-label="Shelf pages">
            <button disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft />
              Previous
            </button>
            <span role="status">
              Page {currentPage + 1} of {totalPages} · {filtered.length} bottles
            </span>
            <button disabled={currentPage + 1 >= totalPages} onClick={() => setPage(currentPage + 1)}>
              Next
              <ChevronRight />
            </button>
          </nav>
        </section>
      ) : (
        <section className="bar-hero" aria-label="Bottle showcase">
          <div className="bar-art">
            <button aria-label={'Pause on ' + card.name} onClick={() => setPaused(true)}>
              {heroImage}
            </button>
          </div>
          <div className="bar-copy">
            <nav className="bar-navigation" aria-label="Showcase bottles">
              <button
                aria-label="Previous bottle"
                disabled={count < 2}
                onClick={() => {
                  select((index + count - 1) % count);
                  setPaused(true);
                }}
              >
                <ChevronLeft />
              </button>
              <span className="bar-counter">On the shelf · {index + 1} of {count}</span>
              <button
                aria-label="Next bottle"
                disabled={count < 2}
                onClick={() => {
                  select((index + 1) % count);
                  setPaused(true);
                }}
              >
                <ChevronRight />
              </button>
            </nav>
            <h1>{card.name}</h1>
            <p className="bar-subtitle">
              {[card.brand, card.type, card.pick && 'Store pick'].filter(Boolean).join(' · ')}
            </p>
            <Facts card={card} />
            <div className="bar-actions">
              <button ref={showcaseBrowse} className="bar-primary" onClick={showBrowse}>
                <Grid2X2 />
                Browse shelf
              </button>
              <button onClick={() => setPaused((v) => !v)}>
                {paused ? <Play /> : <Pause />}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={(e) => {
                  e.currentTarget.focus();
                  setPaused(true);
                  setDetail(true);
                }}
              >
                Bottle details
              </button>
              {card.photos.length > 0 && (
                <button
                  onClick={(e) => {
                    e.currentTarget.focus();
                    setPaused(true);
                    openPhoto();
                  }}
                >
                  <Expand />
                  Enlarge photo
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      {detail && (
        <Modal label="Bottle facts" onClose={() => setDetail(false)}>
          <article className="bar-detail">
            <button onClick={() => setDetail(false)}>Close</button>
            <h2>{card.name}</h2>
            <p>{[card.brand, card.type, card.pick && 'Store pick'].filter(Boolean).join(' · ')}</p>
            <div className="bar-detail-body">
              <div className="bar-detail-cover">{heroImage}</div>
              <div>
                <Facts card={card} />
              </div>
            </div>
            {card.details && (
              <dl className="bar-more-facts">
                {detailEntries(card).map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {card.photos.length > 0 && (
              <button
                onClick={(e) => {
                  e.currentTarget.focus();
                  openPhoto();
                }}
              >
                View bottle photos
              </button>
            )}
            {browse && (
              <button onClick={toShowcase}>
                Back to showcase
                <ArrowRight />
              </button>
            )}
          </article>
        </Modal>
      )}
      {photo !== null && (
        <Modal label="Photo viewer" onClose={() => setPhoto(null)}>
          <PhotoViewer
            bottle={{
              name: card.name,
              photos: card.photos,
              primaryImageIndex: 0,
              proof: card.proof ?? null,
              ageStatement: card.age,
            }}
            displayFacts={guestFactEntries(card)}
            guestDisplay
            index={photo}
            onSelect={setPhoto}
            onClose={() => setPhoto(null)}
            renderPhoto={(id, name) => (
              <span className="photo" key={id}>
                <Picture id={id} name={name} />
              </span>
            )}
          />
        </Modal>
      )}
      {leave && (
        <Modal label="End guest session" onClose={() => setLeave(false)}>
          <LeaveDisplay onCancel={() => setLeave(false)} />
        </Modal>
      )}
    </main>
  );
}

export function GuestDisplay() {
  const [shelf, setShelf] = useState<Shelf | null>(null),
    [failed, setFailed] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(api + '?shelf', { cache: 'no-store', signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const snapshot: Shelf = await r.json();
        if (!snapshot.cards.length) throw new Error();
        if (!controller.signal.aborted) setShelf(snapshot);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);
  return shelf ? (
    <Gallery shelf={shelf} />
  ) : (
    <main className="message-screen">
      <p role="status">{failed ? 'Unable to load this shelf.' : 'Opening the shelf…'}</p>
      {failed && (
        <button
          onClick={() => {
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
        >
          Retry
        </button>
      )}
      <LeaveDisplay />
    </main>
  );
}
