// Run against the seeded, loopback-only Alice demo; no hosted targets are accepted.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { chromium, devices, webkit } from 'playwright';

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
async function visit(account, options = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', ...options });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  await page.goto(origin);
  await page.getByText('Local test environment', { exact: false }).waitFor();
  await page.getByLabel('Email address').fill(account + '@web-test.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Local-Test-Only-2026!');
  await click(page, 'Log in');
  await page.locator('.library-tile').first().waitFor({timeout:30000});
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
async function reviewBookers(page, device) {
  const phone = device === 'phone';
  const name = 'Booker’s Barry’s Batch';
  const button = (label) => page.getByRole('button', { name: label, exact: true });
  const viewer = page.locator('.d1-viewer');
  const image = viewer.locator('.viewer-viewport img');
  const position = n => viewer.locator('.d1-header [role=status]').filter({ hasText: 'Photo ' + n + ' of 3' }).waitFor();
  const loaded = async () => {
    await image.waitFor();
    await page.waitForFunction(() => document.querySelector('.viewer-viewport img')?.naturalWidth > 0);
    return image.evaluate(img => img.currentSrc);
  };
  const waitZoom = pct => viewer.getByText(pct + '%', { exact: true }).waitFor();
  const open = button('Open bottle details for ' + name);
  const badge = page.getByRole('button',{name:'Collapse issues badge'});
  if (await badge.isVisible()) await badge.click();
  await open.click();
  await page.getByRole('tab', { name: 'Details', selected: true }).waitFor();
  await button('View bottle photos').click();
  await position(1);
  const assertOriginal = async filename => {
    await loaded();
    const expected = createHash('sha256').update(await readFile(new URL('../tests/fixtures/' + filename, import.meta.url))).digest('hex');
    const actual = await image.evaluate(async el => {
      const hash = await crypto.subtle.digest('SHA-256',await (await fetch(el.currentSrc)).arrayBuffer());
      return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2,'0')).join('');
    });
    assert.equal(actual,expected);
  };
  await assertOriginal('bookers-1-front.jpg');
  assert.equal(await image.evaluate(img => getComputedStyle(img).objectFit), 'contain');
  await viewer.getByRole('heading', { name: 'About this bottle' }).waitFor();
  await viewer.getByText('125.7', { exact: true }).waitFor();
  const record = device === 'laptop';
  if (record) await page.screencast.start({ path: resolve(output, 'd1-laptop-walkthrough.webm'), size: await page.viewportSize() });
  const capture = async phase => {
    await page.screenshot({ path: resolve(output, 'd1-' + device + '-' + phase + '.png'), animations: 'disabled' });
    if (record) await pause(1500);
  };
  await capture('front');
  await button('Previous photo').click();
  await position(3);
  await loaded();
  await button('Next photo').click();
  await position(1);
  await page.keyboard.press('ArrowRight');
  await position(2);
  await assertOriginal('bookers-2-batch.jpg');
  await button('Zoom in').click();
  await waitZoom(150);
  await button('Zoom in').click();
  await waitZoom(200);
  const stage = viewer.locator('.viewer-viewport');
  // Bring the red label in the upper third of the original into the viewport.
  await stage.evaluate(el => { el.scrollTop = el.clientHeight * 0.2; });
  await capture('batch');
  for (let i = 0; i < 4; i++) await button('Zoom in').click();
  await waitZoom(400);
  assert.equal(await button('Zoom in').isDisabled(), true);
  await button('Fit to screen').click();
  await waitZoom(100);
  const bounds = await stage.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  if (!phone) {
    await page.mouse.wheel(0,-180);
    await page.waitForFunction(() => document.querySelector('.d1-tool-heading [role=status]')?.textContent !== '100%');
    await page.mouse.down();
    await page.mouse.move(bounds.x + 20,bounds.y + 20,{steps:5});
    await page.mouse.up();
    assert.ok(await stage.evaluate(el => el.scrollTop > 0));
  }
  await button('Show photo 3').click();
  await position(3);
  await waitZoom(100);
  await assertOriginal('bookers-3-back.jpg');
  await capture('back');
  assert.ok(await fits(page));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'View bottle photos');
  await page.getByRole('tab', {name:'Photos (3)'}).click();
  await page.getByRole('button', {name:'Show photo 2', exact:true}).click();
  const enlarge = button('Open photo viewer');
  await enlarge.click();
  await position(2);
  await loaded();
  await button('Close photo viewer').focus();
  await page.keyboard.press('Shift+Tab');
  assert.ok(await viewer.evaluate(el => el.contains(document.activeElement)));
  await page.keyboard.press('Tab');
  assert.equal(await button('Close photo viewer').evaluate(el => el === document.activeElement),true);
  await button('Close photo viewer').click();
  await page.waitForFunction(el => el === document.activeElement,await enlarge.elementHandle());
  await button('Back to collection').click();
  await page.waitForFunction(el => el === document.activeElement,await open.elementHandle());
  if (record) await page.screencast.stop();
  console.log('Booker’s front, batch and back, zoom, wrap, focus and return passed on ' + device);
}


async function checkViewerLayouts(page) {
  const originalSize = await size(page).inputValue();
  const open = page.getByRole('button', {name:'Open bottle details for Booker’s Barry’s Batch'});
  for (const readingSize of ['Standard', 'Large', 'Extra large']) {
    await change(page,readingSize);
    await open.click();
    await click(page,'View bottle photos');
    for (const width of [1440, 1000, 999, 640, 390, 320]) {
      await page.setViewportSize({width,height:width > 999 ? 900 : 844});
      assert.ok(await fits(page));
      const geometry = await page.locator('.d1-viewer').evaluate(el => {
        const bounds = selector => el.querySelector(selector).getBoundingClientRect();
        const stage = bounds('.d1-stage'), tools = bounds('.d1-tools'), panel = bounds('.d1-panel');
        return { width:el.scrollWidth, available:el.clientWidth, side:panel.left >= stage.right - 1,
          below:tools.top >= stage.bottom - 1, target:bounds('.d1-header button').height };
      });
      assert.ok(geometry.width <= geometry.available && geometry.target >= 48);
      assert.ok(width >= 1000 ? geometry.side : geometry.below);
    }
    await click(page,'Close photo viewer');
    await click(page,'Back to collection');
    await page.setViewportSize(viewport);
  }
  await change(page,originalSize);
}

async function checkPhotoStates(page) {
  await click(page,'Open bottle details for Stagg 24B');
  await click(page,'View bottle photos');
  const d1 = page.locator('.d1-viewer');
  assert.equal(await d1.getByRole('group',{name:'All bottle photos'}).count(),0);
  assert.equal(await d1.getByRole('button',{name:'Next photo'}).count(),0);
  await click(page,'Close photo viewer');
  await click(page,'Back to collection');
  const batch = /bookers-2-batch\.jpg.*alt=media/;
  await page.route(batch,route => route.fulfill({status:403,body:'denied'}));
  await click(page,'Open bottle details for Booker’s Barry’s Batch');
  await click(page,'View bottle photos');
  await click(page,'Show photo 2');
  await d1.locator('.viewer-viewport').getByRole('img',{name:'Photo unavailable'}).waitFor();
  await click(page,'Next photo');
  await d1.locator('.viewer-viewport img').waitFor();
  await page.unroute(batch);
  // Render a wide test image through the same blob reader as the portrait originals.
  const wide = await page.evaluate(() => {
    const canvas=document.createElement('canvas'); canvas.width=320; canvas.height=120;
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#d2691e'; ctx.fillRect(0,0,320,120);
    return canvas.toDataURL('image/jpeg').split(',')[1];
  });
  const photoBytes = Buffer.from(wide,'base64');
  const metadata = /bookers-2-batch\.jpg$/;
  await page.route(metadata,async route => {
    const response = await route.fetch();
    await route.fulfill({response,json:{...await response.json(),size:String(photoBytes.length)}});
  });
  await page.route(batch,route => route.fulfill({contentType:'image/jpeg',body:photoBytes}));
  await click(page,'Show photo 2');
  await page.waitForFunction(()=>document.querySelector('.viewer-viewport img')?.naturalWidth === 320);
  assert.equal(await d1.locator('.viewer-viewport img').evaluate(e=>[e.naturalHeight,getComputedStyle(e).objectFit].join('/')),'120/contain');
  await click(page,'Close photo viewer');
  await click(page,'Back to collection');
  await page.unroute(batch);
  await page.unroute(metadata);
}

async function checkPinch(page) {
  await page.setViewportSize({width:390,height:844});
  await click(page,'Open bottle details for Booker’s Barry’s Batch');
  await click(page,'View bottle photos');
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
    const area = await page.locator('.viewer-viewport').boundingBox();
    const x = area.x + area.width/2, y = area.y + area.height/2;
    const points = distance => [{x:x-distance,y,id:0},{x:x+distance,y,id:1}];
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(24)});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(48)});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await page.waitForFunction(()=>parseInt(document.querySelector('.d1-tool-heading [role=status]')?.textContent || '0')>150);
  } finally {
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false});
    await cdp.detach();
  }
  await click(page,'Close photo viewer');
  await click(page,'Back to collection');
  await page.setViewportSize(viewport);
}


try {
  const before = await collectionVersions();
  if (webkitSmoke) {
    const phone = await visit('alice', { ...devices['iPhone 13'], viewport: {width:390,height:844} });
    await reviewBookers(phone, 'phone');
    await phone.context().close();
  }
  const page = await visit('alice');
  if (!webkitSmoke) {
    await reviewBookers(page, 'laptop');
    await checkViewerLayouts(page);
    await checkPinch(page);
    await checkPhotoStates(page);
    console.log('D1 reading sizes, breakpoint checks, landscape photo, denied image, single photo and two-finger pinch passed.');
  }
  // Exercise the thumbnail itself, including the placeholder on bottles without photos.
  for (const view of ['Grid', 'Table']) {
    await click(page, view + ' view');
    for (const name of ['Blanton’s Straight from the Barrel', 'Local fixture bottle 12']) {
      const thumbnail = page.getByRole('button', { name: 'Open bottle details for ' + name, exact: true });
      await thumbnail.scrollIntoViewIfNeeded();
      const scroll = await page.evaluate(() => window.scrollY);
      if (name === 'Blanton’s Straight from the Barrel') await thumbnail.click();
      else await thumbnail.press('Enter');
      const detail = page.getByRole('dialog', { name, exact: true });
      await detail.getByRole('tab', { name: 'Details', selected: true }).waitFor();
      const hero = detail.getByRole('button', { name: 'View bottle photos' });
      if (name === 'Blanton’s Straight from the Barrel') {
        await hero.click();
        await click(page, 'Show photo 2');
        await page.waitForFunction(() => document.querySelector('.viewer-viewport img')?.naturalWidth > 0);
        await click(page, 'Zoom in');
        await page.getByText('150%', { exact: true }).waitFor();
        await click(page, 'Close photo viewer');
        await page.waitForFunction(el => document.activeElement === el, await hero.elementHandle());
      } else {
        assert.equal(await hero.isDisabled(), true);
      }
      await click(page, 'Back to collection');
      await detail.waitFor({ state: 'hidden' });
      await page.waitForFunction(el => document.activeElement === el, await thumbnail.elementHandle());
      assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - scroll) <= 2);
    }
  }
  await click(page, 'Grid view');
  console.log('Alice Grid and Table thumbnails, Details, second photo, zoom, empty photo, focus and scroll passed.');
  if (!webkitSmoke) {
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
    const target = page.getByRole('button', { name: 'Open bottle details for Blanton’s Straight from the Barrel', exact: true });
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
