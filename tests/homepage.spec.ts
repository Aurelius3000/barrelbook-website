import { test, expect } from '@playwright/test';

async function stabilizeVideoForScreenshot(page: import('@playwright/test').Page) {
  // Keep visual snapshots deterministic without disabling the page's video
  // requests; request failures below remain visible test failures.
  await page.addStyleTag({
    content: 'video { opacity: 0 !important; }',
  });
}

test('homepage content and order match landing page direction', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const requestFailures: string[] = [];

  page.on('console', (msg) => {
    const isKnownHeadlessVideoRangeProbe =
      msg.text().includes('/videos/') && msg.text().includes('status of 403');

    if (msg.type() === 'error' && !isKnownHeadlessVideoRangeProbe) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    const isKnownHeadlessMediaProbe =
      req.url().startsWith('http://localhost:3000/videos/') &&
      req.url().endsWith('.mp4') &&
      ['cancelled', 'net::ERR_ABORTED'].includes(req.failure()?.errorText ?? '');
    const isCancelledVercelAnalyticsLoader =
      req.url().startsWith('https://va.vercel-scripts.com/') &&
      req.failure()?.errorText === 'cancelled';

    if (!isKnownHeadlessMediaProbe && !isCancelledVercelAnalyticsLoader) {
      requestFailures.push(`${req.url()} (${req.failure()?.errorText || 'unknown'})`);
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const supportNotice = page.getByRole('complementary', { name: 'Support notice' });
  await expect(supportNotice).toBeVisible();
  await expect(
    supportNotice.getByRole('link', {
      name: 'Having trouble signing in to BarrelBook or seeing your collection? Get help with BarrelBook 1.7.3 →',
    })
  ).toHaveAttribute('href', '/support');
  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('BarrelBook captures the details bourbon collectors care about — store picks, barrel numbers, batches — straight from a photo. No barcodes, no typing, no spreadsheets.')).toBeVisible();
  await expect(
    page.getByRole('link', { name: "Open BarrelBook's 4.8-star App Store rating" })
  ).toBeVisible();
  await expect(page.getByText(/24 five-star ratings/i)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Join Android early access' })).toHaveAttribute('href', '/android');

  await expect(page.getByText('Snap a photo, not a barcode', { exact: true })).toBeVisible();
  await expect(page.getByText('Built for bourbon bottle details', { exact: true })).toBeVisible();
  await expect(page.getByText('Your collection always with you', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Share the shelf worth showing off.' })).toBeVisible();

  const headings = await page.locator('h1, h2, h3').allTextContents();
  const normalizedHeadings = headings.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);

  expect(normalizedHeadings).toEqual([
    'Your whiskey shelf, in your pocket.',
    'Snap a photo. BarrelBook handles the details.',
    'Built for the details bourbon collectors care about.',
    'Know exactly what you have.',
    'Your collection goes wherever you go.',
    'Tonight’s Pour, picked for you.',
    'Share the shelf worth showing off.',
    'Spotlight bottles and tasting flights.',
    'Built for collectors who want more than a spreadsheet.',
    'Start free. Upgrade when your collection grows.',
    'Free',
    'Plus',
    'Pro',
    'Frequently asked questions',
    'Build your digital whiskey shelf today.',
  ]);

  await expect(page.locator('#pricing')).toContainText('Get started with BarrelBook for free, then unlock more power as your collection expands. Whether you’re cataloging a few favorites or managing a serious shelf, there’s a plan that fits.');
  await expect(page.locator('#download')).toContainText('Capture bottles, organize your collection, and keep your shelf with you wherever you go.');

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(requestFailures).toEqual([]);

  await stabilizeVideoForScreenshot(page);
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-homepage.png`, {
    fullPage: true,
    animations: 'disabled',
  });
});

test('tablet layout keeps the story and pricing sections readable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'tablet-chromium', 'Tablet-only coverage');

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 3, name: 'Know exactly what you have.' })).toBeVisible();
  await expect(page.locator('#pricing')).toBeVisible();
  await stabilizeVideoForScreenshot(page);
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-homepage.png`, {
    fullPage: true,
    animations: 'disabled',
  });
});

test('mobile navigation and hero proof strip are visible', async ({ page, isMobile }, testInfo) => {
  test.skip(!isMobile, 'Mobile-only coverage');

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('complementary', { name: 'Support notice' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download on the App Store' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('Snap a photo, not a barcode', { exact: true })).toBeVisible();
  await expect(page.getByText('Built for bourbon bottle details', { exact: true })).toBeVisible();
  await stabilizeVideoForScreenshot(page);
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-hero.png`, {
    animations: 'disabled',
  });
});
