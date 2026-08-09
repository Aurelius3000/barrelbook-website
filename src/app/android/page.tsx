import type { Metadata } from "next";
import AndroidInterestForm from "@/components/AndroidInterestForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Android Early Access",
  description:
    "Join the BarrelBook Android early-access list and hear when the whiskey collection app is ready.",
};

export default function AndroidPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteHeader showAppStoreBadge={false} />
      <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#333333] bg-[#121212] p-6 sm:p-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#D2691E]">
            Android early access
          </p>
          <h1 className="mb-5 text-4xl leading-tight sm:text-5xl">
            BarrelBook for Android is in the works.
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-300">
            Join the early-access list and we&apos;ll let you know when it&apos;s ready.
            You&apos;ll confirm your email, 21+ status, and consent in our short
            early-access form. Unsubscribe anytime.
          </p>
          <AndroidInterestForm placement="android_page" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
