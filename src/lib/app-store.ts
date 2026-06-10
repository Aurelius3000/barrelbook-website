export const APP_STORE_APP_ID = "6751737898";

export const APP_STORE_URL =
  `https://apps.apple.com/us/app/barrelbook-whiskey-catalog/id${APP_STORE_APP_ID}`;

export const APP_STORE_RATING_VALUE = "4.8";
// JREV-004: keep structured data exact while public copy uses a durable rounded count.
export const APP_STORE_RATING_COUNT = "137";
export const APP_STORE_RATING_DISPLAY_COUNT = "135+";

export const TESTFLIGHT_URL =
  process.env.BARRELBOOK_TESTFLIGHT_URL?.trim() || "https://testflight.apple.com/";

export function getSandboxPromoCode(slug: string): string | null {
  switch (slug.toLowerCase()) {
    case "fnf":
      return process.env.BARRELBOOK_FNF_SANDBOX_CODE?.trim() || null;
    default:
      return null;
  }
}
