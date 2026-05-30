import type { PromoCampaignConfig } from "@/lib/promo-campaigns";
import PromoLandingPage from "@/components/promo/PromoLandingPage";
import CreatorCollabPromoPage from "@/components/promo/CreatorCollabPromoPage";
import CreatorMultiOfferPromoPage from "@/components/promo/CreatorMultiOfferPromoPage";

interface PromoCampaignPageProps {
  campaign: PromoCampaignConfig;
}

export default function PromoCampaignPage({
  campaign,
}: PromoCampaignPageProps) {
  if (campaign.template === "creator-collab") {
    return <CreatorCollabPromoPage campaign={campaign} />;
  }

  if (campaign.template === "creator-multi-offer") {
    return <CreatorMultiOfferPromoPage campaign={campaign} />;
  }

  return <PromoLandingPage campaign={campaign} />;
}
