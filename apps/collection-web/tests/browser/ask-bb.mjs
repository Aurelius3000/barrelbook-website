import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const project = 'barrelbook-273cd';
const root = `projects/${project}/databases/(default)/documents`;
const now = '2026-11-11T00:00:00.000Z';
const bottle = 'Synthetic Stagg';
const encode = value => value instanceof Date ? { timestampValue: value.toISOString() }
  : typeof value === 'boolean' ? { booleanValue: value }
  : typeof value === 'number' ? { doubleValue: value }
    : Array.isArray(value) ? { arrayValue: { values: value.map(encode) } }
      : typeof value === 'object' ? { mapValue: { fields: firestoreFields(value) } }
        : { stringValue: value };
const firestoreFields = object => Object.fromEntries(Object.entries(object).map(([key, value]) => [key, encode(value)]));
const photo = 'gs://barrelbook-273cd.appspot.com/users/alice/bottles/owned/';
const records = new Map([
  ['config/feature_flags', { sommelier_enabled: true, ask_your_shelf_enabled: false, ask_your_shelf_beta_enabled: true, lists_enabled: true }],
  ['users/alice', { userId: 'alice', displayName: 'Synthetic Alice', planTier: 'pro' }],
  ['users/empty', { userId: 'empty', displayName: 'Empty shelf', planTier: 'free' }],
  ['users/bob', { userId: 'bob', displayName: 'Synthetic Bob', planTier: 'free' }],
  ['users/alice/bottles/owned', { userId: 'alice', name: bottle, brand: 'Fixture', status: 'Opened', proof: 125, imageURLs: [photo + 'front.png', photo + 'back.png'] }],
  ['users/alice/bottles/wrong-owner', { userId: 'bob', name: 'Other owner', status: 'Archived' }],
  ['users/bob/bottles/bobs-bottle', { userId: 'bob', name: 'Bob only', status: 'Opened' }],
  ['users/alice/lists/want', { userId: 'alice', name: 'Want fixture', type: 'want', itemCount: 1, createdAt: new Date(now), updatedAt: new Date(now) }],
  ['users/alice/lists/tried', { userId: 'alice', name: 'Tried fixture', type: 'tried', itemCount: 1, createdAt: new Date(now), updatedAt: new Date(now) }],
  ['users/alice/lists/want/items/a', { userId: 'alice', listId: 'want', displayName: 'Wanted Stagg', linkedBottleId: 'owned', createdAt: new Date(now), updatedAt: new Date(now) }],
  ['users/alice/lists/tried/items/b', { userId: 'alice', listId: 'tried', displayName: 'Tried Stagg', linkedBottleId: 'owned', createdAt: new Date(now), updatedAt: new Date(now) }]
]);
const token = uid => [
  Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url'),
  Buffer.from(JSON.stringify({ sub: uid, user_id: uid, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600, firebase: { sign_in_provider: 'password' } })).toString('base64url'),
  'synthetic'
].join('.');

const privacy = () => ({ success: true, data: {
  capability: 'ask-bb-privacy-v2',
  supportedVersions: { aiDisclosure: 'ask-bb-ai-processing-v1', providerList: 'openai-2026-08-01', terms: '2026-08-01' },
  aiProcessing: { status: 'active', disclosureVersion: 'ask-bb-ai-processing-v1', providerListVersion: 'openai-2026-08-01', decidedAt: now },
  terms: { accepted: true, version: '2026-08-01', acceptedAt: now },
  improvement: { eligible: false, status: 'revoked' }
} });
const reference = (id, title, scope = 'ownedCollection') => ({ id, title, scope });
const reply = (answer, bottleRefs = []) => ({ success: true, data: { answer, bottleRefs } });

function firestoreResults(target) {
  const docs = target.documents?.documents?.map(path => path.slice(root.length + 1));
  const base = target.query?.parent?.slice(root.length + 1);
  const collection = target.query?.structuredQuery?.from?.[0]?.collectionId;
  const prefix = base != null && collection ? `${base}/${collection}/` : null;
  return [...records].filter(([path]) => docs ? docs.includes(path) :
    prefix && path.startsWith(prefix) && !path.endsWith('/wrong-owner') && !path.slice(prefix.length).includes('/'))
    .map(([path, value]) => ({
      documentChange: { document: { name: `${root}/${path}`, fields: firestoreFields(value), createTime: now, updateTime: now }, targetIds: [target.targetId] }
    }));
}

export async function testAskBBBrowser({ browser, origin, output, capture }) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 },
    ...(process.argv.includes('--record') && { recordVideo: { dir: output, size: { width: 1200, height: 900 } } }) });
  const page = await context.newPage();
  page.setDefaultTimeout(12_000);
  const image = await readFile(new URL('../../../../plans/sprints/2026-10-24-web-collection/prototype/public/bottles/stagg.png', import.meta.url));
  let uid = 'alice', consent = 'active', terms = true, admitted = true;
  let mode = 'success', lastHeld, released;
  let nextChannel = 0;
  const turns = [], unexpected = [], writes = [], browserErrors = [], traffic = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) browserErrors.push(message.text()); });
  const cors = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-expose-headers': 'X-HTTP-Session-Id', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin) traffic.push(request.method() + ' ' + url.hostname + url.pathname);
    const send = (status, json) => route.fulfill({ status, json, headers: cors });
    if (url.origin === origin && url.pathname !== '/api/pilot-access') return route.continue();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...cors, 'access-control-allow-headers': request.headers()['access-control-request-headers'] || '*' } });
    if (url.pathname === '/api/pilot-access') return route.fulfill({ status: admitted ? 204 : 403 });
    if (url.hostname === 'www.google.com' && url.pathname === '/images/cleardot.gif') return route.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') });
    if (url.hostname === 'www.google.com' && url.pathname.includes('recaptcha')) {
      return route.fulfill({ contentType: 'application/javascript',
        body: 'let complete; window.grecaptcha = { enterprise: { ready: cb => cb(), render: (_, options) => { complete = options.callback; return 1; }, execute: () => { complete(); return Promise.resolve("synthetic-recaptcha"); } } };' });
    }
    if (['firebaseappcheck.googleapis.com', 'content-firebaseappcheck.googleapis.com'].includes(url.hostname)) return send(200, { token: 'synthetic-appcheck', ttl: '3600s' });
    if (url.hostname === 'identitytoolkit.googleapis.com') {
      if (url.pathname.endsWith(':signInWithPassword')) {
        uid = request.postDataJSON().email.split('@')[0];
        return send(200, { localId: uid, email: `${uid}@synthetic.invalid`, idToken: token(uid), refreshToken: 'synthetic-refresh', expiresIn: '3600' });
      }
      if (url.pathname.endsWith(':lookup')) return send(200, { users: [{ localId: uid, email: `${uid}@synthetic.invalid`, emailVerified: true, providerUserInfo: [{ providerId: 'password', rawId: `${uid}@synthetic.invalid` }] }] });
    }
    if (url.hostname === 'firestore.googleapis.com' && url.pathname.endsWith('/Listen/channel')) {
      const params = new URLSearchParams(request.postData() || '');
      const add = [...params.entries()].map(([, value]) => {
        try { return JSON.parse(value).addTarget; } catch { return null; }
      }).find(Boolean);
      if (!add) return route.fulfill({ status: 200, body: '4\n[[]]', headers: cors });
      const messages = [
        [0, ['c', `session-${++nextChannel}`, '', 8, 12, 30000]],
        [1, [{ targetChange: { targetChangeType: 'ADD', targetIds: [add.targetId] } }]],
        ...firestoreResults(add).map((result, index) => [index + 2, [result]])
      ];
      messages.push([messages.length, [{ targetChange: { targetChangeType: 'CURRENT', targetIds: [add.targetId], readTime: now } }]]);
      messages.push([messages.length, [{ targetChange: { readTime: now, resumeToken: 'AA==' } }]]);
      const body = JSON.stringify(messages);
      return route.fulfill({ status: 200, body: `${body.length}\n${body}`, headers: { ...cors, 'x-http-session-id': 'synthetic-session' } });
    }
    if (url.hostname === 'firebasestorage.googleapis.com') {
      if (url.searchParams.get('alt') === 'media') return route.fulfill({ status: 200, body: image, contentType: 'image/png', headers: cors });
      return send(200, { bucket: 'barrelbook-273cd.appspot.com', name: decodeURIComponent(url.pathname.split('/o/')[1]), size: String(image.length), contentType: 'image/png', generation: '1' });
    }
    if (url.hostname.endsWith('.cloudfunctions.net')) {
      if (url.pathname === '/getCredits') return send(200, { success: true, plan: { planTier: 'pro', planCycle: 'annual' }, balances: {} });
      if (url.pathname === '/getAskBBPrivacyStatus') {
        const result = privacy();
        result.data.aiProcessing.status = consent;
        result.data.terms.accepted = terms;
        return send(200, result);
      }
      if (url.pathname === '/askBBTurn') {
        const body = request.postDataJSON();
        turns.push(body);
        if (mode === 'limited') return send(429, { code: 'rate_limit' });
        if (mode === 'timeout') return send(504, {});
        if (mode === 'malformed') return send(200, { success: true, data: { answer: null } });
        if (mode === 'denied') return send(403, {});
        if (mode === 'held') {
          lastHeld?.();
          await new Promise(resolve => { released = resolve; });
          return send(200, reply('Late private answer')).catch(() => {});
        }
        if (/archive/i.test(body.message)) return send(200, reply('Ask B.B. is read-only. Change bottle details in the iPhone app.'));
        if (body.history.length > 0) return send(200, reply('Follow-up: try a lower proof bottle.'));
        return send(200, reply('Try Synthetic Stagg. <img src=x onerror=alert(1)> [unsafe](javascript:alert(1))', [
          reference('owned', bottle),
          reference('missing', 'Missing bottle'),
          reference('wrong-owner', 'Wrong owner bottle'),
          reference('friends', 'Shared shelf bottle', 'sharedShelves')
        ]));
      }
      if (/update|delete|edit|commit|write/i.test(url.pathname)) writes.push(url.pathname);
    }
    unexpected.push(url.hostname + url.pathname);
    return route.abort();
  });

  const click = name => page.getByRole('button', { name, exact: true }).click();
  const waitText = text => page.getByText(text, { exact: false }).filter({ visible: true }).first().waitFor({ timeout: 12_000 });
  const draft = page.getByRole('textbox', { name: 'Your question' });
  const grid = page.locator('[aria-label="Collection grid"]');
  const table = page.getByRole('table');
  const bottleDetails = page.getByRole('dialog', { name: bottle });
  const signIn = async (account = 'alice') => {
    await page.getByRole('textbox', { name: 'Email address' }).fill(`${account}@synthetic.invalid`);
    await page.getByLabel('Password', { exact: true }).fill('fixture-only-password');
    await click('Log in');
    await page.getByRole('button', { name: 'Sign out' }).waitFor({ timeout: 12_000 });
  };
  const submit = async (question, button = 'Send') => { await draft.fill(question); await click(button); };
  try {
    await page.goto(origin);
    await page.getByRole('button', { name: 'Log in' }).waitFor({ timeout: 12_000 });
    assert.equal(await page.getByRole('button', { name: 'Ask B.B.', exact: true }).count(), 0);
    await signIn();
    await grid.waitFor();
    await click(`Details for ${bottle}`);
    await bottleDetails.waitFor();
    await click('Close bottle details');
    await bottleDetails.waitFor({ state: 'hidden' });
    await grid.waitFor();
    await click('Ask B.B.');
    await page.getByRole('button', { name: /Which opened bottle/ }).waitFor();
    await page.getByRole('button', { name: /Which opened bottle/ }).click();
    assert.ok((await draft.inputValue()).startsWith('Which opened bottle'));
    await click('Send');
    await waitText('Try Synthetic Stagg.');
    assert.equal(turns.length, 1);
    assert.deepEqual(turns[0].retrievalScopes, ['ownedCollection']);
    assert.equal(turns[0].memoryMode, 'none');
    assert.equal(await page.locator('.ask-bb-reply img, .ask-bb-reply a, .ask-bb-reply script').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Shared shelf bottle' }).count(), 0);
    await click('Missing bottle');
    await waitText('This bottle is unavailable');
    await click('Wrong owner bottle');
    await waitText('This bottle is unavailable');
    await draft.fill('A draft stays in the conversation');
    const trigger = page.getByRole('button', { name: bottle, exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const beforeBottle = await page.evaluate(() => window.scrollY);
    await trigger.focus();
    await trigger.press('Enter');
    await page.getByRole('dialog', { name: bottle }).waitFor();
    await click('View bottle photos');
    await page.getByRole('group', { name: 'All bottle photos' }).waitFor();
    await click('Show photo 2');
    await page.waitForFunction(() => [...document.querySelectorAll('.viewer-viewport img')].some(image => image.complete && image.naturalWidth > 0));
    await click('Zoom in');
    await waitText('150%');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await trigger.waitFor();
    await page.waitForFunction(() => document.activeElement?.textContent?.includes('Synthetic Stagg'));
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - beforeBottle) <= 2);
    assert.equal(await draft.inputValue(), 'A draft stays in the conversation');
    await click('Collection');
    await click('Table view');
    await table.waitFor();
    await table.getByRole('button', { name: bottle, exact: true }).click();
    await bottleDetails.waitFor();
    await click('Close bottle details');
    await bottleDetails.waitFor({ state: 'hidden' });
    await table.waitFor();
    await click('Grid view');
    await grid.waitFor();
    await page.getByRole('textbox', { name: 'Search bottles' }).fill('Stagg');
    await waitText(bottle);
    await page.getByRole('textbox', { name: 'Search bottles' }).fill('');
    await click('Table view');
    await table.waitFor();
    await click('Lists');
    await waitText('Want fixture');
    await waitText('Tried fixture');
    await page.getByRole('button', { name: /Want fixture/ }).click();
    await waitText('Wanted Stagg');
    await page.getByRole('button', { name: /Open in Collection: Wanted Stagg/i }).click();
    await page.getByRole('dialog', { name: bottle }).waitFor();
    await page.keyboard.press('Escape');
    await page.goBack();
    await page.getByRole('button', { name: /Tried fixture/ }).click();
    await waitText('Tried Stagg');
    await page.getByRole('button', { name: 'Open in Collection: Tried Stagg' }).click();
    await page.getByRole('dialog', { name: bottle }).waitFor();
    await page.keyboard.press('Escape');
    await click('Ask B.B.');
    assert.equal(await draft.inputValue(), 'A draft stays in the conversation');
    await submit('Which is lower proof?');
    await waitText('Follow-up: try a lower proof bottle.');
    assert.equal(turns.length, 2);
    assert.equal(turns[1].history.length, 2);
    assert.equal(turns[1].conversationId, turns[0].conversationId);

    await page.screenshot({ path: output + 'ask-bb-desktop.png', fullPage: true });
    if (capture) {
      await capture(page, output + 'encoder-fixture-' + Date.now() + '.mp4', async () => {
        await draft.fill('Synthetic encoder verification');
        await draft.clear();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }, { minimumSeconds: 2 });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => innerWidth === 390 && scrollY === 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: output + 'ask-bb-mobile.png' });
    await submit('Please archive that bottle.');
    await waitText('Ask B.B. is read-only.');
    assert.deepEqual(writes, []);
    const persisted = await page.evaluate(() => JSON.stringify({
      local: { ...localStorage }, session: { ...sessionStorage }, state: history.state, url: location.href
    }));
    for (const phrase of ['Which is lower proof?', 'Try Synthetic Stagg', 'Please archive that bottle.']) {
      assert.ok(!persisted.includes(phrase), 'Conversation content must stay in memory');
    }

    for (const [status, message] of [
      ['limited', 'You’ve reached your Ask B.B. limit'],
      ['timeout', 'Ask B.B. took too long'],
      ['malformed', 'Ask B.B. returned a response we couldn’t read']
    ]) {
      mode = status;
      if (status === 'limited') await submit('Retained draft');
      else await click('Retry');
      await waitText(message);
      assert.equal(await draft.inputValue(), 'Retained draft');
    }
    await context.setOffline(true);
    await waitText('You’re offline');
    assert.ok(await page.getByRole('button', { name: 'Retry' }).isDisabled());
    await context.setOffline(false);
    mode = 'denied';
    await click('Retry');
    await waitText('Ask B.B. isn’t available for this account');
    assert.equal(await draft.inputValue(), 'Retained draft');
    mode = 'success';
    consent = 'revoked';
    await click('Recheck access');
    await waitText('review AI processing consent');
    assert.ok(await draft.isDisabled());
    const gatedCount = turns.length;
    consent = 'active';
    terms = false;
    await click('Recheck access');
    await waitText('Review the current Ask B.B. Terms');
    assert.ok(await draft.isDisabled());
    assert.equal(turns.length, gatedCount);
    terms = true;
    await click('Recheck access');
    await draft.waitFor();
    await click('New conversation');
    assert.equal(await draft.inputValue(), '');
    assert.equal(await page.locator('.ask-bb-exchange').count(), 0);

    await submit('Refresh removes this conversation');
    await waitText('Try Synthetic Stagg.');
    await page.reload();
    await page.getByRole('button', { name: 'Sign out' }).waitFor();
    await grid.waitFor();
    await click('Ask B.B.');
    await page.getByRole('button', { name: /Which opened bottle/ }).waitFor();
    assert.equal(await page.locator('.ask-bb-exchange').count(), 0);
    mode = 'held';
    const held = new Promise(resolve => { lastHeld = resolve; });
    await submit('Private draft in flight');
    await held;
    await waitText('Ask B.B. is thinking');
    assert.ok(await page.getByRole('button', { name: 'Send' }).isDisabled());
    admitted = false;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await waitText('Let’s connect the right account.');
    released?.();
    assert.equal(await page.getByText('Late private answer').count(), 0);
    assert.equal(await draft.count(), 0);
    mode = 'success';
    await click('Back to log in');
    await page.getByRole('textbox', { name: 'Email address' }).fill('bob@synthetic.invalid');
    await page.getByLabel('Password', { exact: true }).fill('fixture-only-password');
    await click('Log in');
    await waitText('This account doesn’t have access');
    assert.equal(await draft.count(), 0);
    admitted = true;
    await click('Back to log in');
    await signIn('bob');
    await waitText('Bob only');
    await click('Ask B.B.');
    await waitText('Ask B.B. isn’t available for this account');
    assert.equal(await draft.inputValue(), '');
    assert.ok(await draft.isDisabled());
    assert.equal(await page.getByText('Private draft in flight').count(), 0);
    await click('Sign out');
    await signIn('empty');
    await page.getByRole('heading', { name: 'Your collection starts in the app.' }).waitFor();
    await waitText('Showing 0 of 0 records');
    await click('Sign out');
    await page.getByRole('button', { name: 'Log in' }).waitFor();
    assert.equal(await page.getByRole('log', { name: 'Conversation' }).count(), 0);
    assert.deepEqual(unexpected, []);
    console.log('Ask B.B. synthetic browser acceptance passed.');
  } catch (error) {
    console.error('Unexpected browser requests:', unexpected, 'Browser errors:', browserErrors.slice(-12), 'Traffic:', traffic.slice(0, 25));
    await page.screenshot({ path: output + 'ask-bb-failure.png', fullPage: true }).catch(() => {});
    throw error;
  } finally {
    released?.();
    await context.close();
  }
}
