import DeepLinkLandingPage from "@/components/DeepLinkLandingPage";
import { storePicksLandingPageConfig } from "@/lib/deep-link-landing-pages";

export const metadata = storePicksLandingPageConfig.metadata;

export default function StorePicksPage() {
  return <DeepLinkLandingPage config={storePicksLandingPageConfig} />;
}
