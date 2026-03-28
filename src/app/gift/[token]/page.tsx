import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_STORE_APP_ID, APP_STORE_URL } from "@/lib/app-store";

interface GiftPageProps {
  params: Promise<{
    token: string;
  }>;
}

function normalizeGiftToken(token: string): string {
  return token.trim();
}

function getGiftAppOpenUrl(token: string): string {
  return `barrelbook://gift/${encodeURIComponent(normalizeGiftToken(token))}`;
}

export async function generateMetadata({
  params,
}: GiftPageProps): Promise<Metadata> {
  const { token } = await params;
  const normalizedToken = normalizeGiftToken(token);
  const canonicalPath = `/gift/${encodeURIComponent(normalizedToken)}`;
  const description =
    "Install BarrelBook, sign in, then return to this page and tap Open BarrelBook to claim your Golden Ticket.";

  return {
    title: "Your Golden Ticket",
    description,
    alternates: {
      canonical: canonicalPath,
    },
    other: {
      "apple-itunes-app": `app-id=${APP_STORE_APP_ID}, app-argument=${getGiftAppOpenUrl(normalizedToken)}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: "Your Golden Ticket",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Golden Ticket",
      description,
    },
  };
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { token } = await params;
  const normalizedToken = normalizeGiftToken(token);
  const appOpenUrl = getGiftAppOpenUrl(normalizedToken);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#333333] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/BarrelBook%20Logo%20Large.png"
              alt="BarrelBook"
              width={220}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[#D2691E]/40 bg-[#D2691E]/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#D2691E] hover:bg-[#D2691E]/20"
          >
            Get BarrelBook
          </a>
        </div>
      </header>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                You&apos;ve been gifted 1 year of BarrelBook Plus
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-[#D0D0D0] sm:text-xl">
                Install BarrelBook, sign in, then return here and tap Open BarrelBook to claim your Golden Ticket.
              </p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#BDBDBD]">
                Golden Tickets are private invite links from BarrelBook Pro members. After BarrelBook opens, continue from the in-app claim flow and finish Apple redemption there.
              </p>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-[#3B3B3B] bg-[radial-gradient(circle_at_top,#3A1D0D,transparent_55%),linear-gradient(180deg,#171717_0%,#101010_100%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-8">
                <h2 className="text-2xl font-semibold text-white">Claim your gift</h2>
                <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                  If BarrelBook is already installed, Open BarrelBook should take you straight into your Golden Ticket claim.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
                  >
                    Get BarrelBook
                  </a>
                  <a
                    href={appOpenUrl}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#D2691E]/45 bg-transparent px-5 py-3 text-base font-semibold text-white transition hover:border-[#D2691E] hover:bg-[#D2691E]/10"
                  >
                    Open BarrelBook
                  </a>
                </div>
                <div className="mt-6 rounded-2xl border border-[#D2691E]/35 bg-[#0F0F0F] p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-[#F2C19A]">
                    Then come back here if needed
                  </div>
                  <p className="mt-3 text-base leading-7 text-[#D4D4D4]">
                    If you need to install or sign in first, return to this same page and tap Open BarrelBook again after you&apos;re ready.
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#262626] bg-[#111111] p-5 sm:p-6">
                <h2 className="text-2xl font-semibold">If the app handoff does not work</h2>
                <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                  Open BarrelBook manually, make sure you are signed in, then return to this page and try Open BarrelBook again. If Apple later asks you to finish redemption, use Redeem App Store Code in BarrelBook Settings.
                </p>

                <ol className="mt-6 space-y-4">
                  {[
                    "Install BarrelBook from the App Store if needed.",
                    "Create or sign in to your BarrelBook account.",
                    "Return to this page and tap Open BarrelBook.",
                    "If the app still does not open, open BarrelBook manually and try this page again.",
                    "If Apple asks you to finish the gift later, use Redeem App Store Code in Settings."
                  ].map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D2691E]/15 text-sm font-semibold text-[#F2C19A]">
                        {index + 1}
                      </div>
                      <div className="pt-1 text-base leading-7 text-[#D4D4D4]">
                        {step}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
