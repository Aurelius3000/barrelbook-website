import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PromoCampaignPage from "@/components/promo/PromoCampaignPage";
import { APP_STORE_APP_ID } from "@/lib/app-store";
import {
  getPromoAppOpenUrl,
  getPromoCampaign,
  getPublishedPromoCampaigns,
} from "@/lib/promo-campaigns";

interface PromoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getPublishedCampaign(slug: string) {
  const campaign = getPromoCampaign(slug);

  return campaign?.published ? campaign : undefined;
}

export function generateStaticParams() {
  return getPublishedPromoCampaigns().map((campaign) => ({
    slug: campaign.slug,
  }));
}

export async function generateMetadata({
  params,
}: PromoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getPublishedCampaign(slug);

  if (!campaign) {
    return {
      title: "Promo not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = campaign.metadata?.title ?? campaign.title;
  const description = campaign.metadata?.description ?? campaign.heroBody;
  const canonicalPath = `/p/${campaign.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    other: {
      "apple-itunes-app": `app-id=${APP_STORE_APP_ID}, app-argument=${getPromoAppOpenUrl(campaign)}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PromoPage({ params }: PromoPageProps) {
  const { slug } = await params;
  const campaign = getPublishedCampaign(slug);

  if (!campaign) {
    notFound();
  }

  return <PromoCampaignPage campaign={campaign} />;
}
