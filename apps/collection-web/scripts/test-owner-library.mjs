// Run against the seeded, loopback-only Alice demo; no hosted targets are accepted.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { chromium, webkit } from 'playwright';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:9480';
const fixtures = getFirestore(initializeApp({ projectId: 'demo-barrelbook-web' }));
async function collectionVersions() {
  const owner = fixtures.doc('users/web-qa-alice');
  const lists = await owner.collection('lists').get();
  const groups = await Promise.all([
    owner.collection('bottles').get(), ...lists.docs.map(list => list.ref.collection('items').get())
  ]);
  return [lists, ...groups].flatMap(snapshot => snapshot.docs.map(doc =>
    [doc.ref.path, doc.updateTime.seconds, doc.updateTime.nanoseconds])).sort();
}
const origin = 'http://127.0.0.1:4180';
const output = resolve(process.env.BB_REVIEW_OUTPUT || '.cache/library-review');
await mkdir(output, { recursive: true });
const webkitSmoke = process.argv.includes('--webkit-smoke');
const browser = await (webkitSmoke ? webkit : chromium).launch();
const viewport = { width: 1280, height: 800 };
const pause = ms => new Promise(done => setTimeout(done, ms));
async function shot(page, name) {
  if (name.startsWith('library-') && name !== 'library-mobile') {
    await page.waitForFunction(() => [...document.querySelectorAll('.library-tile')].slice(0, 3)
      .every(tile => tile.querySelector('img')?.naturalWidth > 0));
  }
  await page.screenshot({ path: resolve(output, name + '.png'), animations: 'disabled' });
}
const click = (page, name) => page.getByRole('button', { name, exact: true }).click();
async function visit(account) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  await page.goto(origin);
  await page.getByText('Local test environment', { exact: false }).waitFor();
  await page.getByLabel('Email address').fill(account + '@web-test.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Local-Test-Only-2026!');
  await click(page, 'Log in');
  await page.locator('.library-tile').first().waitFor();
  return page;
}
const size = page => page.getByLabel('Text size', { exact: true });
const change = async (page, value) => {
  await size(page).selectOption(value);
  await page.waitForFunction(v => {
    const select = document.querySelector('.reading-control select');
    return select?.value === v && !select.disabled && !document.querySelector('.reading-control button');
  }, value);
};
const fits = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
try {
  const before = await collectionVersions();
  const page = await visit('alice');
  if (webkitSmoke) {
    const title = page.getByRole('button', { name: 'Details for Blanton’s Straight from the Barrel' });
    await title.click();
    await click(page, 'View bottle photos');
    await click(page, 'Show photo 2');
    await page.locator('.viewer-viewport img').waitFor();
    await click(page, 'Zoom in');
    await page.getByText('150%', { exact: true }).waitFor();
    await click(page, 'Close photo viewer');
    await click(page, 'Back to collection');
    await title.waitFor();
    console.log('WebKit Alice Library, photo 2, zoom and return passed.');
  } else {
    await page.getByText('Showing 24 of 103 records', { exact: true }).waitFor();
    await change(page, 'Standard');
    await shot(page, 'library-standard');
    await change(page, 'Extra large');
    const independent = await visit('alice');
    await independent.waitForFunction(() => document.querySelector('.reading-control select')?.value === 'Extra large');
    const writePath = '**/google.firestore.v1.Firestore/Write/channel**';
    await independent.route(writePath, route => route.abort('connectionfailed'));
    await size(independent).selectOption('Standard');
    await independent.getByRole('button', { name: 'Retry save' }).waitFor();
    assert.equal(await size(independent).isEnabled(), true);
    await independent.unroute(writePath);
    await click(independent, 'Retry save');
    await independent.waitForFunction(() => !document.querySelector('.reading-control select')?.disabled && !document.querySelector('.reading-control button'));
    await change(independent, 'Extra large');
    await independent.context().close();
    const bob = await visit('bob');
    assert.equal(await size(bob).inputValue(), 'Large');
    await bob.context().close();
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.reading-control select')?.value === 'Extra large');
    await shot(page, 'library-extra-large');
    for (const width of [320, 390, 640, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await fits(page), 'horizontal overflow at ' + width);
      if (width === 390) await shot(page, 'library-mobile');
    }
    await page.setViewportSize(viewport);
    await change(page, 'Large');
    const firstPhoto = page.locator('.tile-photo img').first();
    await firstPhoto.waitFor();
    assert.ok((await firstPhoto.boundingBox()).y < 800);
    const chips = page.getByRole('group', { name: 'Quick filters' });
    for (const chip of ['Bourbon','Rye','Store picks','Unopened','Open','Five stars','All']) {
      await chips.getByRole('button', { name: chip, exact: true }).click();
      assert.ok(await page.locator('.library-tile').count());
    }
    await click(page, 'Show 24 more bottles');
    assert.equal(await page.locator('.library-tile').count(), 48);
    const later = page.locator('.library-tile h2 button').nth(40);
    await later.scrollIntoViewIfNeeded();
    await later.focus();
    const prior = await page.evaluate(() => scrollY);
    await later.press('Enter');
    await page.goBack();
    await page.waitForFunction(() => document.activeElement?.closest('.library-tile h2'));
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - prior) <= 2);
    const search = page.getByRole('textbox', { name: 'Search bottles' });
    await search.fill('Local fixture bottle 103');
    assert.equal(await page.locator('.library-tile').count(), 1);
    await click(page, 'Table view');
    await page.getByRole('table').getByText('Local fixture bottle 103', { exact: true }).waitFor();
    await search.fill('No such fixture');
    await page.getByRole('heading', { name: 'No matching bottles' }).waitFor();
    await search.fill('');
    await click(page, 'Grid view');
    await page.evaluate(() => scrollTo(0, 0));
    await shot(page, 'library-large');
    await page.screencast.start({ path: resolve(output, 'alice-walkthrough.webm'), size: viewport });
    await pause(1500);
    await firstPhoto.scrollIntoViewIfNeeded();
    const target = page.getByRole('button', { name: 'Details for Blanton’s Straight from the Barrel' });
    await target.scrollIntoViewIfNeeded();
    await page.screenshot({ path: resolve(output, 'library-tiles.png'), animations: 'disabled' });
    await pause(1800);
    await target.click();
    await page.locator('.spread-photo img').waitFor();
    await shot(page, 'bottle-detail');
    await pause(2000);
    await click(page, 'View bottle photos');
    await click(page, 'Show photo 2');
    await page.locator('.viewer-viewport img').waitFor();
    await pause(1200);
    await click(page, 'Zoom in');
    await page.getByText('150%', { exact: true }).waitFor();
    await pause(2000);
    await click(page, 'Close photo viewer');
    await click(page, 'Back to collection');
    await target.waitFor();
    await pause(1300);
    await page.screencast.stop();
    await page.setViewportSize({ width: 390, height: 844 });
    await target.click();
    assert.ok(await fits(page));
    await shot(page, 'detail-mobile');
    await click(page, 'Back to collection');
    await page.context().setOffline(true);
    await size(page).selectOption('Standard');
    await page.getByRole('button', { name: 'Retry save' }).waitFor();
    await page.context().setOffline(false);
    await click(page, 'Retry save');
    await page.waitForFunction(() => !document.querySelector('.reading-control select')?.disabled && !document.querySelector('.reading-control button'));
    await change(page, 'Large');
    console.log('Alice Library, detail, zoom, return, sizing, responsive layouts and preference isolation passed.');
  }
  assert.deepEqual(await collectionVersions(), before, 'Browsing changed a bottle or list fixture');
} finally {
  await browser.close();
}
