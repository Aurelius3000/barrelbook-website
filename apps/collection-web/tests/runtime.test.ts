import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/app', async original => ({ ...await original<typeof import('firebase/app')>(), getApps: vi.fn(() => []), initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/auth', async original => ({ ...await original<typeof import('firebase/auth')>(), getAuth: vi.fn(() => ({})), setPersistence: vi.fn(async () => undefined), connectAuthEmulator: vi.fn() }));
vi.mock('firebase/firestore', async original => ({ ...await original<typeof import('firebase/firestore')>(), getFirestore: vi.fn(() => ({})), connectFirestoreEmulator: vi.fn() }));
vi.mock('firebase/storage', async original => ({ ...await original<typeof import('firebase/storage')>(), getStorage: vi.fn(() => ({})), ref: vi.fn(() => ({})), connectStorageEmulator: vi.fn(), getMetadata: vi.fn(), getBlob: vi.fn() }));
vi.mock('firebase/app-check', async original => ({ ...await original<typeof import('firebase/app-check')>(), initializeAppCheck: vi.fn(() => ({})), getToken: vi.fn(async () => ({ token: 'local-unit-token' })) }));

import { getToken, initializeAppCheck } from 'firebase/app-check';
import { setPersistence } from 'firebase/auth';
import { getBlob, getMetadata } from 'firebase/storage';
import { getRuntime, readPhoto, type Runtime } from '../src/lib/firebase';

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.barrelBookWebRuntime = undefined;
  vi.stubGlobal('window', { location: { hostname: 'localhost' } });
  for (const [name, value] of Object.entries({ NODE_ENV: 'development', NEXT_PUBLIC_FIREBASE_API_KEY: 'unit-key', NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'approved.firebaseapp.com', NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'approved', NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'approved.appspot.com', NEXT_PUBLIC_FIREBASE_APP_ID: 'unit-app', NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION: 'us-central1', NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY: 'unit-site', NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'false' })) vi.stubEnv(name, value);
});
afterEach(() => { globalThis.barrelBookWebRuntime = undefined; vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('browser readiness before accepting credentials', () => {
  it('does not expose the runtime until App Check succeeds', async () => {
    let verify!: (value: { token: string }) => void;
    vi.mocked(getToken).mockImplementationOnce(() => new Promise(resolve => { verify = resolve; }));
    const pending = getRuntime();
    expect(setPersistence).not.toHaveBeenCalled();
    verify({ token: 'verified' });
    expect((await pending).config.emulators).toBe(false);
    expect(setPersistence).toHaveBeenCalledOnce();
  });
  it('fails closed on rejected attestation', async () => {
    vi.mocked(getToken).mockRejectedValueOnce(new Error('attestation rejected'));
    await expect(getRuntime()).rejects.toThrow('attestation rejected');
    expect(setPersistence).not.toHaveBeenCalled();
  });
  it('keeps the explicit demo emulator path independent of attestation', async () => {
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'demo-barrelbook-web');
    vi.stubEnv('NEXT_PUBLIC_USE_FIREBASE_EMULATORS', 'true');
    expect((await getRuntime()).appCheck).toBeNull();
    expect(initializeAppCheck).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });
});

describe('authorized photo bytes', () => {
  const runtime = () => ({ auth: { currentUser: { uid: 'alice', isAnonymous: false } }, appCheck: null, storage: {}, config: { emulators: true, firebase: { storageBucket: 'approved.appspot.com' } } }) as unknown as Runtime;
  const metadata = (values: object = {}) => ({ contentType: 'image/png', size: 3, ...values }) as Awaited<ReturnType<typeof getMetadata>>;
  it('restores the validated MIME type dropped by bounded SDK blob slicing', async () => {
    vi.mocked(getMetadata).mockResolvedValueOnce(metadata());
    vi.mocked(getBlob).mockResolvedValueOnce(new Blob(['png']));
    const blob = await readPhoto(runtime(), 'alice', 'users/alice/bottles/b/front.png');
    expect(blob.type).toBe('image/png'); expect(await blob.text()).toBe('png');
  });
  it('rejects another owner before requesting metadata or bytes', async () => {
    await expect(readPhoto(runtime(), 'alice', 'users/bob/bottles/b/front.png')).rejects.toThrow();
    expect(getMetadata).not.toHaveBeenCalled(); expect(getBlob).not.toHaveBeenCalled();
  });
  it('requires the configured App Check runtime outside emulator mode', async () => {
    const client = runtime(); client.config.emulators = false;
    await expect(readPhoto(client, 'alice', 'users/alice/bottles/b/front.png')).rejects.toThrow('verification');
    expect(getMetadata).not.toHaveBeenCalled();
  });
  it('rejects unsafe content types without downloading bytes', async () => {
    vi.mocked(getMetadata).mockResolvedValueOnce(metadata({ contentType: 'image/svg+xml' }));
    await expect(readPhoto(runtime(), 'alice', 'users/alice/bottles/b/front.png')).rejects.toThrow('Unsupported');
    expect(getBlob).not.toHaveBeenCalled();
  });
  it('rejects oversized metadata without downloading bytes', async () => {
    vi.mocked(getMetadata).mockResolvedValueOnce(metadata({ size: 10 * 1024 * 1024 + 1 }));
    await expect(readPhoto(runtime(), 'alice', 'users/alice/bottles/b/front.png')).rejects.toThrow('Unsupported');
    expect(getBlob).not.toHaveBeenCalled();
  });
  it('rejects an account change during metadata retrieval', async () => {
    const client = runtime();
    vi.mocked(getMetadata).mockImplementationOnce(async () => { Object.assign(client.auth, { currentUser: { uid: 'bob' } }); return metadata(); });
    await expect(readPhoto(client, 'alice', 'users/alice/bottles/b/front.png')).rejects.toMatchObject({ code: 'session/account-changed' });
    expect(getBlob).not.toHaveBeenCalled();
  });
  it('does not display a capped or changed image as a complete download', async () => {
    vi.mocked(getMetadata).mockResolvedValueOnce(metadata({ size: 1 }));
    vi.mocked(getBlob).mockResolvedValueOnce(new Blob(['png']));
    await expect(readPhoto(runtime(), 'alice', 'users/alice/bottles/b/front.png')).rejects.toThrow('changed during');
  });
});
