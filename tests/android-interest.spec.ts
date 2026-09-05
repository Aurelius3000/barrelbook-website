import { expect, test } from "@playwright/test";
import { ANDROID_EARLY_ACCESS_FORM_URL } from "../src/lib/android-interest";
import { APP_STORE_URL } from "../src/lib/app-store";

type CapturedGtagEvent = {
  command: string;
  eventName: string;
  params?: Record<string, string>;
};

async function installGtagCapture(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const storageKey = "playwright-gtag-events";
    const target = window as typeof window & {
      gtag?: (
        command: string,
        eventName: string,
        params?: Record<string, string>
      ) => void;
    };

    target.gtag = (command, eventName, params) => {
      const events = JSON.parse(
        window.sessionStorage.getItem(storageKey) ?? "[]"
      );
      events.push({ command, eventName, params });
      window.sessionStorage.setItem(storageKey, JSON.stringify(events));
    };
  });
}

async function readGtagEvents(
  page: import("@playwright/test").Page
): Promise<CapturedGtagEvent[]> {
  return page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("playwright-gtag-events") ?? "[]")
  );
}

test("Android early-access page routes a visitor to the published consent form without exposing PII to site analytics", async ({
  page,
}) => {
  await page.goto("/android");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "BarrelBook for Android is in the works.",
    })
  ).toBeVisible();
  await expect(
    page.getByText(/You'll confirm your email, 21\+ status, and consent/)
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Continue to Google Form" })
  ).toHaveAttribute("href", ANDROID_EARLY_ACCESS_FORM_URL);
  await expect(page.locator('a[href="/#how-it-works"]')).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Download on the App Store" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Join the BarrelBook Android waitlist" })
  ).toHaveCount(0);
  await expect(page.locator('input[type="email"]')).toHaveCount(0);
});

test("every public App Store badge has an adjacent Android waitlist path", async ({
  page,
}) => {
  const expectedPlacements = new Map([
    ["/", 3],
    ["/scan", 4],
    ["/collection", 4],
    ["/store-picks", 4],
  ]);

  for (const [path, expectedCount] of expectedPlacements) {
    await page.goto(path);

    const appStoreLinks = page.getByRole("link", {
      name: "Download on the App Store",
    });
    await expect(appStoreLinks).toHaveCount(expectedCount);

    for (const link of await appStoreLinks.all()) {
      await expect(link).toHaveAttribute("href", APP_STORE_URL);
    }

    const androidWaitlistLinks = page.getByRole("link", {
      name: "Join the BarrelBook Android waitlist",
    });
    await expect(androidWaitlistLinks).toHaveCount(expectedCount);

    for (const link of await androidWaitlistLinks.all()) {
      await expect(link).toHaveAttribute("href", "/android");
    }

    const platformGroups = page.locator("[data-platform-download-ctas]");
    await expect(platformGroups).toHaveCount(expectedCount);
    for (const group of await platformGroups.all()) {
      await expect(
        group.getByRole("link", { name: "Download on the App Store" })
      ).toHaveCount(1);
      await expect(
        group.getByRole("link", {
          name: "Join the BarrelBook Android waitlist",
        })
      ).toHaveCount(1);
    }

    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  }
});

test("new Android waitlist placements emit page and location analytics", async ({
  page,
}) => {
  await installGtagCapture(page);
  await page.goto("/");

  await page
    .getByRole("link", { name: "Join the BarrelBook Android waitlist" })
    .nth(1)
    .click();
  await expect(page).toHaveURL(/\/android$/);

  expect(await readGtagEvents(page)).toContainEqual({
    command: "event",
    eventName: "android_waitlist_cta_clicked",
    params: { page: "/", location: "hero" },
  });
});

test("homepage download preserves the legacy Android analytics event", async ({
  page,
}) => {
  await installGtagCapture(page);
  await page.goto("/");

  await page
    .getByRole("link", { name: "Join the BarrelBook Android waitlist" })
    .nth(2)
    .click();
  await expect(page).toHaveURL(/\/android$/);

  const events = await readGtagEvents(page);
  expect(events).toContainEqual({
    command: "event",
    eventName: "android_interest_homepage_clicked",
    params: { placement: "homepage_download" },
  });
  expect(
    events.filter((event) => event.eventName === "android_waitlist_cta_clicked")
  ).toHaveLength(0);
});
