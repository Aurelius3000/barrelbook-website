import { expect, test } from "@playwright/test";
import { ANDROID_EARLY_ACCESS_FORM_URL } from "../src/lib/android-interest";

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
  await expect(
    page.locator('a[href="/#how-it-works"]')
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Download on the App Store" })
  ).toHaveCount(0);
  await expect(page.locator('input[type="email"]')).toHaveCount(0);
});

test("homepage preserves the App Store CTA and provides an Android early-access path", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Join the early-access list." })
  ).toHaveAttribute("href", "/android");
  await expect(
    page.getByRole("link", { name: "Download on the App Store" }).first()
  ).toHaveAttribute("href", /apps\.apple\.com/);
});
