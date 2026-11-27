import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { createHash } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const origin = 'http://127.0.0.1:' + Number(process.env.BB_LOCAL_WEB_PORT ?? 4185);
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:9480';
const db = getFirestore(initializeApp({ projectId: 'demo-barrelbook-web' }));
const endpoint = origin + '/api/bar-display';
const engine = process.argv.includes('--webkit') ? webkit : chromium;
const browser = await engine.launch();
const ctx = await browser.newContext();
ctx.setDefaultTimeout(18000);
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function login(page, name) {
  await page.goto(origin);
  await page.getByLabel('Email address').fill(name + '@web-test.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Local-Test-Only-2026!');
  await button(page, 'Log in').click();
  await button(page, 'Bar Display').waitFor();
}
async function post(fields) {
  return ctx.request.post(endpoint, { headers: { Origin: origin }, data: fields });
}
async function guestReady() {
  for (let i = 0; i < 100; i++) {
    const r = await ctx.request.get(endpoint);
    if ((await r.json()).mode === 'guest') return;
    await new Promise((done) => setTimeout(done, 150));
  }
  throw new Error('Guest handoff did not finish');
}
try {
  const page = await ctx.newPage(),
    other = await ctx.newPage();
  await login(page, 'alice');
  await login(other, 'alice');
  const bob = await db.doc('users/web-qa-bob/bottles/private-b').get();
  const bottles = db.collection('users/web-qa-alice/bottles');
  const versions = async () => (await bottles.get()).docs.map((d) => [d.id, d.updateTime.toMillis()]);
  const before = await versions();
  assert.equal(before.length, 103);
  await button(page, 'Bar Display').click();
  await page.getByLabel('Shelf', { exact: true }).selectOption('flight');
  assert.ok(await button(page, 'Preview the display').isDisabled());
  const flight = page.getByRole('group', { name: 'Choose flight bottles' });
  for (const box of (await flight.getByRole('checkbox').all()).slice(0, 8)) await box.check();
  await page.getByLabel('Show star ratings').uncheck();
  const previewRoute = async (route) => {
    if (route.request().method() === 'POST' && route.request().postDataJSON()?.action === 'preview-photo')
      return route.fulfill({ status: 503, body: '' });
    await route.continue();
  };
  await page.route('**/api/bar-display', previewRoute);
  await button(page, 'Preview the display').click();
  await page.getByLabel('Set a six-digit display PIN').fill('314159');
  assert.ok(await button(page, 'Start guest display').isDisabled());
  await button(page, 'Change settings').click();
  await page.unroute('**/api/bar-display', previewRoute);
  await button(page, 'Preview the display').click();
  await page.getByLabel('Set a six-digit display PIN').waitFor();
  assert.equal((await ctx.request.get(endpoint + '?shelf')).status(), 403);
  await page.getByLabel('Set a six-digit display PIN').fill('314159');
  await button(page, 'Start guest display').click();
  await guestReady();
  assert.equal(
    await browser.newContext().then(async (blank) => {
      try {
        return (await blank.request.get(endpoint + '?shelf')).status();
      } finally {
        await blank.close();
      }
    }),
    403,
  );
  const shelf = await (await ctx.request.get(endpoint + '?shelf')).json();
  assert.equal(shelf.cards.length, 8);
  await page.getByRole('button', { name: 'Browse shelf', exact: true }).waitFor();
  await button(page, 'Browse shelf').click();
  assert.equal(await page.getByRole('button', { name: 'Five stars', exact: true }).count(), 0);
  await button(page, 'Back to showcase').click();
  assert.equal(shelf.cards[0].name, 'Blanton’s Straight from the Barrel');
  assert.equal(shelf.cards[0].proof, 122.6);
  assert.equal(shelf.cards[0].photos.length, 2);
  for (const card of shelf.cards)
    assert.deepEqual(
      Object.keys(card).sort(),
      ['name', 'brand', 'type', 'proof', 'age', 'status', 'fill', 'pick', 'photos'].sort(),
    );
  assert.ok(!JSON.stringify(shelf).includes(bob.get('name')));
  for (const p of [page, other]) {
    await p.waitForFunction(() => !document.querySelector('.owner-workspace'));
    assert.equal(
      await p.evaluate(() => Object.keys(sessionStorage).some((k) => k.startsWith('firebase:authUser:'))),
      false,
    );
  }
  await other.reload();
  assert.equal(await other.locator('.owner-workspace').count(), 0);
  const photo = endpoint + '?photo=' + shelf.cards[0].photos[0];
  const image = await ctx.request.get(photo);
  assert.equal(image.headers()['content-type'], 'image/webp');
  assert.equal(image.headers()['cache-control'], 'private, no-store, max-age=0');
  assert.ok((await image.body()).length > 1000);
  const cookie = (await ctx.cookies()).find((c) => c.name === 'bb-display-' + new URL(origin).port);
  assert.ok(cookie?.httpOnly);
  const ref = db.collection('webDisplaySessions').doc(createHash('sha256').update(cookie.value).digest('hex'));
  const direct = 'http://127.0.0.1:9480/v1/projects/demo-barrelbook-web/databases/(default)/documents/';
  for (const path of [
    ref.path,
    ref.path + '/webDisplayPages/00000000',
    ref.path + '/webDisplayPhotos/' + shelf.cards[0].photos[0],
    'users/web-qa-alice/bottles/bottle-000',
    'users/web-qa-bob/bottles/private-b',
  ])
    assert.equal((await ctx.request.get(direct + path)).status(), 403);
  const session = (await ref.get()).data();
  assert.ok(session.expires > Date.now() + 8 * 3600000 - 60000 && session.expires <= Date.now() + 8 * 3600000);
  for (let i = 0; i < 5; i++) assert.equal((await post({ action: 'end', pin: '000000' })).status(), 403);
  assert.equal((await post({ action: 'end', pin: '314159' })).status(), 429);
  // Advance only this disposable fixture session to the end of its retry window.
  await ref.update({ retryAt: 0 });
  if (process.argv.includes('--expire')) {
    await page.bringToFront();
    const expires = Date.now() + 1800;
    await ref.update({ expires });
    let delayed = false;
    await page.route('**/api/bar-display', async (route) => {
      if (delayed || route.request().method() !== 'GET') return route.continue();
      delayed = true;
      const reply = await route.fetch();
      assert.equal((await reply.json()).mode, 'guest');
      await new Promise((done) => setTimeout(done, Math.max(0, expires - Date.now()) + 160));
      await route.fulfill({ response: reply });
    });
    await page.evaluate((deadline) => {
      window.guestReappeared = false;
      const observer = new MutationObserver(() => {
        if (
          Date.now() >= deadline &&
          !document.documentElement.hasAttribute('data-display-checking') &&
          document.querySelector('.bar-display')
        )
          window.guestReappeared = true;
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-display-checking'],
      });
      window.dispatchEvent(new Event('focus'));
    }, expires);
    await page.getByLabel('Email address').waitFor();
    assert.ok(delayed);
    assert.equal(await page.evaluate(() => window.guestReappeared), false);
    assert.ok([403, 410].includes((await ctx.request.get(endpoint + '?shelf')).status()));
    assert.ok([403, 410].includes((await ctx.request.get(photo)).status()));
    await page.reload();
  } else if (process.argv.includes('--recover')) {
    await page.bringToFront();
    await button(page, 'Leave Bar Display').click();
    await button(page, 'Forgot PIN?').click();
    const recover = page.getByRole('region', { name: 'Leave Bar Display' });
    for (const name of ['bob', 'alice']) {
      await recover.getByLabel('Email address').fill(name + '@web-test.invalid');
      await recover.getByLabel('Password').fill('Local-Test-Only-2026!');
      await button(page, 'Verify owner').click();
      if (name === 'bob') {
        await recover.getByRole('alert').waitFor();
        assert.equal((await (await ctx.request.get(endpoint)).json()).mode, 'guest');
        assert.equal(
          await page.evaluate(() =>
            Object.keys(sessionStorage).some((k) => k.startsWith('firebase:authUser:')),
          ),
          false,
        );
      }
    }
    await page.getByRole('heading', { name: 'Owner recovery' }).waitFor({ state: 'detached' });
    assert.ok([403, 410].includes((await ctx.request.get(photo)).status()));
  } else {
    assert.equal((await post({ action: 'end', pin: '314159' })).status(), 200);
    assert.equal((await ctx.request.get(photo)).status(), 403);
    await page.reload();
  }
  await page.getByLabel('Email address').waitFor();
  await other.reload();
  await other.getByLabel('Email address').waitFor();
  assert.deepEqual(await versions(), before);
  await login(page, 'bob');
  await button(page, 'Bar Display').click();
  await button(page, 'Preview the display').click();
  await page.getByLabel('Set a six-digit display PIN').waitFor();
  assert.equal(await page.locator('.display-preview li').count(), 1);
  assert.ok((await page.locator('.display-preview li').textContent()).includes(bob.get('name')));
  await button(page, 'Cancel').click();
  console.log(
    engine.name() +
      ' boundary passed: two owner tabs cleared, approved flight and photos only, retry limit, eight-hour limit, sign-in required, bottle versions unchanged.',
  );
} finally {
  await browser.close();
}
