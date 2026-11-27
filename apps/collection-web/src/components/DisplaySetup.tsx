'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { BottleRecord } from '../lib/records';
import { DEFAULT_DISPLAY, selectShelf, type Settings, type Shelf } from '../lib/bar-display';
import { api, ownerHeaders, requestDisplay, startDisplay } from '../lib/display-client';

function PreviewPhoto({
  id,
  name,
  revision,
  onReady,
}: {
  id: string;
  name: string;
  revision: string;
  onReady: (id: string) => void;
}) {
  const [src, setSrc] = useState('');
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let alive = true,
      url = '';
    const controller = new AbortController();
    void ownerHeaders()
      .then((headers) =>
        fetch(api, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'preview-photo', photo: id, revision }),
          cache: 'no-store',
          signal: controller.signal,
        }),
      )
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const blob = await r.blob();
        if (alive) {
          url = URL.createObjectURL(blob);
          setSrc(url);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, revision]);
  return src ? (
    <button
      type="button"
      aria-label={`Inspect ${name}`}
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <img
        width={expanded ? 720 : 82}
        height={expanded ? 540 : 100}
        alt={name}
        src={src}
        onLoad={(e) => {
          void e.currentTarget
            .decode()
            .then(() => onReady(id))
            .catch(() => {});
        }}
      />
    </button>
  ) : (
    <span>Photo unavailable</span>
  );
}

export function DisplaySetup({ bottles, onClose }: { bottles: BottleRecord[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_DISPLAY),
    [pin, setPin] = useState('');
  const [preview, setPreview] = useState<{ shelf: Shelf; revision: string } | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const [readyPhotos, setReadyPhotos] = useState<Set<string>>(() => new Set());
  const photoReady = useCallback(
    (id: string) => setReadyPhotos((old) => (old.has(id) ? old : new Set([...old, id]))),
    [],
  );
  const allPreviewed =
    !!preview && preview.shelf.cards.every((c) => c.photos.every((id) => readyPhotos.has(id)));
  const eligible = selectShelf(bottles, DEFAULT_DISPLAY);
  const count = selectShelf(bottles, settings).length;
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const change = (v: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...v }));
    setPreview(null);
    setError('');
  };
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (preview && !allPreviewed) throw new Error('Wait for every photo or turn photos off.');
      if (preview) await startDisplay(preview.revision, pin);
      else setPreview(await requestDisplay('preview', { settings }, true));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Display unavailable');
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog ref={dialog} aria-labelledby="display-setup-title" className="display-setup" onCancel={onClose}>
      <h1 id="display-setup-title">{preview ? 'Guest preview' : 'Start Bar Display'}</h1>
      <form onSubmit={submit}>
        <fieldset disabled={busy}>
          {!preview ? (
            <>
              <label>
                Shelf
                <select
                  aria-label="Shelf"
                  value={settings.shelf}
                  onChange={(e) => change({ shelf: e.target.value as Settings['shelf'] })}
                >
                  <option value="whole">Whole shelf</option>
                  <option value="open">Open only</option>
                  <option value="flight">A flight</option>
                </select>
              </label>
              {settings.shelf === 'flight' && (
                <fieldset className="flight-picker">
                  <legend>Choose flight bottles</legend>
                  {eligible.map((b) => (
                    <label key={b.id}>
                      <input
                        type="checkbox"
                        checked={settings.flight.includes(b.id)}
                        onChange={(e) =>
                          change({
                            flight: e.target.checked
                              ? [...settings.flight, b.id]
                              : settings.flight.filter((id) => id !== b.id),
                          })
                        }
                      />
                      {b.name}
                    </label>
                  ))}
                </fieldset>
              )}
              <label>
                <input
                  type="checkbox"
                  checked={settings.values}
                  onChange={(e) => change({ values: e.target.checked })}
                />
                Show estimated bottle value
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.ratings}
                  onChange={(e) => change({ ratings: e.target.checked })}
                />
                Show star ratings
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.photos}
                  onChange={(e) => change({ photos: e.target.checked })}
                />
                Include bottle photos
              </label>
              <label>
                Change bottles every
                <select
                  value={settings.seconds}
                  onChange={(e) => change({ seconds: Number(e.target.value) as Settings['seconds'] })}
                >
                  {[8, 12, 30].map((n) => (
                    <option key={n} value={n}>
                      {n} seconds
                    </option>
                  ))}
                </select>
              </label>
              <p>
                {count} eligible {count === 1 ? 'bottle' : 'bottles'}
              </p>
            </>
          ) : (
            <>
              <p>
                {preview.shelf.cards.length} bottles · {settings.seconds} seconds per bottle · 8-hour session
              </p>
              {settings.photos && (
                <p>Check the labels and backgrounds in your photos. Select a photo to enlarge it.</p>
              )}
              <ul className="display-preview">
                {preview.shelf.cards.map((c, i) => (
                  <li key={i}>
                    <strong>{c.name}</strong>
                    <p>
                      {[
                        c.brand,
                        c.type,
                        c.age,
                        c.proof !== null && c.proof + ' proof',
                        c.status,
                        c.fill !== null && c.fill + '% full',
                        c.pick && 'Store pick',
                        c.rating != null && c.rating + ' / 5 stars',
                        c.estimatedValue != null && 'Estimated value $' + c.estimatedValue.toFixed(2),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {c.photos.length
                      ? c.photos.map((id, n) => (
                          <PreviewPhoto
                            key={id}
                            id={id}
                            revision={preview.revision}
                            onReady={photoReady}
                            name={c.name + ', photo ' + (n + 1)}
                          />
                        ))
                      : 'Bottle silhouette'}
                  </li>
                ))}
              </ul>
              <label>
                Set a six-digit display PIN
                <input
                  required
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="new-password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </label>
              <p>Ending the display requires this PIN. Opening a collection requires a fresh sign-in.</p>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setPin('');
                }}
              >
                Change settings
              </button>
            </>
          )}
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          {preview && !allPreviewed && (
            <p role="status">
              Waiting for all photos to load. If a photo is unavailable, change settings and turn photos off.
            </p>
          )}
          <button disabled={!count || busy || (!!preview && !allPreviewed)}>
            {busy ? 'Preparing display…' : preview ? 'Start guest display' : 'Preview the display'}
          </button>
        </fieldset>
      </form>
      {error && <p role="alert">{error}</p>}
    </dialog>
  );
}
