// Run only against the seeded, loopback Alice collection and its display-enabled web app.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, webkit } from 'playwright';

const engine = process.argv.includes('--webkit') ? webkit : chromium;
const reduced = engine === webkit;
const origin = 'http://127.0.0.1:' + Number(process.env.BB_LOCAL_WEB_PORT ?? 4185);
const output = resolve(process.env.BB_REVIEW_OUTPUT || '.cache/bar-display', engine.name());
await mkdir(output, { recursive: true });
const browser = await engine.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  reducedMotion: reduced ? 'reduce' : 'no-preference',
});
const page = await ctx.newPage();
page.setDefaultTimeout(15000);
const button = (name) => page.getByRole('button', { name, exact: true });
const hero = page.getByRole('region', { name: 'Bottle showcase' });
const heading = (name) => hero.getByRole('heading', { name, exact: true });
const shot = (name) => page.screenshot({ path: resolve(output, name + '.png') });
async function assertFittedPhoto() {
  const image = page.locator('.viewer-canvas img');
  await image.evaluate((img) => img.decode());
  const fit = await image.evaluate((img) => {
    const stage = img.closest('.viewer-viewport'),
      box = img.getBoundingClientRect(),
      bounds = stage.getBoundingClientRect();
    return (
      getComputedStyle(img).objectFit === 'contain' &&
      img.naturalHeight > 0 &&
      box.height > 100 &&
      Math.abs(box.width - stage.clientWidth) <= 2 &&
      Math.abs(box.height - stage.clientHeight) <= 2 &&
      Math.abs(box.top - bounds.top) <= 2 &&
      Math.abs(box.left - bounds.left) <= 2 &&
      stage.scrollHeight <= stage.clientHeight + 2 &&
      stage.scrollWidth <= stage.clientWidth + 2
    );
  });
  assert.ok(fit, 'Fit must center the complete photograph inside the visible stage');
}
let checkTraffic = false;
const privateRequests = [];
page.on('request', (r) => {
  if (
    checkTraffic &&
    (/firestore|:9480|:9499|\/api\/pilot-access/.test(r.url()) ||
      (r.method() !== 'GET' && r.url().includes('/api/bar-display')))
  )
    privateRequests.push(new URL(r.url()).pathname);
});
try {
  await page.goto(origin);
  await page.getByLabel('Email address').fill('alice@web-test.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Local-Test-Only-2026!');
  await button('Log in').click();
  await button('Bar Display').click();
  const picker = page.getByLabel('Shelf', { exact: true });
  await page.setViewportSize({ width: 474, height: 748 });
  const setup = page.getByRole('dialog', { name: 'Start Bar Display' });
  assert.ok(await setup.evaluate((el) => el.scrollWidth <= el.clientWidth + 1));
  await shot('setup-narrow');
  const interval = page.getByRole('radio', { name: '12 sec', exact: true });
  await interval.focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await page.getByRole('radio', { name: '30 sec', exact: true }).isChecked());
  await page.keyboard.press('ArrowLeft');
  assert.ok(await interval.isChecked());
  await page.setViewportSize({ width: 1920, height: 1080 });
  await setup.screenshot({ path: resolve(output, 'setup.png') });
  await picker.selectOption('open');
  await page.getByText('78 eligible bottles').waitFor();
  await page.getByLabel('Include bottle photos').uncheck();
  await button('Preview the display').click();
  await page.getByText('78 bottles · 12 seconds per bottle · 8-hour session').waitFor();
  assert.equal(await page.locator('.display-preview li').count(), 78);
  assert.ok(
    (await page.locator('.display-preview li').allTextContents()).every(
      (line) => line.includes('Opened') && !line.includes('Unopened'),
    ),
  );
  await button('Change settings').click();
  await page.getByLabel('Include bottle photos').check();
  await picker.selectOption('whole');
  await page.getByText('103 eligible bottles').waitFor();
  await page.getByLabel('Show estimated bottle value').check();
  await button('Preview the display').click();
  await page.getByLabel('Set a six-digit display PIN').fill('314159');
  await button('Start guest display').click();
  const blantons = 'Blanton’s Straight from the Barrel',
    bookers = 'Booker’s Barry’s Batch',
    stagg = 'Stagg 24B';
  await heading(blantons).waitFor();
  checkTraffic = true;
  assert.equal(await hero.getByText('$195.30', { exact: true }).count(), 1);
  assert.equal(await hero.getByText('122.6', { exact: true }).count(), 1);
  assert.equal(
    await page.getByRole('navigation', { name: 'Showcase bottles' }).locator('[aria-pressed]').count(),
    6,
  );
  // Start a new interval after installing the deterministic browser clock.
  await page.clock.install();
  if (!reduced) await button('Pause').click();
  await button('Resume').click();
  await page.clock.fastForward(12001);
  await heading(stagg).waitFor();
  await page.clock.fastForward(12001);
  const weller = 'William Larue Weller';
  await heading(weller).waitFor();
  await button('Pause on ' + weller).click();
  await page.clock.fastForward(24001);
  await heading(weller).waitFor();
  await button('Resume').waitFor();
  assert.equal(await page.locator('.d1-viewer').count(), 0);
  await button('Bottle details').click();
  const facts = page.getByRole('dialog', { name: 'Bottle facts' });
  await facts.getByText('125.5', { exact: true }).waitFor();
  await facts.getByText('55% full').waitFor();
  await page.keyboard.press('Escape');
  await button('Enlarge photo').click();
  const photos = page.locator('.d1-viewer');
  await photos.getByRole('heading', { name: weller }).waitFor();
  assert.equal(await photos.getByText(/Photo 1 of 1/).count(), 0);
  await assertFittedPhoto();
  await shot('weller-fit');
  await button('Zoom in').click();
  await photos.getByText('150%', { exact: true }).waitFor();
  await button('Fit to screen').click();
  await assertFittedPhoto();
  await button('Close photo viewer').click();
  await heading(weller).waitFor();
  assert.ok(await button('Enlarge photo').evaluate((el) => el === document.activeElement));
  await button('Show ' + bookers).click();
  await button('Resume').click();
  await button('Enlarge photo').press('Enter');
  await photos.getByText('Photo 1 of 3', { exact: false }).waitFor();
  await assertFittedPhoto();
  await page.keyboard.press('ArrowRight');
  await photos.getByText('Photo 2 of 3', { exact: true }).waitFor();
  await assertFittedPhoto();
  await button('Zoom in').click();
  await photos.getByText('150%', { exact: true }).waitFor();
  await shot('bookers-batch');
  await page.keyboard.press('Escape');
  await page.clock.fastForward(24001);
  await heading(bookers).waitFor();
  await button('Resume').waitFor();
  await button('Bottle details').click();
  await facts.getByText('7 years, 2 months, 4 days', { exact: true }).waitFor();
  await facts.getByText('125.7', { exact: true }).waitFor();
  await facts.getByText('2025-01 · Barry’s Batch', { exact: true }).waitFor();
  await facts.getByText('750 mL', { exact: true }).waitFor();
  await shot('bookers-details');
  await page.keyboard.press('Escape');
  await button('Show ' + blantons).click();
  await page.clock.fastForward(30000);
  await heading(blantons).waitFor();
  await shot('showcase');
  await button('Browse shelf').click();
  const tiles = page.locator('.bar-tile');
  assert.equal(await tiles.count(), 10);
  await shot('browse-desktop');
  for (let i = 0; i < 10; i++) await button('Next').click();
  await page.getByText('Page 11 of 11 · 103 bottles').waitFor();
  assert.equal(await tiles.count(), 3);
  await button('Five stars').click();
  assert.equal(await tiles.count(), 1);
  await button(stagg).click();
  const detail = page.getByRole('dialog', { name: 'Bottle facts', exact: true });
  await detail.getByRole('heading', { name: stagg }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await button(stagg).evaluate((el) => el === document.activeElement), true);
  await button('Everything').click();
  await button(bookers).click();
  await detail.getByText('125.7', { exact: true }).waitFor();
  await detail.getByRole('button', { name: 'View bottle photos' }).click();
  const viewer = page.locator('.d1-viewer');
  await viewer.getByText('Photo 1 of 3', { exact: false }).waitFor();
  await page.keyboard.press('ArrowRight');
  await viewer.getByText('Photo 2 of 3', { exact: true }).waitFor();
  await viewer.getByRole('button', { name: 'Zoom in' }).click();
  await viewer.getByText('150%', { exact: true }).waitFor();
  await page.keyboard.press('ArrowRight');
  await viewer.getByText('100%', { exact: true }).waitFor();
  for (const key of ['Tab', 'Shift+Tab'])
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press(key);
      assert.ok(await viewer.evaluate((el) => el.contains(document.activeElement)));
    }
  await page.keyboard.press('Escape');
  await detail.getByRole('button', { name: 'View bottle photos' }).waitFor();
  assert.equal(
    await detail
      .getByRole('button', { name: 'View bottle photos' })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await detail.getByRole('button', { name: 'Back to showcase' }).click();
  await heading(bookers).waitFor();
  await button('Browse shelf').click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForFunction(() => document.querySelectorAll('.bar-tile').length === 6);
  await shot('browse-tablet');
  assert.ok(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight + 2,
    ),
  );
  await page.clock.fastForward(50000);
  await button('Store picks').click();
  await page.clock.fastForward(59000);
  await page.getByRole('heading', { name: 'Browse the shelf' }).waitFor();
  await page.clock.fastForward(1001);
  await heading(bookers).waitFor();
  await button(reduced ? 'Resume' : 'Pause').waitFor();
  assert.deepEqual(privateRequests, []);
  checkTraffic = false;
  await button('Leave Bar Display').click();
  await page.getByLabel('Display PIN').fill('314159');
  await button('End display').click();
  await page.getByLabel('Email address').waitFor();
  console.log(
    engine.name() +
      ' display passed: rotation, manual pause, 103 bottles, 11 pages, filters, photo zoom and focus, tablet layout, idle return, PIN exit.',
  );
} finally {
  await browser.close();
}
