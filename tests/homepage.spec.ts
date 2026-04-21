import { test, expect } from '@playwright/test';

test('homepage content and order match landing page direction', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const requestFailures: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    requestFailures.push(`${req.url()} (${req.failure()?.errorText || 'unknown'})`);
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('BarrelBook helps whiskey collectors turn bottle photos into a clean, portable digital shelf — without barcodes, typing, or spreadsheets.')).toBeVisible();

  await expect(page.getByText('Snap a photo, not a barcode', { exact: true })).toBeVisible();
  await expect(page.getByText('Built for bourbon bottle details', { exact: true })).toBeVisible();
  await expect(page.getByText('Your collection always with you', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Share a shelf worth showing.' })).toBeVisible();

  const headings = await page.locator('h1, h2, h3').allTextContents();
  const normalizedHeadings = headings.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);

  expect(normalizedHeadings).toEqual([
    'Your whiskey shelf, in your pocket.',
    'No barcodes. No typing. No spreadsheets.',
    'Snap a photo. BarrelBook handles the details.',
    'Built for the details bourbon collectors care about.',
    'Know exactly what you have.',
    'Your collection goes wherever you go.',
    'Share a shelf worth showing.',
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
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-homepage.png`, {
    fullPage: true,
    animations: 'disabled',
  });
});

test('mobile navigation and hero proof strip are visible', async ({ page, isMobile }, testInfo) => {
  test.skip(!isMobile, 'Mobile-only coverage');

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('link', { name: 'Download on the App Store' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('Snap a photo, not a barcode', { exact: true })).toBeVisible();
  await expect(page.getByText('Built for bourbon bottle details', { exact: true })).toBeVisible();
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-hero.png`, {
    animations: 'disabled',
  });
});
