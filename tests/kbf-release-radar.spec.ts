import { expect, test } from '@playwright/test';

const releaseName = 'KBF 35th Anniversary Commemorative Release';
const releasePath = '/releases/kbf-2026/heaven-hill-kbf-35th';
const labelUrl = 'https://storage.ghost.io/c/1f/bc/1fbc7ea1-d6e2-43ab-9661-246c6f0c07f9/content/images/2026/08/728512055_18109277113970126_5500915705456488426_n-1.png';

test('Heaven Hill matches its label and stays out of the 120+ proof filter', async ({ page }) => {
  await page.goto('/releases/kbf-2026');

  const bottle = page.locator('[data-release-slug="heaven-hill-kbf-35th"]');
  const listProof = bottle.locator('dt').filter({ hasText: /^Proof$/ }).locator('..');
  await expect(listProof.locator('dd > span')).toHaveText('113.5');
  await expect(listProof.getByRole('link', { name: 'Source: Heaven Hill bottle label', exact: true })).toHaveAttribute('href', labelUrl);
  await expect(bottle).not.toContainText('133.5');
  await expect(bottle.locator('span').filter({ hasText: /^Reported$/ })).toBeVisible();

  const search = page.getByRole('searchbox', { name: 'Search bottles', exact: true });
  if (!await search.isVisible()) {
    await page.locator('summary').filter({ hasText: 'Search and filters' }).click();
  }
  await search.fill('Heaven Hill');
  await expect(page.getByRole('status')).toHaveText('1 of 25 bottles');

  const highProof = page.getByRole('checkbox', { name: '120+ proof', exact: true });
  await highProof.check();
  await expect(page.getByRole('status')).toHaveText('0 of 25 bottles');
  await expect(bottle).toHaveCount(0);

  await highProof.uncheck();
  await expect(page.getByRole('status')).toHaveText('1 of 25 bottles');
  await bottle.getByRole('link', { name: releaseName, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${releasePath}$`));
  await expect(page.getByRole('heading', { name: releaseName, exact: true })).toBeVisible();

  const detailProof = page.locator('dt').filter({ hasText: /^Proof$/ }).locator('..');
  await expect(detailProof.locator('dd > span')).toHaveText('113.5');
  await expect(detailProof.getByRole('link', { name: 'Source: Heaven Hill bottle label', exact: true })).toHaveAttribute('href', labelUrl);
  await expect(page.getByRole('region', { name: 'Updates', exact: true }).getByRole('listitem')).toHaveText([
    'Sep 5, 2026: Added to our KBF watchlist. Sources checked.',
    'Sep 5, 2026: Matched to the master list at no. 1.',
    'Sep 6, 2026: Corrected proof to 113.5 from the bottle label.',
  ]);
  await expect(page.locator('main')).not.toContainText('133.5');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.barrelbook.app${releasePath}`);
});
