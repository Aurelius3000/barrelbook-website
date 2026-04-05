import { APP_STORE_URL, TESTFLIGHT_URL, getSandboxPromoCode } from "@/lib/app-store";

export interface PromoCampaignMetadata {
  title?: string;
  description?: string;
}

export interface PromoCampaignConfig {
  slug: string;
  title: string;
  subtitle: string;
  heroBody: string;
  code: string;
  codeLabel: string;
  installLabel: string;
  installUrl: string;
  primaryCardDescription: string;
  openHintTitle: string;
  openHint: string;
  fallbackTitle: string;
  fallbackSummary: string;
  fallbackSteps: string[];
  aliases: string[];
  published: boolean;
  qaOnly?: boolean;
  appArgumentPath?: string;
  metadata?: PromoCampaignMetadata;
}

function getPromoAppTargetSlug(
  campaign: Pick<PromoCampaignConfig, "slug" | "appArgumentPath">
): string {
  if (campaign.appArgumentPath) {
    const components = campaign.appArgumentPath
      .split("/")
      .filter(Boolean)
      .map((component) => component.toLowerCase());

    if (components.length === 2 && components[0] === "p") {
      return components[1];
    }
  }

  return campaign.slug.toLowerCase();
}

export function getPromoAppOpenUrl(
  campaign: Pick<PromoCampaignConfig, "slug" | "appArgumentPath">
): string {
  const targetSlug = getPromoAppTargetSlug(campaign);
  return `barrelbook://promo/${encodeURIComponent(targetSlug)}`;
}

const promoCampaigns: Record<string, PromoCampaignConfig> = {
  fnf: {
    slug: "fnf",
    title: "Friends & Family Offer",
    subtitle:
      "Get the app, sign in, then return to this page and tap Open BarrelBook to continue your offer.",
    heroBody:
      "After BarrelBook opens, continue from the offer screen in the app to finish your offer.",
    code: "FNFFREEPLUSYEAR",
    codeLabel: "App Store Code",
    installLabel: "Get the app",
    installUrl: APP_STORE_URL,
    primaryCardDescription:
      "Download BarrelBook from the App Store, then create or sign in to your account. Return here after sign-in and tap Open BarrelBook.",
    openHintTitle: "Then tap Open BarrelBook",
    openHint:
      "After install and sign-in, return to this page and tap Open BarrelBook. BarrelBook should open directly to your offer.",
    fallbackTitle: "Fallback if Open BarrelBook doesn't work",
    fallbackSummary:
      "If Open BarrelBook does not work after you install and sign in, open BarrelBook manually and redeem this App Store Code.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Tap Redeem App Store Code.",
      "Enter FNFFREEPLUSYEAR.",
    ],
    aliases: ["/fnf"],
    published: true,
    metadata: {
      title: "Friends & Family Promo",
      description:
        "Install BarrelBook, sign in, then return to the page and tap Open BarrelBook to continue your offer.",
    },
  },
  garysplus: {
    slug: "garysplus",
    title: "Gary's free year of BarrelBook Plus",
    subtitle:
      "Get the app, sign in, then return to this page and tap Open BarrelBook to continue your offer.",
    heroBody:
      "After BarrelBook opens, you'll continue from the offer screen and tap Continue in App Store.",
    code: "GARYSFREEYEARPLUS",
    codeLabel: "App Store Code",
    installLabel: "Get the app",
    installUrl: APP_STORE_URL,
    primaryCardDescription:
      "Download BarrelBook from the App Store, then create or sign in to your account. Return here after sign-in and tap Open BarrelBook.",
    openHintTitle: "Then tap Open BarrelBook",
    openHint:
      "After install and sign-in, return to this page and tap Open BarrelBook. BarrelBook should open directly to your offer.",
    fallbackTitle: "Fallback if Open BarrelBook doesn't work",
    fallbackSummary:
      "If Open BarrelBook does not work after you install and sign in, open BarrelBook manually and redeem this App Store Code.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Tap Redeem App Store Code.",
      "Enter GARYSFREEYEARPLUS.",
    ],
    aliases: ["/garysplus"],
    published: true,
    metadata: {
      title: "Gary's Plus Promo",
      description:
        "Install BarrelBook, sign in, then return to the page and tap Open BarrelBook to continue your offer.",
    },
  },
};

const FNF_QA_PLACEHOLDER_CODE = "ASK-BARRELBOOK-FOR-SANDBOX-CODE";

export function getFnfQaCampaign(): PromoCampaignConfig {
  const sandboxCode = getSandboxPromoCode("fnf") || FNF_QA_PLACEHOLDER_CODE;

  return {
    slug: "fnf-qa",
    title: "Friends & Family QA Offer",
    subtitle:
      "Install the TestFlight build, sign in with a fresh BarrelBook account, then return to this page and tap Open BarrelBook.",
    heroBody:
      "Open BarrelBook should take you into the canonical FNF offer flow in BarrelBook. If it doesn't, use the sandbox App Store code below.",
    code: sandboxCode,
    codeLabel: "Sandbox App Store Code",
    installLabel: "Open TestFlight",
    installUrl: TESTFLIGHT_URL,
    primaryCardDescription:
      "Open TestFlight, install the staging BarrelBook build, then create or sign in to your account. Return here after sign-in and tap Open BarrelBook.",
    openHintTitle: "Then tap Open BarrelBook",
    openHint:
      "Return to this page after install and sign-in. Open BarrelBook should launch the canonical /p/fnf in-app offer flow.",
    fallbackTitle: "Fallback if Open BarrelBook doesn't work",
    fallbackSummary:
      "If Open BarrelBook does not work after you install and sign in, open BarrelBook manually and redeem this sandbox App Store code.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Tap Redeem App Store Code.",
      `Enter ${sandboxCode}.`,
    ],
    aliases: [],
    published: false,
    qaOnly: true,
    appArgumentPath: "/p/fnf",
    metadata: {
      title: "FNF QA Promo",
      description:
        "QA-only TestFlight flow for the FNF promo. Install via TestFlight, return to the page, and tap Open BarrelBook.",
    },
  };
}

export function getPromoCampaign(slug: string): PromoCampaignConfig | undefined {
  return promoCampaigns[slug.toLowerCase()];
}

export function getPublishedPromoCampaigns(): PromoCampaignConfig[] {
  return Object.values(promoCampaigns).filter((campaign) => campaign.published);
}
