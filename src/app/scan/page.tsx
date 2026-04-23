import DeepLinkLandingPage from "@/components/DeepLinkLandingPage";
import { scanLandingPageConfig } from "@/lib/deep-link-landing-pages";

export const metadata = scanLandingPageConfig.metadata;

export default function ScanPage() {
  return <DeepLinkLandingPage config={scanLandingPageConfig} />;
}
