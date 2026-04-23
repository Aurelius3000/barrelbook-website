import DeepLinkLandingPage from "@/components/DeepLinkLandingPage";
import { collectionLandingPageConfig } from "@/lib/deep-link-landing-pages";

export const metadata = collectionLandingPageConfig.metadata;

export default function CollectionPage() {
  return <DeepLinkLandingPage config={collectionLandingPageConfig} />;
}
