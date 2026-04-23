import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import {
  APP_STORE_RATING_COUNT,
  APP_STORE_RATING_VALUE,
} from "@/lib/app-store";

export const metadata: Metadata = {
  title: "BarrelBook — AI-Powered Bourbon Collection App",
  description:
    "Scan, catalog, and track your bourbon and whiskey collection with AI-powered bottle recognition. Download BarrelBook for iOS today.",
};

// WEB-014: SoftwareApplication structured data so App Store-style rich
// results can show the aggregate rating and free offer in SERPs.
const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BarrelBook",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS",
  url: "https://apps.apple.com/us/app/barrelbook-whiskey-catalog/id6751737898",
  description:
    "Scan, catalog, and track your bourbon and whiskey collection with AI-powered bottle recognition.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: APP_STORE_RATING_VALUE,
    reviewCount: APP_STORE_RATING_COUNT,
    bestRating: "5",
    worstRating: "1",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
