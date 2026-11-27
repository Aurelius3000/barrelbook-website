import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc, writeBatch } from 'firebase/firestore';
import type { Runtime } from '../src/lib/firebase';
import { displayedItemCount, readListItems, readLists } from '../src/lib/lists';

let env: RulesTestEnvironment;
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-barrelbook-web',
    firestore: { host: '127.0.0.1', port: 9480, rules: await readFile('tests/fixtures/firestore.rules', 'utf8') },
    storage: { host: '127.0.0.1', port: 9499, rules: await readFile('tests/fixtures/storage.rules', 'utf8') },
  });
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'rules-alice'), { displayName: 'Local A', planTier: 'free', planCycle: 'monthly' });
    await setDoc(doc(db, 'users', 'rules-alice', 'bottles', 'one'), { userId: 'rules-alice', name: 'Private A' });
    await setDoc(doc(db, 'users', 'rules-bob', 'bottles', 'one'), { userId: 'rules-bob', name: 'Private B' });
    await setDoc(doc(db, 'config', 'feature_flags'), { lists_enabled: true });
    const batch = writeBatch(db);
    const userId = 'rules-alice', listId = 'want';
    const createdAt = Timestamp.fromMillis(1), updatedAt = Timestamp.fromMillis(2);
    batch.set(doc(db, 'users', userId, 'lists', listId), { userId, name: 'Private Want', type: 'want', itemCount: 500, createdAt, updatedAt });
    for (let index = 0; index < 103; index++) {
      const id = String(index).padStart(3, '0');
      batch.set(doc(db, 'users', userId, 'lists', listId, 'items', id), {
        userId, listId, displayName: `Private item ${id}`, createdAt, updatedAt, sortOrder: 102 - index,
      });
    }
    await batch.commit();
    await context.storage().ref('users/rules-alice/bottles/one/photo.png').putString('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64', { contentType: 'image/png' });
  });
}, 30000);
afterAll(async () => { await env?.cleanup(); });

describe('canonical owner rules against local emulators', () => {
  it('lets an authenticated owner read the existing bottle', async () => { const db = env.authenticatedContext('rules-alice').firestore(); const snap = await assertSucceeds(getDoc(doc(db, 'users', 'rules-alice', 'bottles', 'one'))); expect(snap.data()?.name).toBe('Private A'); });
  it('rejects a different account reading that bottle', async () => { const db = env.authenticatedContext('rules-bob').firestore(); await assertFails(getDoc(doc(db, 'users', 'rules-alice', 'bottles', 'one'))); });
  it('rejects signed-out bottle reads', async () => { await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users', 'rules-alice', 'bottles', 'one'))); });
  it('does not let the client upgrade its own plan', async () => { await assertFails(updateDoc(doc(env.authenticatedContext('rules-alice').firestore(), 'users', 'rules-alice'), { planTier: 'pro' })); });
  it('permits owner photo metadata and download URL', async () => { const photo = env.authenticatedContext('rules-alice').storage().ref('users/rules-alice/bottles/one/photo.png'); await assertSucceeds(photo.getMetadata()); await assertSucceeds(photo.getDownloadURL()); });
  it('rejects a different account requesting that photo', async () => { await assertFails(env.authenticatedContext('rules-bob').storage().ref('users/rules-alice/bottles/one/photo.png').getMetadata()); });
  it('rejects signed-out photo access', async () => { await assertFails(env.unauthenticatedContext().storage().ref('users/rules-alice/bottles/one/photo.png').getDownloadURL()); });
});


describe('private Lists reads against local emulators', () => {
  it('loads the owner’s full list across pages and reconciles the count without a write', async () => {
    const uid = 'rules-alice';
    const db = env.authenticatedContext(uid).firestore();
    const runtime = { db, auth: { currentUser: { uid, isAnonymous: false } } } as unknown as Runtime;
    const signal = new AbortController().signal;
    const lists = await readLists(runtime, uid, signal);
    expect(lists?.records.map(list => list.name)).toEqual(['Private Want']);
    const list = lists!.records[0];
    const items = await readListItems(runtime, uid, list, signal);
    expect(items.partial).toBe(false);
    expect(items.records[0].id).toBe('102');
    expect(items.records.at(-1)?.id).toBe('000');
    expect(displayedItemCount(list, items)).toBe(103);
    expect((await getDoc(doc(db, 'users', uid, 'lists', 'want'))).data()?.itemCount).toBe(500);
  });

  it.each(['other account', 'signed out'])('denies %s list and item queries and direct reads', async visitor => {
    const db = (visitor === 'signed out' ? env.unauthenticatedContext() : env.authenticatedContext('rules-bob')).firestore();
    await assertFails(getDocs(collection(db, 'users', 'rules-alice', 'lists')));
    await assertFails(getDoc(doc(db, 'users', 'rules-alice', 'lists', 'want')));
    await assertFails(getDocs(collection(db, 'users', 'rules-alice', 'lists', 'want', 'items')));
    await assertFails(getDoc(doc(db, 'users', 'rules-alice', 'lists', 'want', 'items', '000')));
  });
});

describe('owner reading preference', () => {
  const path = ['users', 'rules-alice', 'webPreferences', 'reading'] as const;
  it('persists only a known size and keeps existing bottle fields intact', async () => {
    const db = env.authenticatedContext('rules-alice').firestore();
    const pref = doc(db, ...path);
    const bottle = doc(db, 'users', 'rules-alice', 'bottles', 'one');
    const before = (await getDoc(bottle)).data();
    for (const textSize of ['Standard', 'Extra large', 'Large']) {
      await assertSucceeds(setDoc(pref, { textSize }));
      expect((await assertSucceeds(getDoc(pref))).data()).toEqual({ textSize });
    }
    for (const invalid of [{}, { textSize: false }, { textSize: 'X' }, { textSize: 'Large', planTier: 'pro' }]) {
      await assertFails(setDoc(pref, invalid));
    }
    await assertFails(setDoc(doc(db, 'users', 'rules-alice', 'webPreferences', 'other'), { textSize: 'Large' }));
    expect((await getDoc(bottle)).data()).toEqual(before);
  });
  it('rejects another owner, a guest and a signed-out visitor', async () => {
    for (const visitor of [env.authenticatedContext('rules-bob'), env.unauthenticatedContext(),
      env.authenticatedContext('rules-alice', { firebase: { sign_in_provider: 'anonymous', identities: {} } })]) {
      const ref = doc(visitor.firestore(), ...path);
      await assertFails(getDoc(ref));
      await assertFails(setDoc(ref, { textSize: 'Standard' }));
    }
  });
});
