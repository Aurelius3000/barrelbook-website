import type { Metadata } from "next";
import PromoLandingPage from "@/components/promo/PromoLandingPage";
import { APP_STORE_APP_ID } from "@/lib/app-store";
import { getFnfQaCampaign, getPromoAppOpenUrl } from "@/lib/promo-campaigns";

const QA_CAMPAIGN = getFnfQaCampaign();

export const metadata: Metadata = {
  title: "FNF QA Promo",
  description:
    "QA-only TestFlight flow for the FNF promo. Install via TestFlight, return to the page, and tap Open BarrelBook.",
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "apple-itunes-app": `app-id=${APP_STORE_APP_ID}, app-argument=${getPromoAppOpenUrl(QA_CAMPAIGN)}`,
  },
};

export default function FnfQaPage() {
  return <PromoLandingPage campaign={QA_CAMPAIGN} />;
}
