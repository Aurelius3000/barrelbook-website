import Image from "next/image";
import Link from "next/link";
import {
  getPromoAppOpenUrl,
  type PromoCampaignConfig,
} from "@/lib/promo-campaigns";
import { CopyCodeButton } from "@/components/promo/CopyCodeButton";

interface PromoLandingPageProps {
  campaign: PromoCampaignConfig;
}

export default function PromoLandingPage({
  campaign,
}: PromoLandingPageProps) {
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
            href={campaign.installUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[#D2691E]/40 bg-[#D2691E]/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#D2691E] hover:bg-[#D2691E]/20"
          >
            {campaign.installLabel}
          </a>
        </div>
      </header>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {campaign.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-[#D0D0D0] sm:text-xl">
                {campaign.subtitle}
              </p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#BDBDBD]">
                {campaign.heroBody}
              </p>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-[#3B3B3B] bg-[radial-gradient(circle_at_top,#3A1D0D,transparent_55%),linear-gradient(180deg,#171717_0%,#101010_100%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-8">
                <h2 className="text-2xl font-semibold text-white">Get started</h2>
                <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                  {campaign.primaryCardDescription}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={campaign.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
                  >
                    {campaign.installLabel}
                  </a>
                  <a
                    href={getPromoAppOpenUrl(campaign)}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#D2691E]/45 bg-transparent px-5 py-3 text-base font-semibold text-white transition hover:border-[#D2691E] hover:bg-[#D2691E]/10"
                  >
                    Open BarrelBook
                  </a>
                </div>
                <div className="mt-6 rounded-2xl border border-[#D2691E]/35 bg-[#0F0F0F] p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-[#F2C19A]">
                    {campaign.openHintTitle}
                  </div>
                  <p className="mt-3 text-base leading-7 text-[#D4D4D4]">
                    {campaign.openHint}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#262626] bg-[#111111] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{campaign.fallbackTitle}</h2>
                    <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                      {campaign.fallbackSummary}
                    </p>
                  </div>
                  <div className="sm:shrink-0">
                    <CopyCodeButton code={campaign.code} />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#2E2E2E] bg-[#171717] p-5">
                  <div className="text-sm uppercase tracking-[0.22em] text-[#C78C61]">
                    {campaign.codeLabel}
                  </div>
                  <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-xl font-semibold tracking-[0.08em] text-white sm:text-[1.75rem]">
                    {campaign.code}
                  </code>
                </div>

                <ol className="mt-6 space-y-4">
                  {campaign.fallbackSteps.map((step, index) => (
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
