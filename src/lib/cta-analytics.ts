import { track } from "@vercel/analytics";

export type AppStoreCtaAnalytics = {
  page?: string;
  location?: string;
  plan?: string;
};

export type AndroidInterestAnalytics = {
  placement: "android_page" | "homepage_download";
};

export type AndroidInterestEvent =
  | "android_interest_form_view"
  | "android_interest_form_opened"
  | "android_interest_homepage_clicked";

type GtagWindow = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    params?: Record<string, string>
  ) => void;
};

export function trackAppStoreCtaClick({
  page,
  location = "app_store_badge",
  plan,
}: AppStoreCtaAnalytics = {}) {
  const inferredPage =
    typeof window !== "undefined" ? window.location.pathname : undefined;
  const props: Record<string, string> = {
    page: page ?? inferredPage ?? "unknown",
    location,
  };

  if (plan) {
    props.plan = plan;
  }

  track("app_store_cta_clicked", props);

  if (typeof window !== "undefined") {
    (window as GtagWindow).gtag?.("event", "app_store_cta_clicked", props);
  }
}

export function trackAndroidInterest(
  eventName: AndroidInterestEvent,
  { placement }: AndroidInterestAnalytics
) {
  const props = { placement };

  track(eventName, props);

  if (typeof window !== "undefined") {
    (window as GtagWindow).gtag?.("event", eventName, props);
  }
}
