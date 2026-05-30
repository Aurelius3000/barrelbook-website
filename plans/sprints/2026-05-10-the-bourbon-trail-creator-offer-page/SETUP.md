# The Bourbon Trail Launch Setup

This website sprint ships the public landing page and routing only. App Store
Connect, Firestore, and end-to-end app QA remain manual launch steps.

## App Store Connect

- Reuse the annual creator 20% offers if they already exist:
  - Plus Annual offer reference name: `CREATOR20PLUSANNUAL`
  - Pro Annual offer reference name: `CREATOR20PROANNUAL`
- Create custom code `THEBOURBONTRAILPLUS20` under the Plus Annual offer.
- Create custom code `THEBOURBONTRAILPRO20` under the Pro Annual offer.
- Configure each code for 20% off the first year with 500 redemptions.
- Set the launch expiration date to 90 days from The Bourbon Trail's first
  public campaign post unless a different campaign window is chosen.
- Record the final Apple redeem URL for each code.

## Firestore Campaign Documents

Create `campaigns/thebourbontrail_plus_annual_20`:

```json
{
  "active": true,
  "slug": "thebourbontrail-plus",
  "title": "The Bourbon Trail Plus Annual Offer",
  "subtitle": "20% off the first year of BarrelBook Plus Annual.",
  "offerSummary": "The Bourbon Trail audience gets 20% off the first year of BarrelBook Plus Annual.",
  "fulfillmentMode": "app_store_offer_code",
  "eligibilityRule": "new_users_only",
  "expectedPlanTier": "plus",
  "expectedPlanCycle": "annual",
  "expectedProductId": "com.barrelbook.collections.plus.annual",
  "expectedOfferIdentifier": "CREATOR20PLUSANNUAL",
  "appStoreRedeemLabel": "Continue in App Store",
  "appStoreRedeemURL": "<APPLE_PLUS_REDEEM_URL>",
  "maxClaims": 500,
  "currentClaims": 0
}
```

Create `campaigns/thebourbontrail_pro_annual_20`:

```json
{
  "active": true,
  "slug": "thebourbontrail-pro",
  "title": "The Bourbon Trail Pro Annual Offer",
  "subtitle": "20% off the first year of BarrelBook Pro Annual.",
  "offerSummary": "The Bourbon Trail audience gets 20% off the first year of BarrelBook Pro Annual.",
  "fulfillmentMode": "app_store_offer_code",
  "eligibilityRule": "new_users_only",
  "expectedPlanTier": "pro",
  "expectedPlanCycle": "annual",
  "expectedProductId": "com.barrelbook.collections.pro.annual",
  "expectedOfferIdentifier": "CREATOR20PROANNUAL",
  "appStoreRedeemLabel": "Continue in App Store",
  "appStoreRedeemURL": "<APPLE_PRO_REDEEM_URL>",
  "maxClaims": 500,
  "currentClaims": 0
}
```

## QA

- Verify `/thebourbontrail` redirects to `/p/thebourbontrail`.
- Verify `/p/thebourbontrail` is noindex,nofollow and excluded from the sitemap.
- Verify Plus and Pro CTAs open `barrelbook://promo/thebourbontrail-plus` and
  `barrelbook://promo/thebourbontrail-pro`.
- Verify the manual fallback disclosure exposes `THEBOURBONTRAILPLUS20` and
  `THEBOURBONTRAILPRO20` only after expansion.
- In app, verify each campaign resolves, creates a pending App Store redemption,
  opens the matching Apple URL, and completes only after matching StoreKit
  evidence is recovered.
