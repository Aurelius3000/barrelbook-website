"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

type RouteAnalyticsProps = {
  googleAnalyticsId?: string;
};

function isTokenizedPublicWantListPath(pathname: string): boolean {
  return pathname === "/w" || pathname.startsWith("/w/");
}

export function RouteAnalytics({ googleAnalyticsId }: RouteAnalyticsProps) {
  const pathname = usePathname();

  if (isTokenizedPublicWantListPath(pathname)) {
    return null;
  }

  return (
    <>
      <Analytics />
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </>
  );
}
