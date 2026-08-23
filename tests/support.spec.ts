import { expect, test } from "@playwright/test";

test("support route provides safe 1.7.3 recovery guidance and remains noindex", async ({
  page,
}, testInfo) => {
  await page.goto("/support", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Seeing this message when you try to sign in?",
    })
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*follow/
  );
  await expect(
    page.getByRole("img", {
      name: "BarrelBook authentication error saying access has been revoked and to sign in again",
    })
  ).toBeVisible();
  await expect(
    page.getByText(/contact Support before deleting the app/)
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "support@barrelbook.app" })
  ).toHaveAttribute("href", "mailto:support@barrelbook.app");
  await expect(
    page.getByRole("link", { name: "← Back to Home" })
  ).toHaveAttribute("href", "/");

  const bodyWidth = await page.locator("body").evaluate((element) =>
    Math.max(element.scrollWidth, document.documentElement.scrollWidth)
  );
  const viewportWidth = page.viewportSize()?.width ?? bodyWidth;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

  if (testInfo.project.name !== "tablet-chromium") {
    await expect(page).toHaveScreenshot(
      `${testInfo.project.name}-support.png`,
      {
        fullPage: true,
        animations: "disabled",
      }
    );
  }
});

test("support stays out of the public sitemap", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "One sitemap check is sufficient");

  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).not.toContain("/support");
});
