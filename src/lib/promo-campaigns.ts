import { APP_STORE_URL, TESTFLIGHT_URL, getSandboxPromoCode } from "@/lib/app-store";

export interface PromoCampaignMetadata {
  title?: string;
  description?: string;
}

export interface CreatorCollabBranding {
  eyebrow: string;
  collaborationLabel?: string;
  supportingText: string;
  theme?: "black-gold" | "bourbon-trail";
  logoSrc?: string;
  logoAlt?: string;
  stepOneTitle?: string;
  stepTwoTitle?: string;
  manualFallbackTitle?: string;
}

export interface PromoCampaignOfferConfig {
  planName: string;
  normalPrice: string;
  offerPrice: string;
  firstYearCopy: string;
  appSlug: string;
  code: string;
  codeLabel: string;
  fallbackLabel: string;
  ctaLabel: string;
}

export interface PromoCampaignConfig {
  slug: string;
  title: string;
  subtitle: string;
  heroBody: string;
  template?: "standard" | "creator-collab" | "creator-multi-offer";
  creatorCollab?: CreatorCollabBranding;
  offers?: PromoCampaignOfferConfig[];
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

export function getPromoOfferAppOpenUrl(
  offer: Pick<PromoCampaignOfferConfig, "appSlug">
): string {
  return `barrelbook://promo/${encodeURIComponent(offer.appSlug.toLowerCase())}`;
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
  blackshirt: {
    slug: "blackshirt",
    template: "creator-multi-offer",
    title: "20% off the first year of BarrelBook",
    subtitle:
      "Black Shirt Bourbon Society members get 20% off the first year of BarrelBook Plus Annual or Pro Annual.",
    heroBody:
      "Choose the annual plan that fits your collection, then open BarrelBook to claim the creator offer.",
    creatorCollab: {
      eyebrow: "Black Shirt Bourbon Society",
      collaborationLabel: "Creator offer",
      supportingText:
        "Join the Black Shirt Bourbon Society for spirited adventures.",
      logoSrc: "/creator-collabs/blackshirt-bourbon-society-logo.jpeg",
      logoAlt: "Black Shirt Bourbon Society logo",
      stepOneTitle: "Get BarrelBook and create an account",
      stepTwoTitle: "Choose your annual plan",
      manualFallbackTitle: "Manual fallback",
    },
    offers: [
      {
        planName: "Plus Annual",
        normalPrice: "$49/year",
        offerPrice: "$39.20 first year",
        firstYearCopy: "20% off the first year of Plus Annual",
        appSlug: "blackshirt-plus",
        code: "BLACKSHIRTPLUS20",
        codeLabel: "Plus Annual App Store Code",
        fallbackLabel: "Use this if the Plus CTA does not open the offer.",
        ctaLabel: "Claim Plus Annual",
      },
      {
        planName: "Pro Annual",
        normalPrice: "$99/year",
        offerPrice: "$79.20 first year",
        firstYearCopy: "20% off the first year of Pro Annual",
        appSlug: "blackshirt-pro",
        code: "BLACKSHIRTPRO20",
        codeLabel: "Pro Annual App Store Code",
        fallbackLabel: "Use this if the Pro CTA does not open the offer.",
        ctaLabel: "Claim Pro Annual",
      },
    ],
    code: "BLACKSHIRTPLUS20",
    codeLabel: "App Store Codes",
    installLabel: "Get the app",
    installUrl: APP_STORE_URL,
    primaryCardDescription:
      "Download BarrelBook from the App Store, then create or sign in to your account. Return here after sign-in and choose Plus Annual or Pro Annual.",
    openHintTitle: "Then choose an annual plan",
    openHint:
      "After install and sign-in, return to this page and choose the annual plan you want to claim in BarrelBook.",
    fallbackTitle: "Manual fallback",
    fallbackSummary:
      "If a claim button does not open the correct offer, open BarrelBook manually and redeem the matching App Store Code.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Go to Settings and tap Redeem App Store Code.",
      "Enter the matching Black Shirt code for Plus Annual or Pro Annual.",
    ],
    aliases: ["/blackshirt"],
    published: true,
    metadata: {
      title: "Black Shirt Bourbon Society x BarrelBook",
      description:
        "Black Shirt Bourbon Society members get 20% off the first year of BarrelBook Plus Annual or Pro Annual.",
    },
  },
  thebourbontrail: {
    slug: "thebourbontrail",
    template: "creator-multi-offer",
    title: "20% off the first year of BarrelBook",
    subtitle:
      "The Bourbon Trail audience gets 20% off the first year of BarrelBook Plus Annual or Pro Annual.",
    heroBody:
      "Choose the annual plan that fits your distillery trips, bottle-shop finds, and trail pours.",
    creatorCollab: {
      eyebrow: "thebourbontrail",
      collaborationLabel: "Bourbon Whiskey Content",
      supportingText:
        "Kentucky distilleries. USA whiskey. Barrels. Pours.",
      theme: "bourbon-trail",
      logoSrc: "/creator-collabs/thebourbontrail-profile.jpg",
      logoAlt: "The Bourbon Trail logo",
      stepOneTitle: "Get BarrelBook and create an account",
      stepTwoTitle: "Choose your annual plan",
      manualFallbackTitle: "Manual fallback",
    },
    offers: [
      {
        planName: "Plus Annual",
        normalPrice: "$49/year",
        offerPrice: "$39.20 first year",
        firstYearCopy: "20% off the first year of Plus Annual",
        appSlug: "thebourbontrail-plus",
        code: "THEBOURBONTRAILPLUS20",
        codeLabel: "Plus Annual App Store Code",
        fallbackLabel: "Use this if the Plus CTA does not open the offer.",
        ctaLabel: "Claim Plus Annual",
      },
      {
        planName: "Pro Annual",
        normalPrice: "$99/year",
        offerPrice: "$79 first year",
        firstYearCopy: "20% off the first year of Pro Annual",
        appSlug: "thebourbontrail-pro",
        code: "THEBOURBONTRAILPRO20",
        codeLabel: "Pro Annual App Store Code",
        fallbackLabel: "Use this if the Pro CTA does not open the offer.",
        ctaLabel: "Claim Pro Annual",
      },
    ],
    code: "THEBOURBONTRAILPLUS20",
    codeLabel: "App Store Codes",
    installLabel: "Get the app",
    installUrl: APP_STORE_URL,
    primaryCardDescription:
      "Download BarrelBook from the App Store, then create or sign in to your account. Return here after sign-in and choose Plus Annual or Pro Annual.",
    openHintTitle: "Then choose an annual plan",
    openHint:
      "After install and sign-in, return to this page and choose the annual plan you want to claim in BarrelBook.",
    fallbackTitle: "Manual fallback",
    fallbackSummary:
      "If a claim button does not open the correct offer, open BarrelBook manually and redeem the matching App Store Code.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Go to Settings and tap Redeem App Store Code.",
      "Enter the matching The Bourbon Trail code for Plus Annual or Pro Annual.",
    ],
    aliases: ["/thebourbontrail"],
    published: true,
    metadata: {
      title: "The Bourbon Trail x BarrelBook",
      description:
        "The Bourbon Trail audience gets 20% off the first year of BarrelBook Plus Annual or Pro Annual.",
    },
  },
};

const FNF_QA_PLACEHOLDER_CODE = "ASK-BARRELBOOK-FOR-SANDBOX-CODE";
const THE_BOURBON_TRAIL_DRAFT_CODE = "THEBOURBONTRAIL";

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

export function getTheBourbonTrailDraftCampaign(): PromoCampaignConfig {
  return {
    slug: "thebourbontrail",
    template: "creator-collab",
    title: "A free BarrelBook Plus offer for The Bourbon Trail audience",
    subtitle:
      "Draft creator page for @thebourbontrail. Install BarrelBook, sign in, then come back to claim the offer.",
    heroBody:
      "Track distillery pickups, bottle-shop finds, and trail pours in one clean collection.",
    creatorCollab: {
      eyebrow: "thebourbontrail",
      collaborationLabel: "Bourbon Whiskey Content",
      supportingText:
        "Kentucky distilleries. USA whiskey. Barrels. Pours.",
      logoSrc: "/creator-collabs/thebourbontrail-profile.jpg",
      logoAlt: "The Bourbon Trail logo",
      stepOneTitle: "Get BarrelBook and create an account",
      stepTwoTitle: "Claim The Bourbon Trail offer",
      manualFallbackTitle: "Prefer to redeem manually?",
    },
    code: THE_BOURBON_TRAIL_DRAFT_CODE,
    codeLabel: "Draft promo code",
    installLabel: "Get the app",
    installUrl: APP_STORE_URL,
    primaryCardDescription:
      "Download BarrelBook from the App Store, then create or sign in to your account. Return here after sign-in and tap Redeem.",
    openHintTitle: "Then tap Redeem",
    openHint:
      "After install and sign-in, return to this page and tap Redeem. This draft currently points to the existing promo flow while we finalize creator-specific offer plumbing.",
    fallbackTitle: "Fallback if Redeem doesn't work",
    fallbackSummary:
      "If tapping Redeem does not work, open BarrelBook manually and use the draft promo code below.",
    fallbackSteps: [
      "Open BarrelBook manually.",
      "Go to Settings and tap Redeem App Store Code.",
      `Enter ${THE_BOURBON_TRAIL_DRAFT_CODE}.`,
    ],
    aliases: [],
    published: false,
    qaOnly: false,
    appArgumentPath: "/p/fnf",
    metadata: {
      title: "The Bourbon Trail x BarrelBook Draft",
      description:
        "Draft co-branded offer page for @thebourbontrail.",
    },
  };
}

export function getPromoCampaign(slug: string): PromoCampaignConfig | undefined {
  return promoCampaigns[slug.toLowerCase()];
}

export function getPublishedPromoCampaigns(): PromoCampaignConfig[] {
  return Object.values(promoCampaigns).filter((campaign) => campaign.published);
}
