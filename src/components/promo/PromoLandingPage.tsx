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
  const installStepDescription = campaign.qaOnly
    ? "Install the BarrelBook test build, then create or sign in to your account."
    : "Download BarrelBook, then create or sign in to your account.";

  const redeemStepDescription = campaign.qaOnly
    ? "After you sign in, come back here and tap Redeem to continue the promo in the app."
    : "After you sign in, come back here and tap Redeem to redeem the offer in the app.";

  const fallbackDescription = campaign.qaOnly
    ? "If tapping Redeem does not work, open BarrelBook, go to Settings, tap Redeem App Store Code, and enter the sandbox code below."
    : "If tapping Redeem does not work, open BarrelBook, go to Settings, tap Redeem App Store Code, and enter the code below.";

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
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#C78C61]">
              BarrelBook promo
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {campaign.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#D0D0D0] sm:text-xl">
              Two steps. Get the app, then redeem the offer.
            </p>
          </div>

          <div className="mt-10 rounded-[28px] border border-[#2B2B2B] bg-[#111111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <ol className="space-y-4">
              <li className="rounded-3xl border border-[#2E2E2E] bg-[#151515] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D2691E] text-base font-semibold text-white">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-semibold text-white">
                      Get the app and create an account
                    </h2>
                    <p className="mt-3 max-w-xl text-base leading-7 text-[#CFCFCF]">
                      {installStepDescription}
                    </p>
                    <a
                      href={campaign.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
                    >
                      {campaign.installLabel}
                    </a>
                  </div>
                </div>
              </li>

              <li className="rounded-3xl border border-[#2E2E2E] bg-[#151515] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D2691E] text-base font-semibold text-white">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-semibold text-white">
                      Redeem the offer
                    </h2>
                    <p className="mt-3 max-w-xl text-base leading-7 text-[#CFCFCF]">
                      {redeemStepDescription}
                    </p>
                    <a
                      href={getPromoAppOpenUrl(campaign)}
                      className="mt-5 inline-flex items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
                    >
                      Redeem
                    </a>
                  </div>
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-3xl border border-[#2E2E2E] bg-[#151515] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Manual code fallback
                  </h2>
                  <p className="mt-3 max-w-xl text-base leading-7 text-[#CFCFCF]">
                    {fallbackDescription}
                  </p>
                </div>
                <div className="sm:shrink-0">
                  <CopyCodeButton code={campaign.code} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#2E2E2E] bg-[#171717] p-5">
                <div className="text-sm uppercase tracking-[0.22em] text-[#C78C61]">
                  {campaign.codeLabel}
                </div>
                <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-xl font-semibold tracking-[0.08em] text-white sm:text-[1.75rem]">
                  {campaign.code}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
