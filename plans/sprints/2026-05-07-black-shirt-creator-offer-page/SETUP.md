# Black Shirt Bourbon Society Launch Setup

This website sprint only ships the public landing page and routing. App Store
Connect, Firestore, and end-to-end app QA remain manual launch steps.

## App Store Connect

- Create custom subscription offer code `BLACKSHIRTPLUS20` for Plus Annual.
- Create custom subscription offer code `BLACKSHIRTPRO20` for Pro Annual.
- Configure each code for 20% off the first year with 500 redemptions.
- Set the launch expiration date, defaulting to 90 days from launch unless a
  different campaign window is chosen.
- Record the final Apple redeem URL and exact offer identifier for each code.

## Firestore Campaign Documents

Create `campaigns/blackshirt_plus_annual_20`:

```json
{
  "active": true,
  "slug": "blackshirt-plus",
  "title": "Black Shirt Bourbon Society Plus Annual Offer",
  "subtitle": "20% off the first year of BarrelBook Plus Annual.",
  "offerSummary": "Black Shirt Bourbon Society members get 20% off the first year of BarrelBook Plus Annual.",
  "fulfillmentMode": "app_store_offer_code",
  "eligibilityRule": "new_users_only",
  "expectedPlanTier": "plus",
  "expectedPlanCycle": "annual",
  "expectedProductId": "com.barrelbook.collections.plus.annual",
  "expectedOfferIdentifier": "<APP_STORE_CONNECT_PLUS_OFFER_IDENTIFIER>",
  "appStoreRedeemLabel": "Continue in App Store",
  "appStoreRedeemURL": "<APPLE_PLUS_REDEEM_URL>",
  "maxClaims": 500,
  "currentClaims": 0
}
```

Create `campaigns/blackshirt_pro_annual_20`:

```json
{
  "active": true,
  "slug": "blackshirt-pro",
  "title": "Black Shirt Bourbon Society Pro Annual Offer",
  "subtitle": "20% off the first year of BarrelBook Pro Annual.",
  "offerSummary": "Black Shirt Bourbon Society members get 20% off the first year of BarrelBook Pro Annual.",
  "fulfillmentMode": "app_store_offer_code",
  "eligibilityRule": "new_users_only",
  "expectedPlanTier": "pro",
  "expectedPlanCycle": "annual",
  "expectedProductId": "com.barrelbook.collections.pro.annual",
  "expectedOfferIdentifier": "<APP_STORE_CONNECT_PRO_OFFER_IDENTIFIER>",
  "appStoreRedeemLabel": "Continue in App Store",
  "appStoreRedeemURL": "<APPLE_PRO_REDEEM_URL>",
  "maxClaims": 500,
  "currentClaims": 0
}
```

## Peter Checklist

- Confirm final public page copy.
- Confirm commission terms: 20% of BarrelBook's Apple proceeds on first-year
  revenue only, paid monthly after Apple settlement and net of refunds.
- Confirm the approved square logo asset is final.
- Deploy the website.
- Share only `https://www.barrelbook.app/blackshirt`.

## QA

- Verify `/blackshirt` redirects to `/p/blackshirt`.
- Verify `/p/blackshirt` is noindex,nofollow and excluded from the sitemap.
- Verify Plus and Pro CTAs open `barrelbook://promo/blackshirt-plus` and
  `barrelbook://promo/blackshirt-pro`.
- Verify the manual fallback disclosure exposes `BLACKSHIRTPLUS20` and
  `BLACKSHIRTPRO20` only after expansion.
- In app, verify each campaign resolves, creates a pending App Store redemption,
  opens the matching Apple URL, and completes only after matching StoreKit
  evidence is recovered.
