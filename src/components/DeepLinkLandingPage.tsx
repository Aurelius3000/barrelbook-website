import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import AppStoreBadgeLink from "@/components/AppStoreBadgeLink";
import AppStoreRatingLink from "@/components/AppStoreRatingLink";
import HeroVideo from "@/components/HeroVideo";
import PhoneFrame from "@/components/PhoneFrame";
import PricingTeaser from "@/components/PricingTeaser";
import ReviewCard from "@/components/ReviewCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { LandingPageConfig, ScreenshotConfig } from "@/lib/deep-link-landing-pages";

type DeepLinkLandingPageProps = {
  config: LandingPageConfig;
};

function renderPhoneScreenshot(
  screenshot: ScreenshotConfig,
  index: number,
  sizes = "(max-width: 768px) 60vw, 320px",
) {
  return (
    <PhoneFrame
      key={`${screenshot.src}-${index}`}
      ariaLabel={screenshot.alt}
      width={screenshot.width ?? 886}
      height={screenshot.height ?? 1920}
      className={screenshot.className}
    >
      <div className="relative h-full w-full">
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </PhoneFrame>
  );
}

function getMediaGridClass(count: number) {
  switch (count) {
    case 2:
      return "md:grid-cols-2";
    case 3:
      return "md:grid-cols-3";
    default:
      return "md:grid-cols-1";
  }
}

export default function DeepLinkLandingPage({
  config,
}: DeepLinkLandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteHeader
        navItems={[
          { href: `#${config.strip.id}`, label: "How it works" },
          { href: "#pricing", label: "Pricing" },
          { href: "#faq", label: "FAQ" },
        ]}
      />

      <main>
        <section className="relative overflow-hidden pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(210,105,30,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_24%)]"
          />

          <div className="relative max-w-7xl mx-auto">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="text-center lg:col-span-7 lg:text-left">
                <div className="inline-flex items-center rounded-full border border-[#333333] bg-[#1A1A1A] px-4 py-2 mb-6 text-sm text-gray-300">
                  {config.hero.eyebrow}
                </div>

                <h1 className="text-5xl md:text-6xl leading-tight mb-6">
                  {config.hero.title}
                </h1>

                <p className="text-xl text-gray-400 mb-6 max-w-4xl mx-auto lg:mx-0 leading-relaxed">
                  {config.hero.description}
                </p>

                <AppStoreRatingLink className="inline-flex items-center gap-2 mb-6 text-sm text-gray-300 hover:text-white transition-colors" />

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-4">
                  <AppStoreBadgeLink width={180} height={60} priority />
                </div>

                <p className="text-sm text-gray-500">
                  Free to start • No credit card required
                </p>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                {config.hero.media.kind === "video" ? (
                  <HeroVideo
                    src={config.hero.media.src}
                    poster={config.hero.media.poster}
                    ariaLabel={config.hero.media.ariaLabel}
                    width={config.hero.media.width}
                    height={config.hero.media.height}
                    className={config.hero.media.className}
                  />
                ) : (
                  <div className="flex items-end justify-center gap-4">
                    {config.hero.media.screenshots.map((screenshot, index) => {
                      const visibilityClass = screenshot.hideOnMobile ? "hidden sm:block" : "";
                      const className = `${visibilityClass} ${screenshot.className ?? ""}`.trim();

                      return renderPhoneScreenshot(
                        { ...screenshot, className },
                        index,
                        index === 0
                          ? "(max-width: 768px) 66vw, 280px"
                          : "(max-width: 768px) 0px, 220px",
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto rounded-3xl border border-[#333333] bg-[#111111] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D2691E] mb-4">
                  {config.proof.eyebrow}
                </p>
                <h2 className="text-3xl md:text-4xl leading-tight mb-6">
                  {config.proof.title}
                </h2>

                <ul className="space-y-4">
                  {config.proof.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D2691E] mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-300 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ReviewCard review={config.proof.review} featured className="bg-[#0D0D0D]" />
            </div>
          </div>
        </section>

        <section id={config.strip.id} className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D2691E] mb-4">
                {config.strip.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl leading-tight mb-4">
                {config.strip.title}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {config.strip.description}
              </p>
            </div>

            <div className={`grid gap-6 ${getMediaGridClass(config.strip.media.length)} justify-items-center mb-10`}>
              {config.strip.media.map((screenshot, index) =>
                renderPhoneScreenshot(
                  { ...screenshot, className: "w-full max-w-[220px] sm:max-w-[240px]" },
                  index,
                ),
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {config.strip.items.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#333333] bg-[#121212] p-6"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-3 py-1 text-sm font-semibold text-[#D2691E]">
                    {config.strip.variant === "steps" ? `${index + 1}` : "Built for"}
                  </div>
                  <h3 className="text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 max-w-4xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D2691E] mb-4">
                {config.reviews.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl leading-tight mb-4">
                {config.reviews.title}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {config.reviews.description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {config.reviews.items.map((review) => (
                <ReviewCard key={`${review.author}-${review.title}`} review={review} />
              ))}
            </div>
          </div>
        </section>

        <PricingTeaser />

        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl mb-4">Frequently asked questions</h2>
              <p className="text-lg text-gray-400">
                The short version of what collectors usually want to know before they install.
              </p>
            </div>

            <div className="rounded-2xl border border-[#333333] overflow-hidden bg-[#0F0F0F]">
              {config.faqs.map((item) => (
                <details key={item.q} className="group border-b border-[#333333] last:border-b-0">
                  <summary className="list-none cursor-pointer px-6 md:px-8 py-5 md:py-6 flex items-center justify-between gap-6 hover:bg-[#121212]">
                    <span className="text-base md:text-lg">{item.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 md:px-8 pb-6 -mt-2 text-gray-400 text-sm md:text-base leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center rounded-3xl border border-[#333333] bg-[#111111] p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl leading-tight mb-4">
              {config.cta.title}
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              {config.cta.description}
            </p>

            <div className="flex justify-center mb-4">
              <AppStoreBadgeLink width={180} height={60} />
            </div>

            {config.cta.note ? (
              <p className="text-sm text-gray-500">{config.cta.note}</p>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
