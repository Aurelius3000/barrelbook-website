"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { Star, Check, Images, BookOpen, ChevronDown, Instagram, Twitter, Facebook, Camera, MapPin, Share2, Wine, Sparkles } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import HeroVideo from "@/components/HeroVideo";
import StoryVideo from "@/components/StoryVideo";
import {
  APP_STORE_RATING_COUNT,
  APP_STORE_URL,
} from "@/lib/app-store";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");

  type StorySection = {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
    // Image-story fields. `columns` optionally overrides the default
    // `grid-cols-1 sm:grid-cols-2` — sections with 3 screenshots set it to
    // `grid-cols-1 sm:grid-cols-3` (TWEAK-002/003).
    screenshots?: string[];
    columns?: string;
    // Video-story fields (WEB-009, WEB-010, TWEAK-005)
    video?: {
      src: string;
      poster: string;
      ariaLabel: string;
      width: number;
      height: number;
    };
  };

  const storySections: StorySection[] = [
    {
      id: "scan",
      title: "Snap a photo. BarrelBook handles the details.",
      description:
        "Take up to three photos of a bottle and BarrelBook builds a detailed record for you — including the information collectors actually care about, from proof and size to pricing and bottle-specific details.",
      icon: <Images className="w-6 h-6" />,
      screenshots: [
        "/App%20Scan%20WLW.png",
        "/App%20Scan%20WLW3.png",
        "/App%20Scan%20WLW4.png",
      ],
      columns: "grid-cols-1 sm:grid-cols-3",
    },
    {
      id: "collection",
      title: "Know exactly what you have.",
      description:
        "Track your bottles, notes, ratings, fill level, status, tags, pricing, and more — all in one place. Whether you’re managing a growing bunker, organizing your shelf, or keeping records for insurance, BarrelBook makes your collection easier to understand and maintain.",
      icon: <BookOpen className="w-6 h-6" />,
      screenshots: [
        "/App%20Scan%20Blantons2.png",
        "/App%20Scan%20Blantons3.png",
        "/App%20Scan%20Blantons4.png",
      ],
      columns: "grid-cols-1 sm:grid-cols-3",
    },
    {
      id: "tonights-pour",
      title: "Tonight’s Pour, picked for you.",
      description:
        "Stuck between three bottles at 9 PM? Tonight’s Pour picks one from your own shelf — based on mood, occasion, or a fair rotation. Less decision fatigue, more drinking.",
      icon: <Wine className="w-6 h-6" />,
      video: {
        src: "/videos/pick-a-pour.mp4",
        poster: "/video-posters/pick-a-pour.jpg",
        ariaLabel: "BarrelBook suggesting a bottle to pour tonight",
        width: 886,
        height: 1920,
      },
    },
    {
      // TWEAK-005: Share section now leads with the SharedShelves product
      // video. Copy is the condensed (mobile-safe) version of the Shared
      // Shelves page copy — longer feature blocks live on a future
      // /shared-shelves page.
      id: "share",
      title: "Share the shelf worth showing off.",
      description:
        "Build your shelf in private, publish when you’re ready, and let friends browse the bottles that define your collection.",
      icon: <Share2 className="w-6 h-6" />,
      video: {
        src: "/videos/shared-shelves.mp4",
        poster: "/video-posters/shared-shelves.jpg",
        ariaLabel: "Publishing a shared shelf of bourbon bottles to friends inside BarrelBook",
        width: 1080,
        height: 2336,
      },
    },
    {
      id: "spotlight-flights",
      title: "Spotlight bottles and tasting flights.",
      description:
        "Curate the bottles that deserve a second look. Build spotlight features for your favorites and plan tasting flights to share with friends or work through on a quiet night at home.",
      icon: <Sparkles className="w-6 h-6" />,
      video: {
        src: "/videos/spotlight-and-flights.mp4",
        poster: "/video-posters/spotlight-flights.jpg",
        ariaLabel: "Spotlight bottles and tasting flights inside BarrelBook",
        width: 1080,
        height: 2336,
      },
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "10-bottle library",
        "Full AI-powered recognition",
        "Up to 3 images per bottle",
      ],
      monthlyPrice: "$0/mo",
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Plus",
      price: "49",
      period: "year",
      monthlyPrice: "$4.99/mo",
      description: "Great for growing collections",
      inheritsFrom: "Free",
      features: [
        "100-bottle library",
        "Enhanced AI recognition",
        "Market pricing data",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "99",
      period: "year",
      monthlyPrice: "$9.99/mo",
      description: "For serious enthusiasts",
      inheritsFrom: "Plus",
      features: [
        "**Unlimited bottles**",
        "**Best AI recognition**",
        "Priority processing",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
  ];

  const faqs = [
    {
      q: "Is BarrelBook free?",
      a: "Yes. The Free plan includes a 10-bottle library with full AI-powered recognition. Upgrade anytime to Plus or Pro for larger libraries and extra features.",
    },
    {
      q: "How does AI recognition work?",
      a: "Open the app, take up to three photos of the label, and our AI extracts micro‑details to auto‑fill bottle info. Multi‑angle photos improve recognition accuracy.",
    },
    {
      q: "What information can BarrelBook capture?",
      a: "Typical fields include producer, expression, barrel/batch identifiers, proof, finish, and other label micro‑text—plus your own tags and notes.",
    },
    {
      q: "Can I rate bottles and add tasting notes?",
      a: "Yes. Add private ratings and tasting notes with tags. Share later if you choose when social features become available.",
    },
    {
      q: "Which devices are supported?",
      a: "BarrelBook is available on iPhone and iPad. Download from the App Store to get started.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="relative flex items-center overflow-visible">
              <div className="h-8 md:h-10 lg:h-12">
                <Image
                  src="/BarrelBook%20Logo%20Large.png"
                  alt="BarrelBook logo"
                  width={280}
                  height={96}
                  className="h-full w-auto origin-left scale-[1.125]"
                  priority
                />
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#download" className="text-gray-300 hover:text-white transition-colors">Download</a>
            </nav>
            <a
              href="https://apps.apple.com/us/app/barrelbook-whiskey-catalog/id6751737898"
              aria-label="Download on the App Store"
              className="inline-flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/badges/app-store.svg"
                alt="Download on the App Store"
                width={140}
                height={46}
                className="h-9 w-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Text column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-[#D2691E]" />
                <span className="text-sm text-gray-300">Whiskey collection app</span>
              </div>

              <h1 className="text-5xl md:text-7xl leading-tight mb-6">
                Your whiskey shelf, <span className="text-[#D2691E]">in your pocket.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                BarrelBook captures the details bourbon collectors care about — store picks, barrel numbers, batches — straight from a photo. No barcodes, no typing, no spreadsheets.
              </p>

              {/* WEB-005: Social proof from the current App Store listing. */}
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${APP_STORE_RATING_COUNT} five-star App Store reviews`}
                className="inline-flex items-center gap-2 mb-6 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
                  ))}
                </span>
                <span>
                  <span className="font-semibold text-white">{APP_STORE_RATING_COUNT}</span> five-star ratings on the App Store
                </span>
              </a>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-6">
                <a
                  href={APP_STORE_URL}
                  aria-label="Download on the App Store"
                  className="inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src="/badges/app-store.svg" alt="Download on the App Store" width={180} height={60} priority />
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-gray-400">
                <span className="rounded-full border border-[#333333] bg-[#111111] px-3 py-1">Snap a photo, not a barcode</span>
                <span className="rounded-full border border-[#333333] bg-[#111111] px-3 py-1">Built for bourbon bottle details</span>
                <span className="rounded-full border border-[#333333] bg-[#111111] px-3 py-1">Your collection always with you</span>
                <span className="rounded-full border border-[#333333] bg-[#111111] px-3 py-1">Share a shelf worth showing</span>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Free to start • No credit card required
              </p>
            </div>

            {/* Video column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HeroVideo
                src="/videos/bottle-scanning.mp4"
                poster="/video-posters/bottle-scanning.jpg"
                ariaLabel="Scanning a bourbon bottle label with the BarrelBook app"
                width={886}
                height={1920}
                className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Story Sections */}
      <section id="how-it-works" className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-20">
            {storySections.map((section) => (
              <div key={section.id}>
                <div className="text-center mb-8 max-w-5xl mx-auto">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1A1A] text-gray-300 mb-3">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl mb-3">{section.title}</h3>
                  <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">{section.description}</p>
                </div>

                {/* Media: either a single product video (WEB-009, WEB-010) or a grid of screenshots */}
                {section.video ? (
                  <StoryVideo
                    src={section.video.src}
                    poster={section.video.poster}
                    ariaLabel={section.video.ariaLabel}
                    width={section.video.width}
                    height={section.video.height}
                  />
                ) : section.screenshots ? (
                  // TWEAK-001: screenshots render in a plain rounded container
                  // (no PhoneFrame — the source images are already app
                  // screenshots, so wrapping in a silhouette felt redundant).
                  // Column count is driven per-section via `section.columns`.
                  <div className={`grid gap-8 ${section.columns ?? 'grid-cols-1 sm:grid-cols-2'} justify-items-center`}>
                    {section.screenshots.map((src, i) => (
                      <figure
                        key={i}
                        className="w-full max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden border border-[#1f1f1f] bg-black"
                      >
                        <div className="aspect-[9/19] bg-black">
                          <ImageWithFallback
                            src={src}
                            alt={`${section.title} screenshot ${i + 1}`}
                            className="w-full h-full object-contain object-center"
                          />
                        </div>
                      </figure>
                    ))}
                  </div>
                ) : null}

                {section.id === 'scan' && (
                  <div className="mt-20 rounded-3xl border border-[#333333] bg-[#121212] p-8 md:p-10">
                    <div className="max-w-5xl mx-auto text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1A1A1A] text-[#D2691E] mb-4">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl md:text-3xl mb-4">Built for the details bourbon collectors care about.</h3>
                      <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-6 leading-relaxed">
                        Generic whiskey apps can struggle when bottles get more specific. BarrelBook is especially useful for bourbon collectors tracking store picks, barrel numbers, batch-specific details, warehouse and floor information, mash bill, and pricing.
                      </p>
                      <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
                        <span className="rounded-full border border-[#333333] bg-[#0A0A0A] px-3 py-1">Store picks</span>
                        <span className="rounded-full border border-[#333333] bg-[#0A0A0A] px-3 py-1">Barrel numbers</span>
                        <span className="rounded-full border border-[#333333] bg-[#0A0A0A] px-3 py-1">Batch details</span>
                        <span className="rounded-full border border-[#333333] bg-[#0A0A0A] px-3 py-1">Warehouse & floor</span>
                        <span className="rounded-full border border-[#333333] bg-[#0A0A0A] px-3 py-1">Mash bill & pricing</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-5">When bourbon bottles get complicated, BarrelBook stays useful.</p>
                    </div>
                  </div>
                )}

                {section.id === 'collection' && (
                  <div className="mt-20 rounded-3xl border border-[#333333] bg-[#121212] p-8 md:p-10">
                    <div className="max-w-5xl mx-auto text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1A1A1A] text-[#D2691E] mb-4">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl md:text-3xl mb-4">Your collection goes wherever you go.</h3>
                      <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-4 leading-relaxed">
                        Keep bottle photos and details with you at the store, at tastings, at bars, or with friends. BarrelBook gives you a portable digital shelf, so you always know what you own and what’s worth opening, buying, or sharing.
                      </p>
                      <p className="text-sm text-gray-500">Your bottles don’t have to stay trapped on a shelf at home.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-5xl mx-auto">
            <h2 className="text-3xl mb-4">Built for collectors who want more than a spreadsheet.</h2>
            <p className="text-gray-400 max-w-4xl mx-auto leading-relaxed">Real feedback from whiskey collectors using BarrelBook to track bottles, capture the details that matter, and keep their shelves close at hand.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Best Bourbon tracking App",
                text: "BarrelBook has rapidly become one of my favorite apps. The ability to scan labels and instantly catalog bottles is a game changer. Tracking prices, locations, and personal notes makes managing a collection effortless. Highly recommend for any bourbon enthusiast!",
                author: "MrWCBrown",
                date: "Feb 4, 2026",
                version: "1.3",
              },
              {
                title: "An interesting concept that works great!",
                text: "I love the idea of this app as it lets you keep track of what you have. What I thought was cool is that you could see how much bottles are worth on the secondary market compared to what I paid at MSRP. Highly recommend!",
                author: "Drbourbondvm",
                date: "Feb 1, 2026",
                version: "1.3",
              },
              {
                title: "Best app for Bourbon Inventory",
                text: "Simple and easy to use. Snap a photo and your bourbon is added to your collection! Gives MSRP, secondary market prices, proof and so much more. If you want to keep track of your collection, this is the one.",
                author: "RD24/7$",
                date: "Jan 25, 2026",
                version: "1.2",
              },
              {
                title: "Awesome app!",
                text: "Perfect for keeping track of a bourbon collection! It pulls all the details just from scanning the bottle. Very user-friendly and great for anyone who loves bourbon.",
                author: "amylynns4",
                date: "Dec 20, 2025",
                version: "1.1",
              },
              {
                title: "Great App for Bottle Inventory, Pricing, and Accuracy!",
                text: "Incredibly easy to use. The AI captures detailed bottle info from photos accurately. Market pricing data is a fantastic bonus. Clean interface makes managing a growing collection effortless.",
                author: "WallyWorld34",
                date: "Feb 4, 2026",
                version: "1.3",
              },
              {
                title: "Excel not Needed",
                text: "Finally, no more spreadsheets! BarrelBook scans your bottles and tracks everything—prices, proof, barrel numbers—all in one clean app. A must-have for bourbon collectors.",
                author: "AtlantaUnited17",
                date: "Feb 1, 2026",
                version: "1.3",
              },
              {
                title: "The first app that actually handles store picks",
                text: "I've tried other whiskey apps and none of them handle store picks or barrel selections well. BarrelBook nails it—scans the label, picks up the barrel number, batch info, and even the store name. Finally an app built for how bourbon actually works.",
                author: "Aurelius3000",
                date: "Dec 20, 2025",
                version: "1.1",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-6 flex flex-col"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
                  ))}
                </div>
                <h4 className="text-white font-semibold text-base mb-2">{review.title}</h4>
                <p className="text-gray-300 text-base mb-4 flex-1">{review.text}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{review.author}</span>
                  <span>{review.date} · v{review.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6 leading-tight">
              Start free. <span className="text-[#D2691E]">Upgrade when your collection grows.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Get started with BarrelBook for free, then unlock more power as your collection expands. Whether you’re cataloging a few favorites or managing a serious shelf, there’s a plan that fits.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-[#1A1A1A] border border-[#333333] rounded-full p-1">
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  billingCycle === "yearly" ? 'bg-[#D2691E] text-white' : 'text-gray-300'
                }`}
              >
                Yearly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  billingCycle === "monthly" ? 'bg-[#D2691E] text-white' : 'text-gray-300'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-6 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#D2691E]/20 to-[#C97C3A]/20 border-2 border-[#D2691E]'
                    : 'bg-[#1A1A1A] border border-[#333333]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#D2691E] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl mb-2">{plan.name}</h3>
                  <PriceBlock plan={plan} billingCycle={billingCycle} />
                  <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                </div>

                {plan.inheritsFrom && (
                  <p className="text-sm text-gray-400 mb-3">
                    Everything in <span className="text-white font-medium">{plan.inheritsFrom}</span>, plus:
                  </p>
                )}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature: string, featureIndex: number) => {
                    const isBold = feature.startsWith("**") && feature.endsWith("**");
                    const label = isBold ? feature.slice(2, -2) : feature;
                    return (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D2691E] mt-0.5 flex-shrink-0" />
                        <span className={`text-sm ${isBold ? 'text-white font-semibold' : 'text-gray-300'}`}>{label}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* WEB-002: per-plan CTA button — all tiers currently route to the App Store */}
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${plan.cta} — ${plan.name} plan`}
                  className={`block w-full text-center rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2691E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${
                    plan.popular
                      ? 'bg-[#D2691E] text-white hover:bg-[#C05E17]'
                      : 'bg-[#0A0A0A] border border-[#333333] text-white hover:border-[#D2691E]'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              All plans include free updates and market data access. Start free and upgrade only when your shelf grows.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-8 text-center">Frequently asked questions</h2>

          <div className="rounded-2xl border border-[#333333] overflow-hidden bg-[#0F0F0F]">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className={`border-b border-[#333333] last:border-b-0`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 md:px-8 py-5 md:py-6 flex items-center justify-between gap-6 hover:bg-[#121212]"
                  >
                    <span className="text-base md:text-lg">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 md:px-8 pb-6 -mt-2 text-gray-400 text-sm md:text-base">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Note */}
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="max-w-5xl mx-auto text-center text-gray-400 text-sm">
          For help or support, send an email to <a href="mailto:support@barrelbook.app" className="underline hover:text-white">support@barrelbook.app</a>
        </p>
      </div>

      {/* Download CTA */}
      <section id="download" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl leading-tight mb-6">
            Build your digital <span className="text-[#D2691E]">whiskey shelf</span> today.
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
            Capture bottles, organize your collection, and keep your shelf with you wherever you go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 items-center">
              <a
                href={APP_STORE_URL}
                aria-label="Download on the App Store"
                className="inline-block"
                target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/badges/app-store.svg" alt="Download on the App Store" width={180} height={60} />
            </a>
          </div>

          <p className="text-sm text-gray-500">Available on iPhone and iPad today. Android is on the roadmap.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] border-t border-[#333333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="relative flex items-center mb-4 md:mb-0 overflow-visible">
              <div className="h-8 md:h-10 lg:h-12">
                <Image
                  src="/BarrelBook%20Logo%20Large.png"
                  alt="BarrelBook logo"
                  width={280}
                  height={96}
                  className="h-full w-auto origin-left scale-[1.125]"
                />
              </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-6">
            <div className="flex items-center gap-5 text-gray-400">
              <a
                href="https://www.instagram.com/barrelbook_app/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/barrelbook_app"
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/19tKbWea4A/?mibextid=wwXIfr"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="border-t border-[#333333] mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025–{new Date().getFullYear()} BarrelBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  monthlyPrice?: string;
  /** WEB-011: name of the tier whose features this plan inherits. Rendered
   *  as "Everything in <inheritsFrom>, plus:" above the delta feature list. */
  inheritsFrom?: string;
};

function PriceBlock({ plan, billingCycle }: { plan: Plan; billingCycle: "yearly" | "monthly" }) {
  // Free plan uses period === "forever" as a sentinel. The `!isForever` checks
  // below intentionally suppress billing-frequency subcopy ("Billed monthly" /
  // "$X/mo effective") for the free tier, since neither applies to $0.
  const isForever = plan.period === "forever";
  if (billingCycle === "monthly") {
    return (
      <div>
        <div className="text-3xl mb-1">
          {plan.monthlyPrice ? plan.monthlyPrice.replace("/mo", "") : "$0"}
          <span className="text-lg text-gray-400">/mo</span>
        </div>
        {!isForever && (
          <div className="text-xs text-gray-500">Billed monthly</div>
        )}
      </div>
    );
  }
  // yearly view (actual plans)
  return (
    <div>
      <div className="text-3xl mb-1">
        ${plan.price}
        <span className="text-lg text-gray-400">/{plan.period}</span>
      </div>
      {!isForever && (
        <div className="text-sm text-gray-400">
          ${ (Number(plan.price) / 12).toFixed(2) }/mo effective
        </div>
      )}
    </div>
  );
}
