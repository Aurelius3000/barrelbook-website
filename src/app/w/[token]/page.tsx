import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { APP_STORE_URL } from "@/lib/app-store";

type WantListPageProps = {
  params: Promise<{
    token: string;
  }>;
};

type PublicWantListItem = {
  rank: number;
  displayName: string;
  brand: string | null;
  bottleType: string | null;
  targetPrice: number | string | null;
  publicNote: string | null;
  thumbnailUrl: string | null;
  placeholderSeed: string | null;
};

type PublicTimestamp = string | number | Record<string, unknown> | null;

type PublicWantListSnapshot =
  | {
      status: "active";
      listName: string;
      listType: "want";
      updatedAt: PublicTimestamp;
      items: PublicWantListItem[];
    }
  | {
      status: "unavailable";
      items: [];
    };

const DEFAULT_PUBLIC_WANT_LIST_ENDPOINT =
  "https://us-central1-barrelbook-273cd.cloudfunctions.net/getPublicWantListShare";

const UNAVAILABLE_SNAPSHOT: PublicWantListSnapshot = {
  status: "unavailable",
  items: [],
};

const PLACEHOLDER_PALETTES = [
  ["#3A1D0D", "#D2691E", "#F2C19A"],
  ["#18211A", "#497A4B", "#D9E8C8"],
  ["#151E2B", "#4F7EA8", "#D4E7F7"],
  ["#2A1720", "#A84F6A", "#F1CED8"],
  ["#241F17", "#8F7650", "#E6D6B8"],
] as const;

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function decodeRouteValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeShareToken(token: string): string {
  return decodeRouteValue(token).trim();
}

function getPublicWantListEndpoint(): string {
  return (
    process.env.BARRELBOOK_PUBLIC_WANT_LIST_ENDPOINT_URL?.trim() ||
    process.env.BARRELBOOK_PUBLIC_SHARE_ENDPOINT_URL?.trim() ||
    DEFAULT_PUBLIC_WANT_LIST_ENDPOINT
  );
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function parseRank(value: unknown, fallback: number): number {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isFinite(numeric) || numeric < 1) {
    return fallback;
  }

  return Math.floor(numeric);
}

function parseTargetPrice(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    if (!cleaned) return null;

    const numeric = Number.parseFloat(cleaned.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  return null;
}

function parseHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function parseItem(value: unknown, fallbackRank: number): PublicWantListItem | null {
  if (!isRecord(value)) return null;

  const displayName = cleanText(value.displayName, 160);
  if (!displayName) return null;

  return {
    rank: parseRank(value.rank, fallbackRank),
    displayName,
    brand: cleanText(value.brand, 120),
    bottleType: cleanText(value.bottleType, 80),
    targetPrice: parseTargetPrice(value.targetPrice),
    publicNote: cleanText(value.publicNote, 300),
    thumbnailUrl: parseHttpsUrl(value.thumbnailUrl),
    placeholderSeed: cleanText(value.placeholderSeed, 120),
  };
}

function parseSnapshot(payload: unknown): PublicWantListSnapshot {
  if (!isRecord(payload)) return UNAVAILABLE_SNAPSHOT;

  const data = isRecord(payload.data) ? payload.data : null;
  if (!data || data.status !== "active") {
    return UNAVAILABLE_SNAPSHOT;
  }

  const listType = cleanText(data.listType, 40);
  if (listType && listType !== "want") {
    return UNAVAILABLE_SNAPSHOT;
  }

  const items = Array.isArray(data.items)
    ? data.items
        .map((item, index) => parseItem(item, index + 1))
        .filter((item): item is PublicWantListItem => item !== null)
        .sort((left, right) => left.rank - right.rank)
    : [];

  if (items.length === 0) {
    return UNAVAILABLE_SNAPSHOT;
  }

  return {
    status: "active",
    listName: cleanText(data.listName, 120) || "Shared Want List",
    listType: "want",
    updatedAt: isSupportedTimestamp(data.updatedAt) ? data.updatedAt : null,
    items,
  };
}

function isSupportedTimestamp(value: unknown): value is string | number | Record<string, unknown> {
  if (typeof value === "string" || typeof value === "number") return true;
  return isRecord(value);
}

async function fetchPublicWantListShare(token: string): Promise<PublicWantListSnapshot> {
  const normalizedToken = normalizeShareToken(token);
  if (!normalizedToken) return UNAVAILABLE_SNAPSHOT;

  try {
    const response = await fetch(getPublicWantListEndpoint(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ token: normalizedToken }),
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      return UNAVAILABLE_SNAPSHOT;
    }

    const payload: unknown = await response.json();
    return parseSnapshot(payload);
  } catch {
    return UNAVAILABLE_SNAPSHOT;
  }
}

function timestampToDate(value: PublicTimestamp): Date | null {
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (isRecord(value)) {
    const seconds = value.seconds ?? value._seconds;
    if (typeof seconds === "number") {
      const date = new Date(seconds * 1000);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  return null;
}

function formatUpdatedDate(value: PublicTimestamp): string | null {
  const date = timestampToDate(value);
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTargetPrice(value: PublicWantListItem["targetPrice"]): string | null {
  if (value === null) return null;

  const numeric =
    typeof value === "number"
      ? value
      : Number.parseFloat(value.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
  }).format(numeric);
}

function hashText(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getPlaceholderPalette(item: PublicWantListItem) {
  const seed = item.placeholderSeed || item.displayName;
  return PLACEHOLDER_PALETTES[hashText(seed) % PLACEHOLDER_PALETTES.length];
}

function getPlaceholderInitials(item: PublicWantListItem): string {
  const source = item.brand || item.displayName;
  const words = source
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);

  if (words.length === 0) return "BB";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function generateMetadata(): Metadata {
  const description =
    "View a shared BarrelBook Want list, then get BarrelBook to build or manage your own whiskey list.";

  return {
    title: "Shared Want List",
    description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
    openGraph: {
      type: "website",
      title: "Shared BarrelBook Want List",
      description,
    },
    twitter: {
      card: "summary",
      title: "Shared BarrelBook Want List",
      description,
    },
  };
}

export default async function WantListPage({ params }: WantListPageProps) {
  const { token } = await params;
  const snapshot = await fetchPublicWantListShare(token);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#333333] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BarrelBook home">
            <Image
              src="/BarrelBook%20Logo%20Large.png"
              alt="BarrelBook"
              width={220}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-[#D2691E]/40 bg-[#D2691E]/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#D2691E] hover:bg-[#D2691E]/20"
          >
            Get BarrelBook
          </a>
        </div>
      </header>

      {snapshot.status === "active" ? (
        <ActiveWantListView snapshot={snapshot} />
      ) : (
        <UnavailableWantListView />
      )}
    </main>
  );
}

function ActiveWantListView({
  snapshot,
}: {
  snapshot: Extract<PublicWantListSnapshot, { status: "active" }>;
}) {
  const updatedDate = formatUpdatedDate(snapshot.updatedAt);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F2C19A]">
            Shared Want List
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {snapshot.listName}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#CFCFCF]">
                A ranked BarrelBook Want list shared for gift ideas, store runs, or bottles worth watching.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 text-sm text-[#D4D4D4]">
              <span className="rounded-full border border-[#333333] bg-[#141414] px-3 py-2">
                {snapshot.items.length} {snapshot.items.length === 1 ? "bottle" : "bottles"}
              </span>
              {updatedDate ? (
                <span className="rounded-full border border-[#333333] bg-[#141414] px-3 py-2">
                  Updated {updatedDate}
                </span>
              ) : null}
            </div>
          </div>

          <ol className="mt-8 space-y-4">
            {snapshot.items.map((item, index) => (
              <WantListItemRow key={`${item.rank}-${item.displayName}-${index}`} item={item} />
            ))}
          </ol>
        </div>

        <aside className="rounded-lg border border-[#333333] bg-[#111111] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6 lg:sticky lg:top-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F2C19A]">
            Powered by BarrelBook
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Keep your bottle list in your pocket.</h2>
          <p className="mt-3 text-base leading-7 text-[#CFCFCF]">
            BarrelBook helps whiskey collectors scan bottles, track prices, and build lists they can use at stores, tastings, and with friends.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
            >
              Get BarrelBook
            </a>
          </div>
          <div className="mt-6 rounded-lg border border-[#D2691E]/30 bg-[#0A0A0A] p-4">
            <p className="text-sm leading-6 text-[#D4D4D4]">
              This page shows only the public fields the list owner chose to share. Private notes and collection details stay in BarrelBook.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function WantListItemRow({ item }: { item: PublicWantListItem }) {
  const targetPrice = formatTargetPrice(item.targetPrice);

  return (
    <li className="rounded-lg border border-[#2C2C2C] bg-[#111111] p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-start">
        <BottleArtwork item={item} />
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F2C19A]">
                #{item.rank}
              </div>
              <h2 className="mt-1 text-2xl font-semibold leading-tight text-white">
                {item.displayName}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.brand ? <ItemPill>{item.brand}</ItemPill> : null}
                {item.bottleType ? <ItemPill>{item.bottleType}</ItemPill> : null}
              </div>
            </div>
            {targetPrice ? (
              <div className="shrink-0 rounded-lg border border-[#D2691E]/35 bg-[#2A1B11] px-4 py-3 text-left sm:text-right">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F2C19A]">
                  Target
                </div>
                <div className="mt-1 text-xl font-semibold text-white">{targetPrice}</div>
              </div>
            ) : null}
          </div>

          {item.publicNote ? (
            <p className="mt-4 rounded-lg border border-[#2F2F2F] bg-[#0A0A0A] px-4 py-3 text-base leading-7 text-[#D4D4D4]">
              {item.publicNote}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function BottleArtwork({ item }: { item: PublicWantListItem }) {
  if (item.thumbnailUrl) {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-[#333333] bg-[#151515]">
        <div
          aria-label={`${item.displayName} thumbnail`}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
        />
      </div>
    );
  }

  const [from, to, text] = getPlaceholderPalette(item);

  return (
    <div
      className="flex h-24 w-24 items-center justify-center rounded-lg border border-[#333333] text-xl font-semibold"
      style={{
        background: `linear-gradient(145deg, ${from}, ${to})`,
        color: text,
      }}
      aria-label={`${item.displayName} placeholder`}
      role="img"
    >
      {getPlaceholderInitials(item)}
    </div>
  );
}

function ItemPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#333333] bg-[#171717] px-3 py-1 text-sm text-[#D4D4D4]">
      {children}
    </span>
  );
}

function UnavailableWantListView() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-[#333333] bg-[#111111] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F2C19A]">
            BarrelBook Want List
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            This shared list is unavailable.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
            The link may be expired, revoked, or mistyped. To protect collectors&apos; privacy, BarrelBook does not confirm whether a specific list exists.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D2691E] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#B85714]"
            >
              Get BarrelBook
            </a>
          </div>
          <div className="mt-7 rounded-lg border border-[#D2691E]/30 bg-[#0A0A0A] p-4">
            <p className="text-sm leading-6 text-[#D4D4D4]">
              BarrelBook public list pages only show recipient-safe fields chosen by the list owner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
