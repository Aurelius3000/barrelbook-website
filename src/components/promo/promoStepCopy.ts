import type { PromoCampaignConfig } from "@/lib/promo-campaigns";

export function getInstallStepDescription(campaign: PromoCampaignConfig) {
  return campaign.qaOnly
    ? "Install the BarrelBook test build, then create or sign in to your account."
    : "Download BarrelBook, then create or sign in to your account.";
}

export function getRedeemStepDescription(campaign: PromoCampaignConfig) {
  return campaign.qaOnly
    ? "After you sign in, come back here and tap Redeem to continue the promo in the app."
    : "After you sign in, come back here and tap Redeem to redeem the offer in the app.";
}

export function getFallbackDescription(campaign: PromoCampaignConfig) {
  return campaign.qaOnly
    ? "If tapping Redeem does not work, open BarrelBook, go to Settings, tap Redeem App Store Code, and enter the sandbox code below."
    : "If tapping Redeem does not work, open BarrelBook, go to Settings, tap Redeem App Store Code, and enter the code below.";
}
