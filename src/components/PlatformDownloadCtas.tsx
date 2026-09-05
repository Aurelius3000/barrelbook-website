"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import AppStoreBadgeLink from "@/components/AppStoreBadgeLink";
import {
  trackAndroidInterest,
  trackAndroidWaitlistCtaClick,
  type AndroidInterestAnalytics,
  type AppStoreCtaAnalytics,
} from "@/lib/cta-analytics";

type PlatformDownloadCtasProps = {
  variant?: "default" | "header";
  priority?: boolean;
  analytics?: AppStoreCtaAnalytics;
  legacyAndroidPlacement?: AndroidInterestAnalytics["placement"];
};

export default function PlatformDownloadCtas({
  variant = "default",
  priority = false,
  analytics,
  legacyAndroidPlacement,
}: PlatformDownloadCtasProps) {
  const isHeader = variant === "header";

  return (
    <div
      data-platform-download-ctas
      className={`flex items-center justify-center ${
        isHeader
          ? "flex-col gap-1 sm:flex-row sm:gap-2"
          : "flex-col gap-3 sm:flex-row"
      }`}
    >
      <AppStoreBadgeLink
        width={isHeader ? 140 : 180}
        height={isHeader ? 46 : 60}
        imageClassName={isHeader ? "h-9 w-auto" : "h-[60px] w-auto"}
        analytics={analytics}
        priority={priority}
      />
      <Link
        href="/android"
        aria-label="Join the BarrelBook Android waitlist"
        onClick={() => {
          if (legacyAndroidPlacement) {
            trackAndroidInterest("android_interest_homepage_clicked", {
              placement: legacyAndroidPlacement,
            });
            return;
          }

          trackAndroidWaitlistCtaClick(analytics);
        }}
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#A6A6A6] bg-black px-3 text-white transition-colors hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${
          isHeader ? "h-9 w-[140px]" : "h-[60px] w-[180px]"
        }`}
      >
        <Play
          aria-hidden="true"
          className={`${isHeader ? "h-5 w-5" : "h-7 w-7"} fill-[#3DDC84] stroke-[#3DDC84]`}
        />
        <span className="flex flex-col items-start leading-none">
          <span className={`${isHeader ? "text-[7px]" : "text-[9px]"} tracking-[0.08em] text-white`}>
            JOIN THE
          </span>
          <span className={`${isHeader ? "text-[11px]" : "text-lg"} mt-1 whitespace-nowrap font-semibold text-white`}>
            Android waitlist
          </span>
        </span>
      </Link>
    </div>
  );
}
