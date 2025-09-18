"use client";

import { useState } from "react";
import { Star, Check, Images, BookOpen, TrendingUp, Wine, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");

  const features = [
    {
      title: "Multi‑photo AI scanning",
      description:
        "Capture front, back, and neck. We extract label micro‑text (barrel #, warehouse/floor, batch, yield) and auto‑fill bottle details.",
      icon: <Images className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1627314896599-34ea948a3355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VyYm9uJTIwYm90dGxlJTIwbGFiZWwlMjBjbG9zZSUyMHVwJTIwdGV4dHxlbnwxfHx8fDE3NTY3NDk1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Rich collection management",
      description:
        "Track have/try/want, purchase price, fill‑level, location, duplicates, and custom tags. Filter and sort instantly.",
      icon: <BookOpen className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1707941393234-7f2f8cb024ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VyYm9uJTIwY29sbGVjdGlvbiUyMGludmVudG9yeSUyMHRyYWNraW5nfGVufDF8fHx8MTc1Njc0OTU5MHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "MSRP, Valuation, and other details",
      description:
        "Automatic AI web search for distillery, MSRP, secondary Price and mashbill.",
      icon: <TrendingUp className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1716719215097-a6a640fc3225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aGlza2V5JTIwcHJpY2UlMjBjaGFydCUyMG1hcmtldHxlbnwxfHx8fDE3NTY3NDk1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];
  

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 label scans / month",
        "Owned-bottle library: 50",
        "Basic bottle details",
        "1 image per bottle",
      ],
      monthlyPrice: "$0/mo",
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Starter",
      price: "49",
      period: "year",
      monthlyPrice: "$4.99/mo",
      description: "Great for casual collectors",
      annualUpfrontScans: 120,
      features: [
        "10 label scans / month",
        "Owned-bottle library: 120",
        "Collection tracking",
        "1 image per bottle",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Collector",
      price: "69",
      period: "year",
      monthlyPrice: "$7.99/mo",
      description: "Most popular choice",
      annualUpfrontScans: 360,
      features: [
        "25 label scans / month",
        "Owned-bottle library: 300",
        "Multi-image scans (up to 3)",
        "Advanced bottle details",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Reserve",
      price: "119",
      period: "year",
      monthlyPrice: "$11.99/mo",
      description: "For serious enthusiasts",
      annualUpfrontScans: 600,
      features: [
        "100 label scans / month",
        "Owned-bottle library: Unlimited",
        "Up to 3 images per bottle",
        "Premium features",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Is BarrelBook free?",
      a: "Yes. The Free plan includes 5 label scans per month and an owned-bottle library of up to 50 bottles. Upgrade anytime for higher limits and extra features.",
    },
    {
      q: "How do label scans work?",
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
                <img
                  src="/BarrelBook%20Logo%20Large.png"
                  alt="BarrelBook logo"
                  className="h-full w-auto origin-left scale-[1.125]"
                />
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#download" className="text-gray-300 hover:text-white transition-colors">Download</a>
            </nav>
            <Button className="bg-[#D2691E] hover:bg-[#D2691E]/90 text-white">Download App</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-[#D2691E]" />
              <span className="text-sm text-gray-300">The ultimate bourbon collection app</span>
            </div>

            <h1 className="text-5xl md:text-7xl mb-6">
              Your <span className="text-[#D2691E]">bourbon journey</span> starts here
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Catalog, track, and manage your bourbon collection with precision AI scanning. 
              From rare allocations to daily drams, BarrelBook is your digital bourbon vault.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#" aria-label="Download on the App Store" className="inline-block">
                <img src="/badges/app-store.svg" alt="Download on the App Store" width={180} height={60} />
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div key={index}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1A1A] text-gray-300 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">{feature.description}</p>
                </div>

                <div className={`grid gap-8 ${index === 1 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : index === 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} ${index === 2 ? 'justify-items-center' : ''}`}>
                  {(
                    index === 0
                      ? [
                          "/App%20Scan%20WLW.png",
                          "/App%20Scan%20WLW3.png",
                          "/App%20Scan%20WLW4.png",
                        ]
                      : index === 1
                        ? [
                            "/App%20Scan%20Blantons2.png",
                            "/App%20Scan%20Blantons3.png",
                            "/App%20Scan%20Blantons4.png",
                            "/App%20Scan%20Blantons5.png",
                          ]
                        : index === 2
                          ? ["/Catalog1.png", "/Blantons%20Details.png", "/Blantons%20Tasting.png"]
                        : [feature.image, feature.image, feature.image]
                  ).map((src, i) => (
                    <figure key={i} className={`rounded-2xl overflow-hidden bg-[#0A0A0A] ${index === 2 ? 'mx-auto w-full max-w-[360px]' : ''}`}>
                      <div className={`${(index === 0 || index === 1 || index === 2) ? 'aspect-[9/19]' : 'aspect-[4/5]'} bg-black` }>
                        <ImageWithFallback
                          src={src}
                          alt={`${feature.title} screenshot ${i + 1}`}
                          className={`w-full h-full ${(index === 0 || index === 1 || index === 2) ? 'object-contain object-center' : 'object-cover'}`}
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Stats Section removed */}

      {/* Pricing Section */}
      <section id="pricing" className="pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">
              Choose your <span className="text-[#D2691E]">proof</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Start free and upgrade as your collection grows.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <ul className="space-y-3 mb-6">
                  {(() => {
                    const displayedFeatures = (billingCycle === "yearly" && (plan as any).annualUpfrontScans)
                      ? [
                          `Includes ${(plan as any).annualUpfrontScans.toLocaleString()} upfront scans`,
                          ...plan.features.filter((f: string) => !/label\s*scans/i.test(f)),
                        ]
                      : plan.features;
                    return displayedFeatures.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D2691E] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ));
                  })()}
                </ul>

                {/* CTA removed per request */}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              All plans include free updates and market data access. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Loved by bourbon enthusiasts</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "BarrelBook has completely transformed how I track my collection. The multi-angle scanning 
                captures every detail, and the valuation data helps me make smart trading decisions."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D2691E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">MH</span>
                </div>
                <div>
                  <div className="text-white text-sm">Mike H.</div>
                  <div className="text-gray-400 text-xs">Collector since 2018</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "As a bourbon blogger, BarrelBook is essential. The detailed bottle information and 
                private rating system help me write better reviews and track my tasting journey."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D2691E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">SJ</span>
                </div>
                <div>
                  <div className="text-white text-sm">Sarah J.</div>
                  <div className="text-gray-400 text-xs">Bourbon Blogger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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

      {/* Download CTA */}
      <section id="download" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Ready to elevate your <span className="text-[#D2691E]">bourbon experience</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of collectors who trust BarrelBook to manage their bourbon investments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 items-center">
            <a href="#" aria-label="Download on the App Store" className="inline-block">
              <img src="/badges/app-store.svg" alt="Download on the App Store" width={180} height={60} />
            </a>
          </div>

          <p className="text-sm text-gray-500">Available on iPhone and iPad</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] border-t border-[#333333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="relative flex items-center mb-4 md:mb-0 overflow-visible">
              <div className="h-8 md:h-10 lg:h-12">
                <img
                  src="/BarrelBook%20Logo%20Large.png"
                  alt="BarrelBook logo"
                  className="h-full w-auto origin-left scale-[1.125]"
                />
              </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

          <div className="border-t border-[#333333] mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 BarrelBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type Plan = {
  name: string;
  price: string; // yearly price number as string (except Free)
  period: string; // 'year' | 'forever'
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  monthlyPrice?: string; // formatted monthly string, e.g. "$4.08/mo"
  annualUpfrontScans?: number;
};

function PriceBlock({ plan, billingCycle }: { plan: Plan; billingCycle: "yearly" | "monthly" }) {
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


