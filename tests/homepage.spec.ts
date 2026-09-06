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
    const isBlockedVercelDebugLoader =
      msg.location().url === 'https://va.vercel-scripts.com/v1/script.debug.js' &&
      msg.text().includes('status of 403');

    if (msg.type() === 'error' && isBlockedVercelDebugLoader) {
      // This third-party development script can reject headless browsers.
      // Keep the limit in the report; hosted analytics needs its own check.
      testInfo.annotations.push({
        type: 'external-check-limit',
        description: 'Vercel debug analytics CDN returned 403. Analytics delivery is not verified here.',
      });
      return;
    }

    if (msg.type() === 'error' && !isKnownHeadlessVideoRangeProbe) {
      consoleErrors.push(`${msg.text()} (${msg.location().url || 'unknown source'})`);
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
    const isBlockedVercelDebugLoader =
      req.url() === 'https://va.vercel-scripts.com/v1/script.debug.js' &&
      req.failure()?.errorText === 'net::ERR_BLOCKED_BY_ORB';

    if (isBlockedVercelDebugLoader) {
      testInfo.annotations.push({
        type: 'external-check-limit',
        description: 'Browser blocked the Vercel debug analytics CDN response. Analytics delivery is not verified here.',
      });
      return;
    }

    if (!isKnownHeadlessMediaProbe && !isCancelledVercelAnalyticsLoader) {
      requestFailures.push(`${req.url()} (${req.failure()?.errorText || 'unknown'})`);
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('complementary', { name: 'Support notice' })).toHaveCount(0);
  await expect(page.getByText(/Get help with BarrelBook 1\.7\.3/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('BarrelBook captures the details bourbon collectors care about — store picks, barrel numbers, batches — straight from a photo. No barcodes, no typing, no spreadsheets.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'KBF 2026 Release Radar', exact: true })).toHaveCount(0);
  const menuButton = page.getByRole('button', { name: 'Menu', exact: true });
  if (page.viewportSize()!.width < 1024) {
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
  } else {
    await expect(menuButton).toBeHidden();
    const radarLink = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'KBF 2026', exact: true });
    await expect(radarLink).toBeVisible();
    await expect(radarLink).toHaveAttribute('href', '/releases/kbf-2026');
  }
  await expect(
    page.getByRole('link', { name: "Open BarrelBook's 4.8-star App Store rating" })
  ).toBeVisible();
  await expect(page.getByText(/24 five-star ratings/i)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Download on the App Store' })).toHaveCount(3);
  const androidWaitlistLinks = page.getByRole('link', { name: 'Join the BarrelBook Android waitlist' });
  await expect(androidWaitlistLinks).toHaveCount(3);
  for (const link of await androidWaitlistLinks.all()) {
    await expect(link).toHaveAttribute('href', '/android');
  }

  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);

  const headerBox = await page.getByRole('banner').boundingBox();
  const heroHeadingBox = await page
    .getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })
    .boundingBox();
  expect(headerBox).not.toBeNull();
  expect(heroHeadingBox).not.toBeNull();
  expect(heroHeadingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);

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

test('homepage opens the KBF release radar with the keyboard', async ({ page, browserName }) => {
  await page.goto('/');

  // WebKit's default keyboard mode uses Option-Tab to include links.
  const nextLink = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const radarLink = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'KBF 2026', exact: true });
  if (page.viewportSize()!.width < 1024) {
    const menuButton = page.getByRole('button', { name: 'Menu', exact: true });
    await menuButton.focus();
    await menuButton.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await menuButton.press(nextLink);
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'How it works', exact: true })).toBeFocused();
    await page.keyboard.press(nextLink);
    await page.keyboard.press(nextLink);
  } else {
    await radarLink.focus();
  }
  await expect(radarLink).toBeVisible();
  await expect(radarLink).toBeFocused();
  await expect(radarLink).toHaveAttribute('href', '/releases/kbf-2026');
  await radarLink.press('Enter');

  await expect(page).toHaveURL(/\/releases\/kbf-2026$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Plan your KBF bottle hunt.' })).toBeVisible();
  await expect(page.locator('li[data-release-slug]')).toHaveCount(25);
  await expect(page.getByRole('complementary', { name: 'Open pick 26' })).toBeVisible();
});

test('phone menu closes on Escape, link choice, focus leaving, outside click, and desktop resize', async ({ page, browserName }) => {
  test.skip(page.viewportSize()!.width >= 1024, 'Phone and tablet menu coverage');
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Menu', exact: true });
  const navigation = page.getByRole('navigation', { name: 'Main' });
  const nextLink = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await menuButton.focus();
  await menuButton.press('Space');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await menuButton.press(nextLink);
  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await navigation.getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/\/#pricing$/);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toHaveCount(0);

  await page.goto('/');
  await menuButton.click();
  await navigation.getByRole('link', { name: 'Download', exact: true }).focus();
  await page.keyboard.press(nextLink);
  await page.keyboard.press(nextLink);
  await page.keyboard.press(nextLink);
  await expect(page.getByRole('link', { name: "Open BarrelBook's 4.8-star App Store rating" })).toBeFocused();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await menuButton.click();
  await page.getByText('Free to start • No credit card required', { exact: true }).click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menuButton).toBeHidden();
  await expect(page.getByRole('button', { name: 'Menu', exact: true, includeHidden: true })).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize(viewport);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toHaveCount(0);
});

test('homepage header fits narrow and desktop breakpoints without overlapping controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One responsive breakpoint sweep');
  await page.goto('/');

  for (const width of [320, 390, 640, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const header = page.getByRole('banner');
    const logo = await header.getByRole('img', { name: 'BarrelBook logo' }).boundingBox();
    const store = await header.getByRole('link', { name: 'Download on the App Store' }).boundingBox();
    const android = await header.getByRole('link', { name: 'Join the BarrelBook Android waitlist' }).boundingBox();
    expect(logo).not.toBeNull();
    expect(store).not.toBeNull();
    expect(android).not.toBeNull();
    expect(logo!.x + logo!.width).toBeLessThanOrEqual(Math.min(store!.x, android!.x));
    expect(Math.max(store!.x + store!.width, android!.x + android!.width)).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    if (width < 1024) {
      const button = header.getByRole('button', { name: 'Menu', exact: true });
      const buttonBox = await button.boundingBox();
      expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(Math.min(store!.x, android!.x));
      await button.click();
      await expect(header.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'KBF 2026', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await button.click();
    } else {
      const navigation = await header.getByRole('navigation', { name: 'Main' }).boundingBox();
      expect(logo!.x + logo!.width).toBeLessThanOrEqual(navigation!.x);
      expect(navigation!.x + navigation!.width).toBeLessThanOrEqual(Math.min(store!.x, android!.x));
    }
  }
});

test('other shared headers keep their existing navigation', async ({ page }) => {
  for (const path of ['/scan', '/collection', '/store-picks', '/android']) {
    await page.goto(path);
    const header = page.getByRole('banner');
    await expect(header.getByRole('button', { name: 'Menu', exact: true })).toHaveCount(0);
    await expect(header.locator('a[href="/releases/kbf-2026"]')).toHaveCount(0);
    const links = header.locator('nav a');
    await expect(links).toHaveText(path === '/android'
      ? ['How it works', 'Pricing', 'Download']
      : ['How it works', 'Pricing', 'FAQ']);
  }
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

  await expect(page.getByRole('complementary', { name: 'Support notice' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Download on the App Store' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Join the BarrelBook Android waitlist' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Your whiskey shelf, in your pocket.' })).toBeVisible();
  await expect(page.getByText('Snap a photo, not a barcode', { exact: true })).toBeVisible();
  await expect(page.getByText('Built for bourbon bottle details', { exact: true })).toBeVisible();
  await stabilizeVideoForScreenshot(page);
  await expect(page).toHaveScreenshot(`${testInfo.project.name}-hero.png`, {
    animations: 'disabled',
  });
});
