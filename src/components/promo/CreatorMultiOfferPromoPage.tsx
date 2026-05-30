import Image from "next/image";
import {
  ArrowRight,
  BadgePercent,
  Camera,
  ChevronDown,
  Download,
  MapPin,
  Route,
} from "lucide-react";
import {
  getPromoOfferAppOpenUrl,
  type PromoCampaignConfig,
  type PromoCampaignOfferConfig,
} from "@/lib/promo-campaigns";
import { CopyCodeButton } from "@/components/promo/CopyCodeButton";
import HeroVideo from "@/components/HeroVideo";

interface CreatorMultiOfferPromoPageProps {
  campaign: PromoCampaignConfig;
}

const BARRELBOOK_LOGO_LARGE = "/BarrelBook%20Logo%20Large.png";
const GOLD_BORDER = "border-[#8E6C2B]/65";

function BlackGoldOfferCard({ offer }: { offer: PromoCampaignOfferConfig }) {
  return (
    <article className="relative flex min-h-[21rem] flex-col justify-between overflow-hidden rounded-lg border border-[#8E6C2B]/60 bg-[#17130D] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.26)]">
      <div className="pointer-events-none absolute inset-x-4 top-4 h-px bg-[#D7B96A]/55" />
      <div className="pointer-events-none absolute inset-y-4 left-4 w-px bg-[#D7B96A]/35" />
      <div className="pointer-events-none absolute inset-y-4 right-4 w-px bg-[#D7B96A]/35" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 h-px bg-[#D7B96A]/55" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D7B96A]/45 bg-[#251D10] px-3 py-1 text-xs font-semibold uppercase text-[#E7D08B]">
          <BadgePercent className="h-3.5 w-3.5" />
          Creator price
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-normal text-[#FFF7DF]">
          {offer.planName}
        </h2>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base text-[#AFA07D] line-through">
            {offer.normalPrice}
          </span>
          <span className="text-3xl font-bold tracking-normal text-[#F3D27B]">
            {offer.offerPrice}
          </span>
        </div>
        <p className="mt-4 text-base leading-7 text-[#D7C8A7]">
          {offer.firstYearCopy}
        </p>
      </div>

      <a
        href={getPromoOfferAppOpenUrl(offer)}
        className="relative mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D7B96A] px-5 py-3 text-base font-semibold text-[#11100B] transition hover:bg-[#F0D582]"
      >
        {offer.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

function BourbonTrailOfferCard({
  offer,
}: {
  offer: PromoCampaignOfferConfig;
}) {
  return (
    <article className="relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-lg border border-[#F3D1C0] bg-white p-6 shadow-[0_18px_42px_rgba(91,50,18,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F24E72] via-[#FF7647] to-[#F2A51E]" />

      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold uppercase text-[#A94420]">
          <BadgePercent className="h-3.5 w-3.5" />
          thebourbontrail price
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-normal text-[#17171B]">
          {offer.planName}
        </h2>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base text-[#81776E] line-through">
            {offer.normalPrice}
          </span>
          <span className="text-3xl font-bold tracking-normal text-[#D4522F]">
            {offer.offerPrice}
          </span>
        </div>
        <p className="mt-4 text-base leading-7 text-[#5F554D]">
          {offer.firstYearCopy}
        </p>
      </div>

      <a
        href={getPromoOfferAppOpenUrl(offer)}
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F24E72] via-[#FF7647] to-[#F2A51E] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_28px_rgba(210,82,47,0.24)] transition hover:opacity-95"
      >
        {offer.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

function BlackGoldMultiOfferPage({ campaign }: CreatorMultiOfferPromoPageProps) {
  const branding = campaign.creatorCollab;
  const offers = campaign.offers ?? [];
  const creatorLogoSrc = branding?.logoSrc;
  const creatorLogoAlt = branding?.logoAlt ?? "Creator logo";
  const collaborationTitle = `${branding?.eyebrow ?? "Creator"} x BarrelBook`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#0D0B08] text-[#FFF7DF]">
      <section className="relative border-b border-[#8E6C2B]/35 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-4">
                {creatorLogoSrc ? (
                  <Image
                    src={creatorLogoSrc}
                    alt={creatorLogoAlt}
                    width={88}
                    height={88}
                    className="h-20 w-20 rounded-full border border-[#D7B96A]/55 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24"
                    priority
                  />
                ) : null}
                <div className="h-px w-8 bg-[#D7B96A]/70" />
                <Image
                  src={BARRELBOOK_LOGO_LARGE}
                  alt="BarrelBook"
                  width={172}
                  height={46}
                  className="h-9 w-auto rounded bg-[#FFF7DF] px-3 py-1.5"
                  priority
                />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#D7B96A]">
                {collaborationTitle}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-[#FFF7DF] sm:text-5xl lg:text-6xl">
                {campaign.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#D7C8A7]">
                {campaign.subtitle}
              </p>
            </div>

            <div className={`rounded-lg border ${GOLD_BORDER} bg-[#17130D] p-5 lg:max-w-sm`}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#D7B96A]">
                How to claim
              </p>
              <ol className="mt-4 space-y-4 text-base leading-7 text-[#E6D8B8]">
                <li>
                  <span className="font-semibold text-[#FFF7DF]">1.</span>{" "}
                  Download BarrelBook and create or sign in to your account.
                </li>
                <li>
                  <span className="font-semibold text-[#FFF7DF]">2.</span>{" "}
                  Return here and choose Plus Annual or Pro Annual.
                </li>
              </ol>
              <a
                href={campaign.installUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D7B96A]/60 px-5 py-3 text-base font-semibold text-[#FFF7DF] transition hover:border-[#F0D582] hover:text-[#F0D582]"
              >
                <Download className="h-4 w-4" />
                {campaign.installLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {offers.map((offer) => (
              <BlackGoldOfferCard key={offer.appSlug} offer={offer} />
            ))}
          </div>

          <details
            className={`group mt-7 rounded-lg border ${GOLD_BORDER} bg-[#120F0A]`}
            data-testid="creator-multi-offer-manual-fallback"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden sm:px-6">
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-[#D7B96A]">
                  Manual fallback
                </span>
                <span className="mt-1 block text-base text-[#D7C8A7]">
                  Use these only if the claim buttons do not open the matching
                  offer in BarrelBook.
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#D7B96A] transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-[#8E6C2B]/45 px-5 py-5 sm:px-6">
              <p className="max-w-3xl text-base leading-7 text-[#D7C8A7]">
                Open BarrelBook manually, go to Settings, tap Redeem App Store
                Code, then enter the code for the annual plan you want.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {offers.map((offer) => (
                  <div
                    key={offer.code}
                    className="rounded-lg border border-[#8E6C2B]/45 bg-[#19140D] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D7B96A]">
                      {offer.codeLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#C9B98F]">
                      {offer.fallbackLabel}
                    </p>
                    <code className="mt-4 block overflow-x-auto whitespace-nowrap font-mono text-xl font-semibold tracking-normal text-[#FFF7DF]">
                      {offer.code}
                    </code>
                    <CopyCodeButton
                      code={offer.code}
                      containerClassName="mt-4 items-start"
                      buttonClassName="bg-[#D7B96A] text-[#11100B] hover:bg-[#F0D582]"
                      messageClassName="text-[#F0D582]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

function BourbonTrailMultiOfferPage({
  campaign,
}: CreatorMultiOfferPromoPageProps) {
  const branding = campaign.creatorCollab;
  const offers = campaign.offers ?? [];
  const creatorLogoSrc = branding?.logoSrc;
  const creatorLogoAlt = branding?.logoAlt ?? "The Bourbon Trail logo";
  const collaborationTitle = `${branding?.eyebrow ?? "thebourbontrail"} x BarrelBook`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFDF8] text-[#17171B]">
      <section className="relative px-4 pb-8 pt-9 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#F24E72] via-[#FF7647] to-[#F2A51E]" />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.8fr)] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                {creatorLogoSrc ? (
                  <div className="rounded-full bg-gradient-to-br from-[#F24E72] via-[#FF7647] to-[#F2A51E] p-1">
                    <Image
                      src={creatorLogoSrc}
                      alt={creatorLogoAlt}
                      width={96}
                      height={96}
                      className="h-20 w-20 rounded-full border-4 border-[#FFFDF8] object-cover sm:h-24 sm:w-24"
                      priority
                    />
                  </div>
                ) : null}
                <div className="h-px w-8 bg-[#E6B388]" />
                <Image
                  src={BARRELBOOK_LOGO_LARGE}
                  alt="BarrelBook"
                  width={172}
                  height={46}
                  className="h-9 w-auto rounded-lg border border-[#F1D1BD] bg-white px-3 py-1.5 shadow-sm"
                  priority
                />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C54E2B]">
                {collaborationTitle}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-[#17171B] sm:text-5xl lg:text-6xl">
                {campaign.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5F554D]">
                {campaign.subtitle}
              </p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#6D625A]">
                {campaign.heroBody}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#F1C6AF] bg-white px-3 py-2 text-sm font-semibold text-[#82401F]">
                  <Route className="h-4 w-4 text-[#F24E72]" />
                  On the Trail
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#F1C6AF] bg-white px-3 py-2 text-sm font-semibold text-[#82401F]">
                  <Camera className="h-4 w-4 text-[#FF7647]" />
                  Finds
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#F1C6AF] bg-white px-3 py-2 text-sm font-semibold text-[#82401F]">
                  <MapPin className="h-4 w-4 text-[#F2A51E]" />
                  Kentucky distilleries
                </span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroVideo
                src="/videos/bottle-scanning.mp4"
                poster="/video-posters/bottle-scanning.jpg"
                ariaLabel="Scanning a bourbon bottle label with the BarrelBook app"
                width={886}
                height={1920}
                className="w-full max-w-[13.5rem] sm:max-w-[15.5rem] lg:max-w-[17rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#F3D1C0] bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-3 text-sm leading-6 text-[#5F554D] sm:grid-cols-2">
            <div>
              <p className="font-semibold text-[#17171B]">
                1. Download BarrelBook
              </p>
              <p>Create or sign in to your account.</p>
            </div>
            <div>
              <p className="font-semibold text-[#17171B]">
                2. Choose an annual plan
              </p>
              <p>Use the Plus or Pro claim button below.</p>
            </div>
          </div>
          <a
            href={campaign.installUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#D4522F] px-5 py-3 text-base font-semibold text-[#B24824] transition hover:bg-[#FFF1E8]"
          >
            <Download className="h-4 w-4" />
            {campaign.installLabel}
          </a>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {offers.map((offer) => (
              <BourbonTrailOfferCard key={offer.appSlug} offer={offer} />
            ))}
          </div>

          <details
            className="group mt-7 rounded-lg border border-[#F3D1C0] bg-white shadow-[0_14px_32px_rgba(91,50,18,0.08)]"
            data-testid="creator-multi-offer-manual-fallback"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden sm:px-6">
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#C54E2B]">
                  Manual fallback
                </span>
                <span className="mt-1 block text-base text-[#6D625A]">
                  Use these only if the claim buttons do not open the matching
                  offer in BarrelBook.
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#D4522F] transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-[#F3D1C0] px-5 py-5 sm:px-6">
              <p className="max-w-3xl text-base leading-7 text-[#5F554D]">
                Open BarrelBook manually, go to Settings, tap Redeem App Store
                Code, then enter the code for the annual plan you want.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {offers.map((offer) => (
                  <div
                    key={offer.code}
                    className="rounded-lg border border-[#F3D1C0] bg-[#FFF8F2] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C54E2B]">
                      {offer.codeLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6D625A]">
                      {offer.fallbackLabel}
                    </p>
                    <code className="mt-4 block overflow-x-auto whitespace-nowrap font-mono text-xl font-semibold tracking-normal text-[#17171B]">
                      {offer.code}
                    </code>
                    <CopyCodeButton
                      code={offer.code}
                      containerClassName="mt-4 items-start"
                      buttonClassName="bg-[#D4522F] text-white hover:bg-[#B24824]"
                      messageClassName="text-[#B24824]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

export default function CreatorMultiOfferPromoPage({
  campaign,
}: CreatorMultiOfferPromoPageProps) {
  if (campaign.creatorCollab?.theme === "bourbon-trail") {
    return <BourbonTrailMultiOfferPage campaign={campaign} />;
  }

  return <BlackGoldMultiOfferPage campaign={campaign} />;
}
