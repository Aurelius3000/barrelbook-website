import type { Metadata } from "next";
import ReleaseRadar from "@/components/ReleaseRadar";
import { KBF_PATH, KBF_URL, openSlots, releases, releasePath } from "@/lib/kbf-releases";

const title = "KBF 2026: Bottle Watchlist";
const description = `Plan your KBF bottle hunt. ${releases.length} bottles${openSlots.length ? ` and ${openSlots.length} open pick${openSlots.length === 1 ? "" : "s"}` : ""}. Check specs, source links, and known sale days.`;

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: KBF_PATH },
  openGraph: { title, description, url: KBF_URL, type: "website", siteName: "BarrelBook" },
  twitter: { card: "summary", title, description },
};

export default function KbfWatchlistPage() {
  // Master sync 5: only named active bottles belong in list markup.
  const list = {
    "@context": "https://schema.org", "@type": "ItemList", name: title,
    description, url: KBF_URL, numberOfItems: releases.length,
    itemListElement: releases.map((release) => ({
      "@type": "ListItem", position: release.slot,
      name: `${release.brand}: ${release.name}`,
      url: `https://www.barrelbook.app${releasePath(release)}`,
    })),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list).replace(/</g, "\\u003c") }} />
    <ReleaseRadar />
  </>;
}
