import type { Metadata } from "next";
import type { ReviewCardData } from "@/components/ReviewCard";

type ScreenshotConfig = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  hideOnMobile?: boolean;
};

type VideoHeroMedia = {
  kind: "video";
  src: string;
  poster: string;
  ariaLabel: string;
  width?: number;
  height?: number;
  className?: string;
};

type ScreenshotHeroMedia = {
  kind: "screenshots";
  screenshots: ScreenshotConfig[];
};

type HeroMedia = VideoHeroMedia | ScreenshotHeroMedia;

type StripItem = {
  title: string;
  description: string;
};

type LandingPageConfig = {
  slug: "scan" | "collection" | "store-picks";
  path: "/scan" | "/collection" | "/store-picks";
  metadata: Metadata;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    media: HeroMedia;
  };
  proof: {
    eyebrow: string;
    title: string;
    bullets: string[];
    review: ReviewCardData;
  };
  strip: {
    id: "how-it-works";
    eyebrow: string;
    title: string;
    description: string;
    variant: "steps" | "capabilities";
    media: ScreenshotConfig[];
    items: StripItem[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    description: string;
    items: ReviewCardData[];
  };
  faqs: Array<{
    q: string;
    a: string;
  }>;
  cta: {
    title: string;
    description: string;
    note?: string;
  };
};

const REVIEWS = {
  scanFeatured: {
    title: "The first app that actually handles store picks",
    text: "I've tried other whiskey apps and none of them handle store picks or barrel selections well. BarrelBook nails it—scans the label, picks up the barrel number, batch info, and even the store name. Finally an app built for how bourbon actually works.",
    author: "Aurelius3000",
    date: "Dec 20, 2025",
    version: "1.1",
  },
  scanSupportOne: {
    title: "Best Bourbon tracking App",
    text: "BarrelBook has rapidly become one of my favorite apps. The ability to scan labels and instantly catalog bottles is a game changer. Tracking prices, locations, and personal notes makes managing a collection effortless. Highly recommend for any bourbon enthusiast!",
    author: "MrWCBrown",
    date: "Feb 4, 2026",
    version: "1.3",
  },
  scanSupportTwo: {
    title: "Best app for Bourbon Inventory",
    text: "Simple and easy to use. Snap a photo and your bourbon is added to your collection! Gives MSRP, secondary market prices, proof and so much more. If you want to keep track of your collection, this is the one.",
    author: "RD24/7$",
    date: "Jan 25, 2026",
    version: "1.2",
  },
  collectionFeatured: {
    title: "Excel not Needed",
    text: "Finally, no more spreadsheets! BarrelBook scans your bottles and tracks everything—prices, proof, barrel numbers—all in one clean app. A must-have for bourbon collectors.",
    author: "AtlantaUnited17",
    date: "Feb 1, 2026",
    version: "1.3",
  },
  collectionSupportOne: {
    title: "Great App for Bottle Inventory, Pricing, and Accuracy!",
    text: "Incredibly easy to use. The AI captures detailed bottle info from photos accurately. Market pricing data is a fantastic bonus. Clean interface makes managing a growing collection effortless.",
    author: "WallyWorld34",
    date: "Feb 4, 2026",
    version: "1.3",
  },
  collectionSupportTwo: {
    title: "An interesting concept that works great!",
    text: "I love the idea of this app as it lets you keep track of what you have. What I thought was cool is that you could see how much bottles are worth on the secondary market compared to what I paid at MSRP. Highly recommend!",
    author: "Drbourbondvm",
    date: "Feb 1, 2026",
    version: "1.3",
  },
} as const;

export const scanLandingPageConfig: LandingPageConfig = {
  slug: "scan",
  path: "/scan",
  metadata: {
    title: "Scan bourbon bottles in seconds",
    description:
      "Use BarrelBook to scan bourbon and whiskey labels, capture store picks, barrel numbers, proof, and batch details without typing.",
    alternates: {
      canonical: "/scan",
    },
    openGraph: {
      title: "Scan bourbon bottles in seconds",
      description:
        "Snap up to three bottle photos and let BarrelBook capture the proof, batch, store pick, and barrel number for you.",
      url: "https://www.barrelbook.app/scan",
    },
    twitter: {
      title: "Scan bourbon bottles in seconds",
      description:
        "Snap up to three bottle photos and let BarrelBook capture the proof, batch, store pick, and barrel number for you.",
    },
  },
  hero: {
    eyebrow: "Whiskey bottle scanner",
    title: "Scan bourbon bottles in seconds.",
    description:
      "Snap up to three photos. BarrelBook captures the proof, batch, store pick, and barrel number straight from the label. No barcodes, no typing, no spreadsheet cleanup.",
    media: {
      kind: "video",
      src: "/videos/bottle-scanning.mp4",
      poster: "/video-posters/bottle-scanning.jpg",
      ariaLabel: "Scanning a bourbon bottle label with the BarrelBook app",
      width: 886,
      height: 1920,
      className: "w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]",
    },
  },
  proof: {
    eyebrow: "Why it works",
    title: "Built for bottles that deserve more than a barcode.",
    bullets: [
      "Captures store name, barrel number, batch, proof, and other collector-grade label details.",
      "Supports up to three photos per bottle when front labels and back labels both matter.",
      "Faster than manual entry in Notes, Airtable, or a spreadsheet you never want to touch again.",
    ],
    review: REVIEWS.scanFeatured,
  },
  strip: {
    id: "how-it-works",
    eyebrow: "How it works",
    title: "Snap, review, save.",
    description:
      "Turn a few bottle photos into a clean, editable record you can search later when you are at the store, at a tasting, or standing in front of your shelf.",
    variant: "steps",
    media: [
      {
        src: "/App%20Scan%20WLW.png",
        alt: "Scanning the front label of a William Larue Weller bottle in BarrelBook",
      },
      {
        src: "/App%20Scan%20WLW3.png",
        alt: "Reviewing BarrelBook's extracted bottle details after scanning",
      },
      {
        src: "/App%20Scan%20WLW4.png",
        alt: "Saving a scanned bourbon bottle record inside BarrelBook",
      },
    ],
    items: [
      {
        title: "Snap the label",
        description: "Take up to three photos so BarrelBook can see the front label, back label, and any tricky barrel or batch text.",
      },
      {
        title: "Review the details",
        description: "Check the extracted proof, batch, store-pick, and bottle data before it hits your shelf.",
      },
      {
        title: "Save it to your collection",
        description: "Keep the cleaned-up record with the rest of your bottles, ready to search, edit, or share later.",
      },
    ],
  },
  reviews: {
    eyebrow: "Collector proof",
    title: "Real collectors use it because scanning has to hold up in the messy cases.",
    description:
      "These are the reviews that matter for scanning: fast capture, clean records, and bottle details that generic whiskey apps usually skip.",
    items: [REVIEWS.scanSupportOne, REVIEWS.scanSupportTwo],
  },
  faqs: [
    {
      q: "How does AI recognition work?",
      a: "Open BarrelBook, take up to three bottle photos, and the app reads the label text to prefill the record. Multi-angle photos help when a bottle has meaningful detail on the back label or in smaller print.",
    },
    {
      q: "What information can it capture?",
      a: "Typical fields include the producer, expression, proof, batch or barrel identifiers, store-pick details, pricing, and other label micro-text that collectors care about.",
    },
    {
      q: "Does it work for store picks and private barrels?",
      a: "Yes. BarrelBook is specifically useful for store picks, barrel selections, and other collector bottles where the details are not just a UPC code and a bottle name.",
    },
  ],
  cta: {
    title: "Download BarrelBook and scan your next bottle.",
    description:
      "If the bottle is worth buying, it is worth capturing cleanly. BarrelBook keeps that work fast.",
    note: "Available on iPhone and iPad today. Android is on the roadmap.",
  },
};

export const collectionLandingPageConfig: LandingPageConfig = {
  slug: "collection",
  path: "/collection",
  metadata: {
    title: "Track your bourbon collection without spreadsheets",
    description:
      "Use BarrelBook to catalog bottles, search your shelf, track proof, batch, notes, fill level, and pricing from your iPhone.",
    alternates: {
      canonical: "/collection",
    },
    openGraph: {
      title: "Track your bourbon collection without spreadsheets",
      description:
        "Keep your bourbon collection in your pocket with a searchable library for bottles, batches, pricing, notes, and shelf details.",
      url: "https://www.barrelbook.app/collection",
    },
    twitter: {
      title: "Track your bourbon collection without spreadsheets",
      description:
        "Keep your bourbon collection in your pocket with a searchable library for bottles, batches, pricing, notes, and shelf details.",
    },
  },
  hero: {
    eyebrow: "Bourbon collection app",
    title: "Track your bourbon collection without spreadsheets.",
    description:
      "Catalog bottles, search your shelf, and keep your collection in your pocket. Track proof, batch, store, fill level, pricing, and personal notes in one place.",
    media: {
      kind: "screenshots",
      screenshots: [
        {
          src: "/Catalog1.png",
          alt: "Browsing a BarrelBook collection catalog on iPhone",
          className: "w-full max-w-[250px] sm:max-w-[270px]",
        },
        {
          src: "/App%20Scan%20Blantons2.png",
          alt: "Viewing a bottle detail screen inside BarrelBook",
          className: "w-full max-w-[210px] sm:max-w-[230px] translate-y-8",
          hideOnMobile: true,
        },
      ],
    },
  },
  proof: {
    eyebrow: "Why collectors switch",
    title: "One portable source of truth for your shelf.",
    bullets: [
      "Search a collection by bottle, batch, proof, store, tags, and the details you actually use when you are deciding what to buy or open.",
      "Carry your shelf with you at the store, at tastings, at bars, or when a friend asks what you already own.",
      "Replace the spreadsheet, the notes app, and the half-kept bottle list with one clean collection record.",
    ],
    review: REVIEWS.collectionFeatured,
  },
  strip: {
    id: "how-it-works",
    eyebrow: "Built for your shelf",
    title: "Your collection goes wherever you go.",
    description:
      "Keep bottle photos and details with you at the store, at tastings, at bars, or with friends. BarrelBook gives you a portable digital shelf, so you always know what you own and what is worth opening, buying, or sharing.",
    variant: "capabilities",
    media: [
      {
        src: "/Catalog1.png",
        alt: "Scrolling through a searchable bottle catalog in BarrelBook",
      },
      {
        src: "/App%20Scan%20Blantons2.png",
        alt: "Viewing bottle details and notes inside BarrelBook",
      },
    ],
    items: [
      {
        title: "Search and sort your shelf",
        description: "Find bottles by proof, batch, producer, store, or tags instead of remembering which spreadsheet tab you used last time.",
      },
      {
        title: "Track what matters per bottle",
        description: "Keep notes, ratings, fill level, pricing, and collector details together so each bottle has context, not just a name.",
      },
      {
        title: "Keep it with you",
        description: "Your collection stays in your pocket when you are shopping, planning a tasting, or checking whether a friend already poured that bottle.",
      },
    ],
  },
  reviews: {
    eyebrow: "Collection proof",
    title: "The collection use case is where BarrelBook has to earn its keep.",
    description:
      "These reviews speak to the day-to-day value of keeping pricing, bottle details, and your shelf history in one clean app.",
    items: [REVIEWS.collectionSupportOne, REVIEWS.collectionSupportTwo],
  },
  faqs: [
    {
      q: "What can I track per bottle?",
      a: "BarrelBook supports bottle details such as proof, batch or barrel identifiers, store, pricing, notes, ratings, fill level, status, and other collector-specific metadata you want close at hand.",
    },
    {
      q: "How many bottles can I track on the Free plan?",
      a: "The Free plan includes a 10-bottle library. Plus expands that to 100 bottles, and Pro removes the bottle limit entirely.",
    },
    {
      q: "Can I export my collection?",
      a: "Not yet. Today BarrelBook is focused on giving you a searchable, portable collection on iPhone and iPad, rather than a separate export workflow.",
    },
  ],
  cta: {
    title: "Put your shelf in your pocket.",
    description:
      "Start with the bottles you already own, keep them searchable, and stop rebuilding the same list in three different places.",
    note: "Available on iPhone and iPad today. Android is on the roadmap.",
  },
};

export const storePicksLandingPageConfig: LandingPageConfig = {
  slug: "store-picks",
  path: "/store-picks",
  metadata: {
    title: "Made for store picks and collector bottles",
    description:
      "Track store picks, single barrels, batch details, barrel numbers, warehouse and floor data with BarrelBook's bourbon-first scanner.",
    alternates: {
      canonical: "/store-picks",
    },
    openGraph: {
      title: "Made for store picks and collector bottles",
      description:
        "Track the details generic whiskey apps miss, including store names, barrel numbers, batch data, warehouse, floor, and mash bill notes.",
      url: "https://www.barrelbook.app/store-picks",
    },
    twitter: {
      title: "Made for store picks and collector bottles",
      description:
        "Track the details generic whiskey apps miss, including store names, barrel numbers, batch data, warehouse, floor, and mash bill notes.",
    },
  },
  hero: {
    eyebrow: "Store pick tracker",
    title: "Made for store picks and collector bottles.",
    description:
      "Track the details generic whiskey apps miss, including store name, barrel number, batch, warehouse, floor, mash bill, and pricing. BarrelBook is built for the bottles bourbon collectors actually chase.",
    media: {
      kind: "video",
      src: "/videos/bottle-scanning.mp4",
      poster: "/video-posters/bottle-scanning.jpg",
      ariaLabel: "Scanning a collector bourbon label with store-pick details in BarrelBook",
      width: 886,
      height: 1920,
      className: "w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]",
    },
  },
  proof: {
    eyebrow: "Why BarrelBook fits this job",
    title: "Collector-grade details, not generic whiskey fields.",
    bullets: [
      "Captures the store name, barrel number, batch, proof, and bottle-specific details that make one pick different from the next.",
      "Uses up to three photos per bottle so front-label branding and back-label micro-text both make it into the record.",
      "Keeps rare picks searchable by store, selection details, and the metadata you actually need when comparing bottles.",
    ],
    review: REVIEWS.scanFeatured,
  },
  strip: {
    id: "how-it-works",
    eyebrow: "Built for bourbon detail",
    title: "The details bourbon collectors care about stay attached to the bottle.",
    description:
      "BarrelBook is especially useful when a bottle has more to remember than a name. Store picks, private barrels, and batch-specific bottles stay searchable because the important details are part of the record, not buried in a note field.",
    variant: "capabilities",
    media: [
      {
        src: "/App%20Scan%20WLW.png",
        alt: "Scanning a collector bourbon bottle with store-pick-relevant details in BarrelBook",
      },
      {
        src: "/App%20Scan%20WLW3.png",
        alt: "Reviewing extracted batch, proof, and label detail fields in BarrelBook",
      },
      {
        src: "/App%20Scan%20WLW4.png",
        alt: "Saving a detailed bourbon bottle record for a collector bottle in BarrelBook",
      },
    ],
    items: [
      {
        title: "Store names and barrel numbers",
        description: "Keep each pick tied to the store and selection details that make it distinct from the broader release.",
      },
      {
        title: "Batch, warehouse, and floor",
        description: "Record the bottle metadata collectors actually compare when they are deciding what to buy, trade, or open.",
      },
      {
        title: "Searchable later",
        description: "Filter your shelf by store-pick details instead of trying to remember which note field held the one fact you care about.",
      },
    ],
  },
  reviews: {
    eyebrow: "Collector proof",
    title: "This page exists because generic whiskey apps usually fall apart on store picks.",
    description:
      "These reviews are the strongest evidence that BarrelBook handles bottle-level nuance instead of flattening everything into the same generic record.",
    items: [REVIEWS.scanSupportOne, REVIEWS.collectionSupportOne],
  },
  faqs: [
    {
      q: "Does BarrelBook know which store a pick came from?",
      a: "It is designed to capture and preserve store-pick details when they are present on the label, alongside the rest of the bottle record.",
    },
    {
      q: "Can I track private barrel selections and other collector bottles?",
      a: "Yes. This is one of BarrelBook's strongest use cases, especially when batch, proof, barrel number, or selection-specific notes matter.",
    },
    {
      q: "Why use this instead of a generic whiskey app?",
      a: "Because the differences that matter on collector bottles are often the exact details generic apps skip. BarrelBook is designed to make those details part of the record from the start.",
    },
  ],
  cta: {
    title: "Track your next store pick the right way.",
    description:
      "If the barrel number, store, or batch matters, the record should keep it front and center. BarrelBook does that from the first scan.",
    note: "Available on iPhone and iPad today. Android is on the roadmap.",
  },
};

export type { LandingPageConfig, ScreenshotConfig };
