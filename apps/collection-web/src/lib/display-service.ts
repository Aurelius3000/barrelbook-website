import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, type DocumentReference } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import sharp from 'sharp';
import { decodeBottle, ownedPhotoPath } from './records';
import { authorizeWebOwner, hostedDisplayApp } from './web-admission';
import {
  DISPLAY_LIFETIME,
  PREVIEW_LIFETIME,
  guestCard,
  selectShelf,
  settingsValid,
  type Settings,
  type Shelf,
} from './bar-display';

const derive = promisify(scrypt);
const demo = 'demo-barrelbook-web';
const local = () =>
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === demo &&
  process.env.FIRESTORE_EMULATOR_HOST === '127.0.0.1:9480' &&
  process.env.FIREBASE_AUTH_EMULATOR_HOST === '127.0.0.1:9409' &&
  process.env.STORAGE_EMULATOR_HOST === 'http://127.0.0.1:9499';

class DisplayError extends Error {
  constructor(readonly status: number) {
    super('Display unavailable');
  }
}
const reject = (status: number): never => {
  throw new DisplayError(status);
};
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers });
const token = () => randomBytes(32).toString('hex');
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

function displayApp(request: Request) {
  const url = new URL(request.url);
  if (local() && ['localhost', '127.0.0.1'].includes(url.hostname)) {
    return (
      getApps().find((a) => a.name === 'bar-display-local') ??
      initializeApp({ projectId: demo }, 'bar-display-local')
    );
  }
  // Hosted admission and storage access require explicit provisioning before rollout.
  if (
    process.env.BARRELBOOK_DISPLAY_HOSTED !== 'true' ||
    url.origin !== process.env.BARRELBOOK_PILOT_ORIGIN ||
    url.protocol !== 'https:' ||
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  )
    reject(404);
  return hostedDisplayApp();
}

function cookieName(request: Request, preview: boolean) {
  const url = new URL(request.url);
  return (
    (url.protocol === 'https:' ? '__Host-' : '') +
    'bb-display-' +
    (url.port || 'web') +
    (preview ? '-preview' : '')
  );
}
function cookie(request: Request, preview: boolean) {
  const value = request.headers
    .get('cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(cookieName(request, preview) + '='))
    ?.split('=')[1];
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
function setCookie(response: Response, request: Request, preview: boolean, value: string) {
  response.headers.append(
    'Set-Cookie',
    cookieName(request, preview) +
      '=' +
      value +
      '; HttpOnly; SameSite=Strict; Path=/; Max-Age=' +
      (value ? (preview ? 1200 : 86400) : 0) +
      (new URL(request.url).protocol === 'https:' ? '; Secure' : ''),
  );
}
async function owner(app: App, request: Request) {
  if (!local()) {
    const result = await authorizeWebOwner(request);
    if (result.status !== 204) reject(result.status);
  }
  const bearer = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!bearer) return reject(401);
  const identity = await getAuth(app)
    .verifyIdToken(bearer, true)
    .catch(() => reject(401));
  if (
    identity.firebase.sign_in_provider === 'anonymous' ||
    (identity.firebase.sign_in_provider === 'password' && !identity.email_verified)
  )
    reject(403);
  if (!(await getFirestore(app).collection('users').doc(identity.uid).get()).exists) reject(403);
  return identity;
}
async function snapshotPhoto(app: App, path: string, target: DocumentReference, purgeAt: Timestamp) {
  const file = getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!).file(path);
  const [metadata] = await file.getMetadata();
  if (
    !Number.isFinite(Number(metadata.size)) ||
    Number(metadata.size) > 10 * 1024 * 1024 ||
    !/^image\/(jpeg|png|webp|avif|gif)$/.test(metadata.contentType ?? '')
  )
    return false;
  const [input] = await file.download({ start: 0, end: 10 * 1024 * 1024 });
  if (input.length !== Number(metadata.size)) return false;
  // Re-encode only visible pixels. The snapshot has no source URL, EXIF or original object access.
  const pixels = await sharp(input, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76 })
    .toBuffer();
  if (pixels.length > 900_000) return false;
  await target.create({ pixels, purgeAt });
  return true;
}

async function prepare(app: App, uid: string, settings: Settings) {
  if (!settingsValid(settings)) return reject(400);
  const db = getFirestore(app);
  const all = await db.collection('users').doc(uid).collection('bottles').get();
  const selected = selectShelf(
    all.docs.map((d) => decodeBottle(d.id, d.data(), uid)),
    settings,
  );
  if (!selected.length || (settings.shelf === 'flight' && selected.length !== settings.flight.length))
    return reject(422);
  const secret = token(),
    ref = db.collection('webDisplaySessions').doc(hash(secret));
  const purgeAt = Timestamp.fromMillis(Date.now() + PREVIEW_LIFETIME + DISPLAY_LIFETIME);
  const cards = [];
  for (const bottle of selected) {
    const card = guestCard(bottle, settings);
    const ordered = [bottle.photos[bottle.primaryImageIndex], ...bottle.photos].filter(Boolean);
    for (const location of settings.photos ? new Set(ordered) : []) {
      const path = ownedPhotoPath(location, uid, process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);
      if (!path?.startsWith('users/' + uid + '/bottles/' + bottle.id + '/')) continue;
      const photo = ref.collection('webDisplayPhotos').doc();
      // An unavailable or unsupported photo produces a silhouette in the preview.
      if (await snapshotPhoto(app, path, photo, purgeAt).catch(() => false)) card.photos.push(photo.id);
    }
    cards.push(card);
  }
  const shelf: Shelf = { cards, ratings: settings.ratings, seconds: settings.seconds };
  // Chunk by encoded size to stay below Firestore's document limit with large collections.
  let chunk: typeof cards = [],
    bytes = 0,
    count = 0;
  const flush = async () => {
    await ref
      .collection('webDisplayPages')
      .doc(String(count++).padStart(8, '0'))
      .create({ cards: chunk, purgeAt });
    chunk = [];
    bytes = 0;
  };
  for (const card of cards) {
    const size = Buffer.byteLength(JSON.stringify(card));
    if (size > 750000) return reject(422);
    if (bytes + size > 750000) await flush();
    chunk.push(card);
    bytes += size;
  }
  await flush();
  await ref.create({
    uid,
    phase: 'preview',
    ratings: shelf.ratings,
    seconds: shelf.seconds,
    expires: Date.now() + PREVIEW_LIFETIME,
    purgeAt,
  });
  return { shelf, secret, revision: ref.id };
}

export async function displayRequest(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') ?? '';
    const expectedOrigin =
      local() && /^(localhost|127\.0\.0\.1):[0-9]+$/.test(host)
        ? 'http://' + host
        : process.env.BARRELBOOK_PILOT_ORIGIN;
    if (request.method === 'POST' && (!expectedOrigin || request.headers.get('origin') !== expectedOrigin))
      return json({}, 403);
    const app = displayApp(request),
      db = getFirestore(app);
    const body = request.method === 'POST' ? await request.json().catch(() => reject(400)) : {};
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reject(400);
    const action =
      request.method === 'POST'
        ? body.action
        : url.searchParams.has('photo')
          ? 'photo'
          : url.searchParams.has('shelf')
            ? 'shelf'
            : 'status';
    const current = cookie(request, false);
    if (action === 'preview') {
      if (current) return reject(409);
      const identity = await owner(app, request);
      const { shelf, secret, revision } = await prepare(app, identity.uid, body.settings);
      const result = json({ shelf, revision });
      setCookie(result, request, true, secret);
      return result;
    }
    const preview = action === 'arm' || action === 'preview-photo';
    const secret = preview ? cookie(request, true) : current;
    if (!secret) return action === 'status' ? json({ mode: 'owner' }) : json({}, 403);
    const ref = db.collection('webDisplaySessions').doc(hash(secret));
    const record = (await ref.get()).data();
    const valid = record && record.expires > Date.now() && record.phase !== 'closed';
    if (!valid) {
      if (action === 'clear') {
        const result = json({});
        setCookie(result, request, false, '');
        return result;
      }
      return action === 'status' ? json({ mode: 'expired' }) : json({}, 410);
    }
    if (action === 'status')
      return json({
        mode: record.phase === 'active' ? 'guest' : 'locked',
        expires: record.expires,
        remaining: Math.max(0, record.expires - Date.now()),
      });
    if (action === 'recovery-ready' && ['active', 'locking'].includes(record.phase)) {
      // Firebase auth_time has second precision. Make a new sign-in distinguishable from the old one.
      const nextSecond = (Math.floor(record.armedAt / 1000) + 1) * 1000;
      return json({ wait: Math.max(0, nextSecond - Date.now()) });
    }
    if (action === 'arm') {
      const identity = await owner(app, request);
      if (
        current ||
        body.revision !== ref.id ||
        record.uid !== identity.uid ||
        !/^\d{6}$/.test(body.pin) ||
        typeof body.pin !== 'string'
      )
        return reject(400);
      const activation = token(),
        salt = token(),
        pinHash = ((await derive(body.pin, salt, 32)) as Buffer).toString('hex');
      await db.runTransaction(async (tx) => {
        const data = (await tx.get(ref)).data();
        if (data?.phase !== 'preview' || data.expires <= Date.now()) reject(409);
        tx.update(ref, {
          phase: 'locking',
          activationHash: hash(activation),
          salt,
          pinHash,
          attempts: 0,
          retryAt: 0,
          armedAt: Date.now(),
        });
      });
      const result = json({ activation });
      setCookie(result, request, false, secret);
      setCookie(result, request, true, '');
      return result;
    }
    if (action === 'activate') {
      await db.runTransaction(async (tx) => {
        const data = (await tx.get(ref)).data();
        if (data?.phase === 'active' && data.expires > Date.now()) return;
        if (
          data?.phase !== 'locking' ||
          data.expires <= Date.now() ||
          typeof body.activation !== 'string' ||
          hash(body.activation) !== data.activationHash
        )
          reject(409);
        const expires = Date.now() + DISPLAY_LIFETIME;
        tx.update(ref, {
          phase: 'active',
          activationHash: null,
          expires,
          purgeAt: Timestamp.fromMillis(expires),
        });
      });
      return json({});
    }
    if (action === 'end' || action === 'recover') {
      if (!['active', 'locking'].includes(record.phase)) return reject(403);
      let correct = false;
      if (action === 'recover') {
        const identity = await owner(app, request);
        correct = identity.uid === record.uid && identity.auth_time > Math.floor(record.armedAt / 1000);
        if (!correct) return reject(403);
      } else {
        if (typeof body.pin !== 'string' || !/^\d{6}$/.test(body.pin)) return reject(403);
        if (record.retryAt > Date.now()) return reject(429);
        correct = timingSafeEqual(
          Buffer.from(record.pinHash, 'hex'),
          (await derive(body.pin, record.salt, 32)) as Buffer,
        );
      }
      const status = await db.runTransaction(async (tx) => {
        const data = (await tx.get(ref)).data();
        if (!data || !['active', 'locking'].includes(data.phase) || data.expires <= Date.now()) return 410;
        if (action === 'end' && data.retryAt > Date.now()) return 429;
        if (!correct) {
          const attempts = data.attempts + 1;
          tx.update(ref, { attempts, retryAt: attempts % 5 === 0 ? Date.now() + 60_000 : 0 });
          return 403;
        }
        tx.update(ref, { phase: 'closed', expires: Date.now() });
        return 200;
      });
      const result = json({}, status);
      if (status === 200) setCookie(result, request, false, '');
      return result;
    }
    if (preview) {
      if (
        record.phase !== 'preview' ||
        body.revision !== ref.id ||
        (await owner(app, request)).uid !== record.uid
      )
        return reject(403);
    } else if (record.phase !== 'active') return reject(403);
    let result: Response;
    if (action === 'shelf') {
      const pages = await ref.collection('webDisplayPages').orderBy('__name__').get();
      result = json({
        cards: pages.docs.flatMap((d) => d.get('cards')),
        ratings: record.ratings,
        seconds: record.seconds,
      });
    } else if (action === 'photo' || action === 'preview-photo') {
      const id = preview ? body.photo : url.searchParams.get('photo');
      if (typeof id !== 'string' || !/^[A-Za-z0-9]{20}$/.test(id)) return reject(404);
      const asset = await ref.collection('webDisplayPhotos').doc(id).get();
      if (!asset.exists) return reject(404);
      result = new Response(new Uint8Array(asset.get('pixels')), {
        headers: { ...headers, 'Content-Type': 'image/webp' },
      });
    } else return reject(400);
    const latest = (await ref.get()).data();
    if (!latest || latest.phase !== record.phase || latest.expires <= Date.now()) return reject(410);
    return result;
  } catch (error) {
    return json({}, error instanceof DisplayError ? error.status : 503);
  }
}
