import Image from "next/image";
import {
  getPromoAppOpenUrl,
  type PromoCampaignConfig,
} from "@/lib/promo-campaigns";
import { CopyCodeButton } from "@/components/promo/CopyCodeButton";
import {
  getFallbackDescription,
  getInstallStepDescription,
  getRedeemStepDescription,
} from "@/components/promo/promoStepCopy";

interface CreatorCollabPromoPageProps {
  campaign: PromoCampaignConfig;
}

const CREATOR_GRADIENT =
  "linear-gradient(135deg, #F7B733 0%, #FC6A47 48%, #F54291 100%)";
const BARRELBOOK_LOGO_LARGE = "/BarrelBook%20Logo%20Large.png";

export default function CreatorCollabPromoPage({
  campaign,
}: CreatorCollabPromoPageProps) {
  const installStepDescription = getInstallStepDescription(campaign);
  const redeemStepDescription = getRedeemStepDescription(campaign);
  const fallbackDescription = getFallbackDescription(campaign);

  const branding = campaign.creatorCollab;
  const creatorHandle = branding?.eyebrow ?? "creator";
  const creatorCategory = branding?.collaborationLabel ?? "Creator Collab";
  const creatorBio =
    branding?.supportingText ??
    "Bourbon travel, distillery stops, and great pours.";
  const creatorLogoSrc = branding?.logoSrc;
  const creatorLogoAlt = branding?.logoAlt ?? `${creatorHandle} logo`;
  const stepOneTitle =
    branding?.stepOneTitle ?? "Get BarrelBook and create an account";
  const stepTwoTitle = branding?.stepTwoTitle ?? "Claim the creator offer";
  const manualFallbackTitle =
    branding?.manualFallbackTitle ?? "Need the code instead?";

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF8F2] text-[#121212]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-10rem] top-[-12rem] h-[24rem] w-[24rem] rounded-full opacity-30 blur-3xl"
          style={{ backgroundImage: CREATOR_GRADIENT }}
        />
        <div
          className="absolute bottom-[-12rem] right-[-10rem] h-[24rem] w-[24rem] rounded-full opacity-20 blur-3xl"
          style={{ backgroundImage: CREATOR_GRADIENT }}
        />
      </div>

      <section className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-[#EFD9CC] bg-[rgba(255,251,247,0.92)] p-5 shadow-[0_24px_80px_rgba(108,54,24,0.12)] backdrop-blur sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4 sm:gap-5">
                {creatorLogoSrc ? (
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/70 shadow-[0_18px_40px_rgba(199,99,49,0.22)] sm:h-28 sm:w-28">
                    <Image
                      src={creatorLogoSrc}
                      alt={creatorLogoAlt}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className="h-24 w-24 shrink-0 rounded-full"
                    style={{ backgroundImage: CREATOR_GRADIENT }}
                  />
                )}

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[#97745D]">
                    Creator collab
                  </p>
                  <h1 className="mt-2 text-4xl font-black lowercase tracking-tight text-[#101010] sm:text-5xl">
                    {creatorHandle}
                  </h1>
                  <p className="mt-2 text-xl font-medium text-[#202020] sm:text-2xl">
                    {creatorCategory}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#5C514B] sm:text-lg">
                    {creatorBio}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:max-w-xs lg:items-end">
                <div className="rounded-2xl border border-[#EFD9CC] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(138,82,43,0.08)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#97745D]">
                    Co-branded with
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    {creatorLogoSrc ? (
                      <Image
                        src={creatorLogoSrc}
                        alt={creatorLogoAlt}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full border border-[#F2DDD1] object-cover"
                      />
                    ) : null}
                    <span className="text-lg font-semibold text-[#B1886F]">×</span>
                    <Image
                      src={BARRELBOOK_LOGO_LARGE}
                      alt="BarrelBook"
                      width={148}
                      height={40}
                      className="h-8 w-auto"
                      priority
                    />
                  </div>
                </div>
                <p className="max-w-xs text-sm leading-6 text-[#6A5950] lg:text-right">
                  Built for distillery trips, bottle shop stops, and travel pours,
                  with BarrelBook handling the tracking behind the scenes.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-[#EFD9CC] bg-white p-6 shadow-[0_14px_34px_rgba(105,62,31,0.08)] sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#97745D]">
                  BarrelBook offer
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#131313] sm:text-4xl">
                  {campaign.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#564B45] sm:text-lg">
                  {campaign.heroBody}
                </p>
              </div>

              <div className="rounded-[28px] border border-[#EFD9CC] bg-[#FFF3EA] p-6 shadow-[0_14px_34px_rgba(105,62,31,0.08)] sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#97745D]">
                  How it works
                </p>
                <p className="mt-4 text-lg leading-8 text-[#2B2521]">
                  Two steps. Get the app, create your account, then come back here
                  to claim the offer.
                </p>
              </div>
            </div>

            <ol className="mt-6 grid gap-4 lg:grid-cols-2">
              <li className="relative overflow-hidden rounded-[28px] border border-[#EFD9CC] bg-white p-6 shadow-[0_16px_40px_rgba(105,62,31,0.08)] sm:p-7">
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundImage: CREATOR_GRADIENT }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white shadow-[0_10px_24px_rgba(199,99,49,0.25)]"
                    style={{ backgroundImage: CREATOR_GRADIENT }}
                  >
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-semibold text-[#171717]">
                      {stepOneTitle}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-7 text-[#5B514A]">
                      {installStepDescription}
                    </p>
                    <a
                      href={campaign.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-white shadow-[0_16px_32px_rgba(199,99,49,0.2)] transition hover:opacity-95"
                      style={{ backgroundImage: CREATOR_GRADIENT }}
                    >
                      {campaign.installLabel}
                    </a>
                  </div>
                </div>
              </li>

              <li className="relative overflow-hidden rounded-[28px] border border-[#EFD9CC] bg-white p-6 shadow-[0_16px_40px_rgba(105,62,31,0.08)] sm:p-7">
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundImage: CREATOR_GRADIENT }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white shadow-[0_10px_24px_rgba(199,99,49,0.25)]"
                    style={{ backgroundImage: CREATOR_GRADIENT }}
                  >
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-semibold text-[#171717]">
                      {stepTwoTitle}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-7 text-[#5B514A]">
                      {redeemStepDescription}
                    </p>
                    <a
                      href={getPromoAppOpenUrl(campaign)}
                      className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-white shadow-[0_16px_32px_rgba(199,99,49,0.2)] transition hover:opacity-95"
                      style={{ backgroundImage: CREATOR_GRADIENT }}
                    >
                      Redeem
                    </a>
                  </div>
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-[28px] border border-[#F0D7CF] bg-[#FFF6F1] p-6 shadow-[0_16px_40px_rgba(105,62,31,0.08)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#97745D]">
                    Manual fallback
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#171717]">
                    {manualFallbackTitle}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#5B514A]">
                    {fallbackDescription}
                  </p>
                </div>
                <CopyCodeButton
                  code={campaign.code}
                  containerClassName="items-start sm:items-end"
                  buttonClassName="border-0 bg-[#1A1A1A] text-white hover:bg-[#111111]"
                  messageClassName="text-[#9F5D32]"
                />
              </div>

              <div className="mt-5 rounded-[24px] border border-[#ECD9CF] bg-white p-5 shadow-[0_12px_28px_rgba(105,62,31,0.06)]">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#97745D]">
                  {campaign.codeLabel}
                </div>
                <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-xl font-semibold tracking-[0.08em] text-[#171717] sm:text-[1.75rem]">
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
