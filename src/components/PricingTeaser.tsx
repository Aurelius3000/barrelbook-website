import AppStoreBadgeLink from "@/components/AppStoreBadgeLink";

const PLANS = [
  {
    name: "Free",
    price: "Free",
    detail: "10 bottles",
    description: "Start scanning and organizing your shelf with no credit card required.",
  },
  {
    name: "Plus",
    price: "$49/yr",
    detail: "100 bottles",
    description: "More room for a growing collection, plus enhanced recognition and pricing data.",
  },
  {
    name: "Pro",
    price: "$99/yr",
    detail: "Unlimited bottles",
    description: "For serious shelves that need the strongest recognition and the most headroom.",
  },
] as const;

export default function PricingTeaser() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D2691E] mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl leading-tight mb-4">
            Free to start. Upgrade when your shelf grows.
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Start with 10 bottles for free. Move to Plus at $49/year or Pro at $99/year when you need more space and more power.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.name === "Pro"
                  ? "border-[#D2691E] bg-gradient-to-br from-[#D2691E]/15 to-[#0A0A0A]"
                  : "border-[#333333] bg-[#111111]"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-400 mb-4">
                {plan.name}
              </p>
              <div className="mb-4">
                <p className="text-3xl text-white mb-1">{plan.price}</p>
                <p className="text-sm text-[#D2691E]">{plan.detail}</p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{plan.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <AppStoreBadgeLink width={180} height={60} />
          <p className="text-sm text-gray-500">
            Available on iPhone and iPad. Android is on the roadmap.
          </p>
        </div>
      </div>
    </section>
  );
}
