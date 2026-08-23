import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Help with BarrelBook 1.7.3",
  description: "Fix sign-in and collection issues caused by BarrelBook 1.7.3.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="text-sm text-gray-300 hover:text-white">
              ← Back to Home
            </Link>
            <Link href="/" className="flex items-center gap-2 text-white">
              <Image
                src="/BarrelBook%20Logo%20Large.png"
                alt="BarrelBook"
                width={280}
                height={96}
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D2691E]">
            BarrelBook Support
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl">Seeing this message when you try to sign in?</h1>
          <p className="mt-5 text-lg leading-8 text-gray-300">
            “Authentication Error: Your access has been revoked. Please sign in again.”
          </p>

          <div className="mt-8 grid gap-8 rounded-2xl border border-[#333333] bg-[#0F0F0F] p-6 md:grid-cols-[minmax(0,1fr)_180px] md:items-center md:p-8">
            <div>
              <h2 className="text-2xl">Your data is safe.</h2>
              <p className="mt-4 leading-7 text-gray-300">
                If you used BarrelBook version 1.7.3 between Thursday evening, August 7, and Wednesday morning, August 13, a known issue in that version may cause this message, a sign-in loop, or an empty collection.
              </p>
              <p className="mt-4 leading-7 text-gray-300">
                Your account, subscription, and previously synced collection remain safe.
              </p>
            </div>
            <figure className="mx-auto w-full max-w-[180px]">
              <Image
                src="/support/authentication-error-173.png"
                alt="BarrelBook authentication error saying access has been revoked and to sign in again"
                width={1320}
                height={2868}
                className="rounded-xl border border-white/10"
              />
              <figcaption className="mt-3 text-center text-xs text-gray-500">
                If this looks familiar
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 rounded-2xl border border-[#4A2A16] bg-[#17110D] p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Here&apos;s the fix</h2>
            <p className="mt-4 rounded-lg border border-[#6B3D1E] bg-black/20 px-4 py-3 text-sm leading-6 text-gray-200">
              If you added bottles, changed details, or uploaded photos while using BarrelBook 1.7.3, please contact Support before deleting the app so we can help protect those changes.
            </p>
            <ol className="mt-5 list-decimal space-y-4 pl-6 text-gray-200 marker:text-[#D2691E]">
              <li>Delete BarrelBook from your device.</li>
              <li>Reinstall BarrelBook from the App Store.</li>
              <li>Sign in using your usual account and the same sign-in method you used before.</li>
            </ol>
            <p className="mt-6 text-gray-200">
              Your collection should appear after you sign in.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#333333] bg-[#0F0F0F] p-6 md:p-8">
            <h2 className="text-2xl">Need help?</h2>
            <p className="mt-4 leading-7 text-gray-300">
              If you still cannot sign in or your collection does not appear after reinstalling, email{" "}
              <a
                href="mailto:support@barrelbook.app"
                className="text-[#E8894B] underline hover:text-white"
              >
                support@barrelbook.app
              </a>
              .
            </p>
          </div>

          <p className="mt-10 text-sm text-gray-500">Last updated: August 13, 2026</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
