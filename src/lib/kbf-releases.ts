// Master sync 1: stable bottle IDs drive pages; slots only set the list order.
export const KBF_PATH = "/releases/kbf-2026";
export const KBF_URL = `https://www.barrelbook.app${KBF_PATH}`;
export const KBF_CHECKED_AT = "2026-09-05T18:23:00Z";
export const KBF_UPDATED_AT = "2026-09-05T19:14:04Z";
export const MASTER_SLOT_COUNT = 26;
export const openSlots: readonly number[] = [26];

export const releaseSources = {
  kbf: {
    name: "KBF Distillers' Row",
    kind: "official",
    url: "https://kybourbonfestival.com/distillers-row-series/",
    note: "The festival's barrel picks and specs.",
  },
  guide: {
    name: "Bourbon & Banter",
    kind: "report",
    url: "https://www.bourbonbanter.com/the-ultimate-insiders-guide-to-the-2026-kentucky-bourbon-festival/",
    note: "Patrick Pho's KBF guide, published Sept. 2, 2026.",
  },
  larrikin: {
    name: "Larrikin press release",
    kind: "brand-release",
    url: "https://www.thebourbonflight.com/larrikin-bourbon-co-unveils-the-australia-series-for-the-2026-kentucky-bourbon-festival/",
    note: "Larrikin's Aug. 25 announcement, carried by The Bourbon Flight.",
  },
  phifer: {
    name: "Phifer Pavitt press release",
    kind: "brand-release",
    url: "https://bevnet.com/pr/2026/09/01/phifer-pavitt-spirits-opens-late-night-and-reserve-for-public-sale-for-the-first-time",
    note: "The brand's Sept. 1 announcement, posted on BevNET.",
  },
  makers: {
    name: "Maker's Mark",
    kind: "official",
    url: "https://www.makersmark.com/en-us/bourbons/makers-mark-cellar-aged",
    note: "The brand's 2026 Cellar Aged specs.",
  },
} as const;

export type SourceId = keyof typeof releaseSources;
export type ReleaseStatus = "confirmed" | "reported" | "watch";
export const festivalDays = ["thu", "fri", "sat", "sun"] as const;
export type FestivalDay = typeof festivalDays[number];
export type Fact = { value: string; source: SourceId; minimum?: number };
type Schedule = {
  days: FestivalDay[];
  state: "confirmed" | "reported" | "pending";
  source: SourceId;
  note: string;
};
export type Release = {
  slot: number | null;
  slug: string;
  name: string;
  brand: string;
  status: ReleaseStatus;
  statusNote: string;
  source: SourceId;
  age: Fact | null;
  proof: Fact | null;
  price: Fact | null;
  bottles: Fact | null;
  batch: Fact | null;
  finish: Fact | null;
  exclusive: Fact | null;
  venue: Fact | null;
  time: Fact | null;
  why: string;
  unknowns: string[];
  schedule: Schedule;
  lastCheckedAt: string;
  updates: { date: string; note: string }[];
};
export type ActiveRelease = Release & { slot: number };

const fact = (value: string, source: SourceId = "guide", minimum?: number): Fact =>
  ({ value, source, ...(minimum === undefined ? {} : { minimum }) });
const pending = (source: SourceId = "guide", note = "Sale day and time are TBD."): Schedule =>
  ({ days: [], state: "pending", source, note });
type ReleaseInput = Pick<Release, "slot" | "slug" | "name" | "brand" | "why"> & Partial<Release>;
const record = (input: ReleaseInput): Release => ({
  status: "reported",
  statusNote: "Bourbon & Banter lists this bottle for KBF. Brand confirmation is pending.",
  source: "guide",
  age: null, proof: null, price: null, bottles: null, batch: null, finish: null,
  exclusive: null, venue: null, time: null,
  schedule: pending(),
  unknowns: ["Sale day and time", "Price and bottle count", "Booth location"],
  lastCheckedAt: KBF_CHECKED_AT,
  updates: [{ date: KBF_CHECKED_AT, note: "Added to our KBF watchlist. Sources checked." }],
  ...input,
});
const festivalPick = {
  status: "confirmed" as const,
  statusNote: "KBF lists this festival pick. Sale details are still TBD.",
  source: "kbf" as const,
  schedule: pending("kbf"),
};
const larrikinRelease = (day: FestivalDay): Partial<Release> => ({
  status: "confirmed", source: "larrikin",
  statusNote: "Larrikin announced this KBF release and its sale day.",
  age: fact("11 years", "larrikin", 11), proof: fact("Cask strength", "larrikin"),
  batch: fact("6 barrels across the full series", "larrikin"),
  exclusive: fact("KBF only", "larrikin"), venue: fact("KBF, Bardstown", "larrikin"),
  schedule: { days: [day], state: "confirmed", source: "larrikin", note: "Larrikin confirms the day. Sale time is TBD." },
  unknowns: ["Sale time and booth location", "Exact proof", "Price and count for this finish"],
});

const phiferRelease: Partial<Release> = {
  status: "confirmed", source: "phifer",
  statusNote: "Phifer Pavitt announced bottle sales at KBF. Stock may run out.",
  venue: fact("Whiskey House chalet", "phifer"),
  schedule: {
    days: [...festivalDays], state: "confirmed", source: "phifer",
    note: "The brand lists sales from Sept. 10 to 13, while stock lasts. Exact sale hours are TBD.",
  },
  unknowns: ["Price and KBF bottle count", "Exact sale hours"],
  lastCheckedAt: KBF_UPDATED_AT,
  updates: [{ date: KBF_UPDATED_AT, note: "Added after checking the brand's KBF announcement." }],
};

// Parked records keep their URLs and facts, but have no active list slot.
export const allReleases: Release[] = [
  record({ slot: 1, slug: "heaven-hill-kbf-35th", brand: "Heaven Hill", name: "KBF 35th Anniversary Commemorative Release",
    age: fact("10, 12 & 13 year blend", "guide", 10), proof: fact("133.5", "guide", 133.5),
    why: "A special blend for the festival's 35th year.",
  }),
  record({ slot: 5, slug: "king-of-kentucky-2026", brand: "Brown-Forman", name: "King of Kentucky",
    statusNote: "The guide lists King of Kentucky. It does not state the release year or confirm bottle sales.",
    why: "One to check early. We still need the release year and sale details.",
    unknowns: ["Release year and barrel", "Bottle sales or pours only", "Age, proof, price, and count", "Sale day, time, and place"],
  }),
  record({ slot: 3, slug: "knob-creek-kbf-single-barrel", brand: "Knob Creek", name: "Distillers' Row Single Barrel",
    ...festivalPick, age: fact("12.5 years", "kbf", 12.5), proof: fact("127.6", "kbf", 127.6),
    batch: fact("Single barrel", "kbf"), why: "An older Beam pick at a bold proof.",
  }),
  record({ slot: 6, slug: "hartfield-kbf-single-barrel", brand: "Hartfield & Co.", name: "KBF Single Barrel",
    age: fact("14 years", "guide", 14), proof: fact("142", "guide", 142), batch: fact("Single barrel"),
    why: "An older single barrel at a high proof.",
  }),
  record({ slot: 7, slug: "dark-arts-flight-of-icarus", brand: "Dark Arts", name: "Flight of Icarus",
    age: fact("11.5 years", "guide", 11.5), proof: fact("144.4", "guide", 144.4),
    why: "A bold pick for fans of older, high-proof bourbon.",
  }),
  record({ slot: 8, slug: "evan-williams-first-run", brand: "Evan Williams", name: "First Run",
    age: fact("12 years", "guide", 12), proof: fact("113", "guide", 113),
    why: "The first barrels from the Bourbon Experience give this one a story.",
    unknowns: ["Sale day, time, and place", "Price and bottle count", "Final batch size"],
  }),
  record({ slot: 13, slug: "barrell-14-year-rye", brand: "Barrell", name: "14-Year Single Barrel Rye",
    age: fact("14 years", "guide", 14), batch: fact("Single barrel"), exclusive: fact("KBF only"),
    why: "Old rye and a short barrel make this one worth a look.",
    unknowns: ["Proof, price, and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: 4, slug: "larrikin-sugar-cane-rum", brand: "Larrikin", name: "Australia Series: Sugar Cane Rum Finish",
    ...larrikinRelease("sun"), finish: fact("Sugar cane rum cask", "larrikin"),
    why: "Our first pick from the three Australian finishes.",
  }),
  record({ slot: 9, slug: "coal-pick-mystery", brand: "Coal Pick", name: "KBF Mystery Release",
    status: "watch", statusNote: "The guide reports a Sept. 8 reveal. The bottle's name is still TBD.",
    bottles: fact("170"), exclusive: fact("KBF only"),
    why: "A small run with the main details still to come.",
    schedule: pending("guide", "The guide reports a Sept. 8 reveal. That is a reveal date, not a sale date."),
    unknowns: ["Bottle name", "Age, proof, and price", "Sale day, time, and place"],
  }),
  record({ slot: null, slug: "silk-velvet-hazmat", brand: "Silk Velvet", name: "Hazmat Release",
    proof: fact("140", "guide", 140), why: "One for high-proof fans to try at the booth.",
    unknowns: ["Age, price, and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: 10, slug: "bluegrass-elkwood-19", brand: "Bluegrass Distillers", name: "Elkwood Reserve 19-Year Single Barrel",
    age: fact("19 years", "guide", 19), proof: fact("129 to 133", "guide", 129), batch: fact("Single barrel"),
    why: "One of the oldest bourbons on our list. The final barrel still matters.",
    schedule: { days: ["sat", "sun"], state: "reported", source: "guide", note: "The guide reports sales on Saturday and Sunday for the barrels chosen in the tasting." },
    unknowns: ["Final barrel and proof", "Sale time and booth location", "Price and bottle count"],
  }),
  record({ slot: 18, slug: "dark-arts-mizunara", brand: "Dark Arts", name: "Chief Alchemist Reserve Cuvée Mizunara",
    age: fact("19 years", "guide", 19), proof: fact("115", "guide", 115), finish: fact("Mizunara oak"),
    why: "Old bourbon with an oak finish we want to try.",
  }),
  record({ slot: 19, slug: "bluegrass-elkwood-11-hazmat", brand: "Bluegrass Distillers", name: "Elkwood Reserve 11-Year Hazmat",
    age: fact("11 years", "guide", 11), proof: fact("145 to 147", "guide", 145), batch: fact("Single barrel"),
    why: "One of the highest proofs on our list. The final pick is still pending.",
    schedule: { days: ["sat", "sun"], state: "reported", source: "guide", note: "The guide reports sales on Saturday and Sunday for the barrels chosen in the tasting." },
    unknowns: ["Final barrel and proof", "Sale time and booth location", "Price and bottle count"],
  }),
  record({ slot: 17, slug: "barrell-whiskey-decade-2", brand: "Barrell", name: "Whiskey Decade 2",
    age: fact("20 years", "guide", 20), proof: fact("141.3", "guide", 141.3), finish: fact("Spanish brandy and Hungarian oak casks"),
    why: "Old whiskey with two cask types makes this worth a stop.",
    statusNote: "The guide lists it for KBF. Bottle sales and quantities are still TBD.",
  }),
  record({ slot: 20, slug: "larrikin-golden-wattle", brand: "Larrikin", name: "Australia Series: Golden Wattle Finish",
    ...larrikinRelease("sat"), finish: fact("Golden wattle cask", "larrikin"),
    why: "A rare finish we want to taste next to the other two.",
  }),
  record({ slot: 16, slug: "larrikin-manuka", brand: "Larrikin", name: "Australia Series: Manuka Honey Finish",
    ...larrikinRelease("fri"), finish: fact("Manuka honey cask", "larrikin"),
    why: "The first of three Australian cask finishes to try.",
  }),
  record({ slot: 11, slug: "whistlepig-kbf-rye", brand: "WhistlePig", name: "12-Year KBF Vault Rye",
    age: fact("12 years", "guide", 12), finish: fact("Cabernet Franc, Amaro, and Syrah casks"), exclusive: fact("KBF only"),
    batch: fact("Single barrel"),
    statusNote: "The guide lists this 12-year KBF pick, chosen by the Vault team. Brand confirmation is pending.",
    lastCheckedAt: KBF_UPDATED_AT,
    updates: [
      { date: KBF_CHECKED_AT, note: "Added to our KBF watchlist. Sources checked." },
      { date: KBF_UPDATED_AT, note: "Checked the Vault team's 12-year KBF pick against the guide." },
    ],
    why: "A mix of wine and Amaro casks makes this rye stand out.",
    unknowns: ["Proof, price, and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: 12, slug: "augusta-private-reserve", brand: "Augusta Distillery", name: "KBF Private Reserve",
    ...festivalPick, proof: fact("125", "kbf", 125), batch: fact("Selected from 3 barrels"),
    why: "A festival pick with its age still under wraps.",
    unknowns: ["Age statement", "Price and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: 22, slug: "wilderness-trail-hall-of-fame", brand: "Wilderness Trail", name: "Shane & Pat Hall of Fame Wheated Bourbon",
    age: fact("10 years", "guide", 10), proof: fact("Cask strength"), batch: fact("Small batch"),
    why: "A wheated bourbon that marks a milestone for its founders.",
    unknowns: ["Exact proof, price, and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: null, slug: "dark-arts-double-oaked", brand: "Dark Arts", name: "13-Year Double-Oaked French Oak Bourbon",
    age: fact("13 years", "guide", 13), proof: fact("125.2", "guide", 125.2), finish: fact("French oak"),
    why: "A pick for those who like more oak in the glass.",
  }),
  record({ slot: null, slug: "thirty-one-lengths-wheated", brand: "Thirty-One Lengths", name: "15-Year Wheated Single Barrel",
    age: fact("15 years", "guide", 15), proof: fact("100", "guide", 100), batch: fact("Single barrel"),
    venue: fact("The Blending House space at KBF"),
    why: "Older wheated bourbon at a lower proof than most of this list.",
    unknowns: ["Sale day and time", "Price and bottle count", "Exact booth within The Blending House space"],
  }),
  record({ slot: null, slug: "dark-arts-oloroso", brand: "Dark Arts", name: "KBF Oloroso Single Barrel",
    age: fact("9 years", "kbf", 9), proof: fact("118.8", "kbf", 118.8), finish: fact("Oloroso sherry cask", "kbf"),
    batch: fact("Single barrel"),
    why: "A sherry cask pick for fans of finished bourbon.",
    statusNote: "The guide links Dark Arts to KBF's Barely Legal Oloroso pick. KBF lists its age and proof.",
  }),
  record({ slot: 24, slug: "makers-cellar-aged-2026", brand: "Maker's Mark", name: "Cellar Aged 2026",
    age: fact("11, 12 & 14 year blend", "makers", 11), proof: fact("112.1", "makers", 112.1),
    why: "A chance to find this year's Cellar Aged at the festival.",
    statusNote: "Maker's Mark confirms the bottle specs. The guide reports KBF drops.",
    schedule: { days: ["fri", "sat", "sun"], state: "reported", source: "guide", note: "The guide reports two daily drops, at VIP and general entry. Check the plan with Maker's Mark." },
    time: fact("VIP and general entry"),
    unknowns: ["Brand confirmation of KBF drop times", "Price and KBF bottle count", "Booth location"],
  }),
  record({ slot: 25, slug: "1792-xv", brand: "Barton 1792", name: "1792 XV",
    age: fact("15 years", "guide", 15), proof: fact("124.2", "guide", 124.2),
    why: "A high-age Barton release worth checking at the booth.",
    statusNote: "The guide lists 1792 XV among the festival pours. Bottle sales are still TBD.",
    unknowns: ["Bottle sales or pours only", "KBF price and count", "Sale day, time, and place"],
  }),
  record({ slot: 23, slug: "four-roses-obso", brand: "Four Roses", name: "KBF OBSO Private Selection",
    ...festivalPick, age: fact("10 years", "kbf", 10), proof: fact("120 to 123", "kbf", 120), batch: fact("Single barrel", "kbf"),
    why: "A pick for Four Roses fans who follow each recipe.",
    unknowns: ["Final bottled proof", "Price and bottle count", "Sale day, time, and place"],
  }),
  record({ slot: 2, slug: "silk-velvet-cask-strength", brand: "Silk Velvet", name: "Distillers' Row 134 Single Barrel",
    ...festivalPick, age: fact("7.5 years", "kbf", 7.5), proof: fact("134", "kbf", 134), batch: fact("Single barrel", "kbf"),
    why: "Three years in Dallas give this Kentucky barrel a twist.",
  }),
  record({ slot: 14, slug: "phifer-pavitt-late-night", brand: "Phifer Pavitt", name: "LATE NIGHT",
    ...phiferRelease,
    age: fact("11 years", "phifer", 11), proof: fact("107", "phifer", 107),
    finish: fact("13 months in DATE NIGHT Cabernet Sauvignon casks", "phifer"),
    why: "A long wine-cask finish gives this aged bourbon a new turn.",
  }),
  record({ slot: 15, slug: "jackson-purchase-kbf", brand: "Jackson Purchase", name: "KBF Cask Strength Single Barrel",
    proof: fact("Cask strength"), batch: fact("Single barrel"),
    statusNote: "The guide lists Jackson Purchase's cask-strength KBF barrel pick. Brand confirmation is pending.",
    why: "A festival single barrel we want to try at cask strength.",
    unknowns: ["Age and exact proof", "Price and bottle count", "Sale day, time, and place"],
    lastCheckedAt: KBF_UPDATED_AT,
    updates: [{ date: KBF_UPDATED_AT, note: "Added after checking the guide's KBF barrel pick." }],
  }),
  record({ slot: 21, slug: "phifer-pavitt-reserve", brand: "Phifer Pavitt", name: "RESERVE",
    ...phiferRelease,
    age: fact("12 years", "phifer", 12), proof: fact("115, cask strength", "phifer", 115),
    finish: fact("24 months in RESERVE Cabernet Sauvignon casks", "phifer"),
    why: "Two years in wine casks make this one worth a taste.",
  }),
].map((release) => ({
  ...release,
  updates: [...release.updates, {
    date: KBF_UPDATED_AT,
    note: release.slot === null ? "Parked. Not on the current watchlist." : `Matched to the master list at no. ${release.slot}.`,
  }],
}));

export const releases = allReleases
  .filter((release): release is ActiveRelease => release.slot !== null)
  .sort((a, b) => a.slot - b.slot);

export const statusLabels: Record<ReleaseStatus, string> = {
  confirmed: "Confirmed", reported: "Reported", watch: "Watch",
};
export const statusDescriptions: Record<ReleaseStatus, string> = {
  confirmed: "KBF or the brand lists it.",
  reported: "A named guide lists it. Some details need a brand check.",
  watch: "More details are due.",
};
export const dayLabels: Record<FestivalDay, string> = {
  thu: "Thu, Sept. 10", fri: "Fri, Sept. 11", sat: "Sat, Sept. 12", sun: "Sun, Sept. 13",
};
export function releasePath(release: Pick<Release, "slug">) { return `${KBF_PATH}/${release.slug}`; }
export function getRelease(slug: string) { return allReleases.find((release) => release.slug === slug); }
export function scheduleLabel(release: Release) {
  if (festivalDays.every((day) => release.schedule.days.includes(day))) return "Sept. 10 to 13";
  return release.schedule.days.length ? release.schedule.days.map((day) => dayLabels[day]).join(" / ") : "Day TBD";
}
export function sourceIdsFor(release: Release): SourceId[] {
  const facts = [release.age, release.proof, release.price, release.bottles, release.batch, release.finish, release.exclusive, release.venue, release.time];
  return [...new Set([release.source, release.schedule.source, ...facts.flatMap((value) => value ? [value.source] : [])])];
}
export function relatedReleases(release: Release) {
  return releases.filter((other) => other.slug !== release.slug)
    .sort((a, b) => Number(b.brand === release.brand) - Number(a.brand === release.brand) || Math.abs(a.slot - (release.slot ?? 0)) - Math.abs(b.slot - (release.slot ?? 0)))
    .slice(0, 3);
}

// Plan 6: reject broken content at build time, before any route can publish it.
export function validateReleases(records: Release[], vacantSlots: readonly number[] = openSlots) {
  const slugs = new Set<string>();
  const slots = new Set<number>();
  for (const slot of vacantSlots) {
    if (!Number.isInteger(slot) || slot < 1 || slot > MASTER_SLOT_COUNT || slots.has(slot)) throw new Error("Invalid open slot.");
    slots.add(slot);
  }
  for (const release of records) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(release.slug) || slugs.has(release.slug)) throw new Error(`Invalid or duplicate slug: ${release.slug}`);
    slugs.add(release.slug);
    if (release.slot !== null) {
      if (!Number.isInteger(release.slot) || release.slot < 1 || release.slot > MASTER_SLOT_COUNT || slots.has(release.slot)) throw new Error(`Invalid or duplicate slot: ${release.slot}`);
      slots.add(release.slot);
    }
    if (!Object.hasOwn(statusLabels, release.status)) throw new Error(`Bad status: ${release.slug}`);
    if (!release.lastCheckedAt || !Number.isFinite(Date.parse(release.lastCheckedAt))) throw new Error(`Missing check date: ${release.slug}`);
    if (JSON.stringify(release).includes("\u2014")) throw new Error(`Remove the em dash: ${release.slug}`);
    for (const id of sourceIdsFor(release)) {
      const source = releaseSources[id];
      if (!source || new URL(source.url).protocol !== "https:") throw new Error(`Invalid source: ${release.slug}`);
    }
    if (release.status === "confirmed" && releaseSources[release.source].kind === "report") throw new Error(`Confirmed release needs a brand or KBF source: ${release.slug}`);
    const { days, state, source } = release.schedule;
    if (!Object.hasOwn({ confirmed: 1, reported: 1, pending: 1 }, state) || days.some((day) => !Object.hasOwn(dayLabels, day)) || new Set(days).size !== days.length) throw new Error(`Invalid days: ${release.slug}`);
    if ((state === "pending") !== (days.length === 0)) throw new Error(`Day and state conflict: ${release.slug}`);
    if (state === "confirmed" && releaseSources[source].kind === "report") throw new Error(`Confirmed day needs a brand or KBF source: ${release.slug}`);
  }
  if (slots.size !== MASTER_SLOT_COUNT) throw new Error("Each master slot needs a bottle or an explicit open pick.");
}
validateReleases(allReleases);
