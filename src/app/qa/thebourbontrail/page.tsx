import type { Metadata } from "next";
import PromoCampaignPage from "@/components/promo/PromoCampaignPage";
import { APP_STORE_APP_ID } from "@/lib/app-store";
import {
  getPromoAppOpenUrl,
  getTheBourbonTrailDraftCampaign,
} from "@/lib/promo-campaigns";

const DRAFT_CAMPAIGN = getTheBourbonTrailDraftCampaign();

export const metadata: Metadata = {
  title: "The Bourbon Trail x BarrelBook Draft",
  description:
    "Draft creator promo page for @thebourbontrail.",
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "apple-itunes-app": `app-id=${APP_STORE_APP_ID}, app-argument=${getPromoAppOpenUrl(DRAFT_CAMPAIGN)}`,
  },
};

export default function TheBourbonTrailDraftPage() {
  return <PromoCampaignPage campaign={DRAFT_CAMPAIGN} />;
}
