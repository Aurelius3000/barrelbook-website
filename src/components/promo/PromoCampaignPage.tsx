import type { PromoCampaignConfig } from "@/lib/promo-campaigns";
import PromoLandingPage from "@/components/promo/PromoLandingPage";
import CreatorCollabPromoPage from "@/components/promo/CreatorCollabPromoPage";

interface PromoCampaignPageProps {
  campaign: PromoCampaignConfig;
}

export default function PromoCampaignPage({
  campaign,
}: PromoCampaignPageProps) {
  if (campaign.template === "creator-collab") {
    return <CreatorCollabPromoPage campaign={campaign} />;
  }

  return <PromoLandingPage campaign={campaign} />;
}
