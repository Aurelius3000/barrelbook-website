// Local-only test fixture and service adapter. Never imported by the application.
// This exercises real Auth/Firestore/Storage emulators; it is not a deployment of Cloud Functions.
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = 'demo-barrelbook-web';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9409';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:9480';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9499';
process.env.STORAGE_EMULATOR_HOST = 'http://127.0.0.1:9499';
const app = initializeApp({ projectId, storageBucket: `${projectId}.appspot.com` }, 'local-fixture');
const auth = getAuth(app), db = getFirestore(app), bucket = getStorage(app).bucket();
const accounts = [
  { uid: 'web-qa-alice', email: 'alice@web-test.invalid', displayName: 'Local Collector A', planTier: 'plus', planCycle: 'annual' },
  { uid: 'web-qa-bob', email: 'bob@web-test.invalid', displayName: 'Local Collector B', planTier: 'free', planCycle: 'monthly' },
];
const samples = [
  ['blantons', 'Blanton’s Straight from the Barrel', 'Buffalo Trace', 122.6],
  ['stagg', 'Stagg 24B', 'Buffalo Trace', 132.3],
  ['weller', 'William Larue Weller', 'Buffalo Trace', 125.5],
  ['taylor', 'E.H. Taylor Small Batch', 'Buffalo Trace', 100],
  ['bookers', 'Booker’s', 'Jim Beam', 124.7],
  ['russells', 'Russell’s Reserve 13 Year', 'Wild Turkey', 114.8],
  ['fitzgerald', 'Old Fitzgerald 10 Year', 'Heaven Hill', 100],
  ['elijah', 'Elijah Craig Barrel Proof', 'Heaven Hill', 124.2],
];
if (process.argv.includes('--seed')) {
for (const account of accounts) {
  try { await auth.createUser({ uid: account.uid, email: account.email, password: 'Local-Test-Only-2026!', emailVerified: true }); }
  catch (error) { if (error.code !== 'auth/uid-already-exists' && error.code !== 'auth/email-already-exists') throw error; }
  await db.doc(`users/${account.uid}`).set({ displayName: account.displayName, planTier: account.planTier, planCycle: account.planCycle });
}
try { await auth.createUser({ uid: 'web-qa-no-profile', email: 'unlinked@web-test.invalid', password: 'Local-Test-Only-2026!', emailVerified: true }); }
catch (error) { if (error.code !== 'auth/uid-already-exists' && error.code !== 'auth/email-already-exists') throw error; }
for (const [index, [asset]] of samples.entries()) {
  const bytes = await readFile(new URL(`../../../plans/sprints/2026-10-24-web-collection/prototype/public/bottles/${asset}.png`, import.meta.url));
  if (index === 0) {
    const label = await readFile(new URL('../tests/fixtures/blantons-label.jpg', import.meta.url));
    await bucket.file('users/web-qa-alice/bottles/bottle-000/label.jpg').save(label, { metadata: { contentType: 'image/jpeg' } });
  }
  await bucket.file(`users/web-qa-alice/bottles/bottle-${String(index).padStart(3, '0')}/front.png`).save(bytes, { metadata: { contentType: 'image/png' } });
}
const batch = db.batch();
for (let index = 0; index < 103; index++) {
  const sample = samples[index];
  const id = `bottle-${String(index).padStart(3, '0')}`;
  batch.set(db.doc(`users/web-qa-alice/bottles/${id}`), {
    userId: 'web-qa-alice', name: sample?.[1] || `Local fixture bottle ${index + 1}`, brand: sample?.[2] || 'Local Fixture', release: index === 0 ? 'Straight from the Barrel' : 'Sample release',
    type: sample || index % 2 ? 'Bourbon' : 'Rye',
    isStorePick: index === 0, ...(index === 5 && { ageStatement: '13 years' }),
    proof: sample?.[3] || 100, size: '750 mL', quantity: index === 0 ? 2 : 1, status: index % 4 === 3 ? 'Unopened' : 'Opened', fillLevel: index % 4 === 3 ? 100 : 65 - index % 6 * 5,
    rating: index === 1 ? 5 : index === 2 ? null : index % 3 === 0 ? 4.5 : 4, tags: index === 0 ? ['Store pick', 'Buffalo Trace'] : ['Local test'],
    notes: 'Illustrative local emulator fixture. No live collection was copied.', tastingNotes: 'Nose: caramel and oak.\nPalate: cherry and vanilla.\nFinish: warm spice.',
    ...(index === 0 ? { barrelNumber: '2168', warehouse: 'H', purchasePrice: 150, msrp: 150, secondaryPrice: 195.30 } : {}),
    ...(sample ? { imageURLs: [`gs://${projectId}.appspot.com/users/web-qa-alice/bottles/${id}/front.png`, ...(index === 0 ? [`gs://${projectId}.appspot.com/users/web-qa-alice/bottles/${id}/label.jpg`] : [])], primaryImageIndex: 0 } : {}),
    createdAt: Timestamp.fromDate(new Date('2026-10-24T12:00:00Z')), updatedAt: Timestamp.fromDate(new Date('2026-10-24T12:00:00Z')),
  });
}
batch.set(db.doc('users/web-qa-bob/bottles/private-b'), { userId: 'web-qa-bob', name: 'Collector B private bottle', brand: 'Local Fixture', release: 'Private B', status: 'Unopened', proof: 90, size: '750 mL', quantity: 1, fillLevel: 100 });
await batch.commit();
}

const require = createRequire(import.meta.url);
const { createBottleEditHandlers } = require(new URL('../../../../BarrelBook/functions/bottleEdits.js', import.meta.url).pathname);
const edits = createBottleEditHandlers({ db, auth, Timestamp, FieldValue, requireAppCheckToken: async () => { /* Loopback demo only; live export uses real App Check. */ } });
// Explicit local-only transport fault for browser qualification: commit, then return one gateway failure.
const failFirstEditResponse = process.argv.includes('--fail-first-edit-response');
let failedEditResponse = false;
const origins = new Set(['http://127.0.0.1:4180', 'http://localhost:4180']);
createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && !origins.has(origin)) { res.writeHead(403); res.end(); return; }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Firebase-AppCheck');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  try {
    const endpoint = req.url?.split('/').at(-1);
    if (req.url?.startsWith(`/${projectId}/us-central1/`) && ['getBottleForEdit', 'updateBottleDetails'].includes(endpoint)) {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > 65536) { res.writeHead(413); res.end('{}'); return; } chunks.push(chunk); }
      try { req.body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { res.writeHead(400); res.end('{}'); return; }
      res.status = code => { res.statusCode = code; return res; };
      res.json = body => {
        if (failFirstEditResponse && !failedEditResponse && endpoint === 'updateBottleDetails' && res.statusCode === 200) { failedEditResponse = true; res.statusCode = 503; res.end('{"error":"local-response-failure"}'); return res; }
        res.end(JSON.stringify(body)); return res;
      };
      await edits[endpoint](req, res); return;
    }
    if (req.url === `/${projectId}/us-central1/getCredits` && req.method === 'GET') {
      const bearer = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!bearer) { res.writeHead(401); res.end('{}'); return; }
      const decoded = await auth.verifyIdToken(bearer);
      const profile = await db.doc(`users/${decoded.uid}`).get();
      if (!profile.exists) { res.writeHead(403); res.end('{}'); return; }
      res.end(JSON.stringify({ success: true, plan: { planTier: profile.data().planTier, planCycle: profile.data().planCycle }, balances: {} })); return;
    }
    if (req.url === `/${projectId}/us-central1/sendPasswordResetEmail` && req.method === 'POST') {
      // A local service contract stub: intentionally sends no email.
      res.end(JSON.stringify({ success: true })); return;
    }
    res.writeHead(404); res.end('{}');
  } catch { res.writeHead(401); res.end('{}'); }
}).listen(9501, '127.0.0.1', () => console.log('Local fixture service ready on 127.0.0.1:9501; demo project only.'));
