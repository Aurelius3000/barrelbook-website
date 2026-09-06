import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReleaseRadar from "@/components/ReleaseRadar";
import { allReleases, getRelease, KBF_URL, releasePath, relatedReleases } from "@/lib/kbf-releases";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return allReleases.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const release = getRelease((await params).slug);
  if (!release) notFound();
  const title = `${release.brand}: ${release.name} | KBF 2026`;
  const description = release.slot === null
    ? `Off our current watchlist. See the known specs, sources, and KBF plans for ${release.brand}: ${release.name}.`
    : `${release.why} See the known specs, sources, and KBF plans for this watchlist pick.`;
  return {
    title, description, alternates: { canonical: releasePath(release) },
    robots: release.slot === null ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: `https://www.barrelbook.app${releasePath(release)}`, type: "website", siteName: "BarrelBook" },
    twitter: { card: "summary", title, description },
  };
}

export default async function KbfReleasePage({ params }: Props) {
  const release = getRelease((await params).slug);
  // Plan 4: a bad slug must not silently show a different bottle.
  if (!release) notFound();
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "KBF watchlist", item: KBF_URL },
      { "@type": "ListItem", position: 2, name: `${release.brand}: ${release.name}`, item: `https://www.barrelbook.app${releasePath(release)}` },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    <ReleaseRadar release={release} related={relatedReleases(release)} />
  </>;
}
