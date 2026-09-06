"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Search, SlidersHorizontal } from "lucide-react";
import {
  dayLabels, festivalDays, KBF_UPDATED_AT, KBF_PATH, openSlots, releasePath, releases, releaseSources,
  scheduleLabel, sourceIdsFor, statusDescriptions, statusLabels,
  type ActiveRelease, type Fact, type FestivalDay, type Release, type ReleaseStatus,
} from "@/lib/kbf-releases";

const shell = "mx-auto w-full max-w-[1380px] px-5 sm:px-8";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2AE79]";
const eyebrow = "text-[11px] font-medium uppercase tracking-[0.16em] text-[#E49B63]";
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const statuses: ReleaseStatus[] = ["confirmed", "reported", "watch"];
const days = festivalDays;
const statusColors: Record<ReleaseStatus, string> = {
  confirmed: "border-[#466249] bg-[#142219] text-[#ABD9B2]",
  reported: "border-[#725334] bg-[#241B12] text-[#F0BE85]",
  watch: "border-[#5D586E] bg-[#201D2A] text-[#CDC4E4]",
};

function CheckDate({ date = KBF_UPDATED_AT }: { date?: string }) {
  return <time dateTime={date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date(date))}</time>;
}

function StatusBadge({ status }: { status: ReleaseStatus }) {
  return <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusColors[status]}`}>
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabels[status]}
  </span>;
}

function SourceLink({ fact, compact = false }: { fact: Fact; compact?: boolean }) {
  const source = releaseSources[fact.source];
  return <a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.kind === "report" ? "Reported by" : "Source:"} ${source.name}`} className={`inline-flex items-center gap-1 text-[11px] text-[#BAB4AD] underline decoration-[#68615A] underline-offset-4 hover:text-white ${focus}`}>
    {source.kind === "report" ? "Reported" : "Source"}{!compact && `: ${source.name}`}<ArrowUpRight size={11} aria-hidden="true" />
  </a>;
}

function FactCell({ label, fact }: { label: string; fact: Fact | null }) {
  return <div className="min-w-0 border-b border-[#333] py-5">
    <dt className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[#A9A49E]">{label}</dt>
    <dd className="m-0 flex flex-col gap-2 text-[17px] leading-snug">
      {fact ? <><span>{fact.value}</span><SourceLink fact={fact} /></> : <span className="text-[#A9A49E]">TBD</span>}
    </dd>
  </div>;
}

function Frame({ children, detail = false }: { children: ReactNode; detail?: boolean }) {
  return <div className="min-h-screen bg-[#0A0A0A] font-[family-name:var(--font-geist-sans)] text-[#F3F0EB] selection:bg-[#D2691E]/40">
    <a href="#radar-content" className={`sr-only z-[100] rounded bg-[#F3F0EB] px-4 py-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4 ${focus}`}>Skip to content</a>
    <header className="border-b border-[#333] bg-[#0A0A0A]">
      <div className={`${shell} flex min-h-[76px] items-center justify-between gap-3`}>
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" aria-label="BarrelBook home" className={`shrink-0 ${focus}`}>
            <Image src="/BarrelBook%20Logo%20Large.png" alt="BarrelBook" width={160} height={55} className="h-auto w-[124px] sm:w-[150px]" priority />
          </Link>
          <Link href={KBF_PATH} className={`border-l border-[#555] pl-4 text-[12px] font-medium sm:text-[16px] ${focus}`}>Release Radar</Link>
        </div>
        <Link href={detail ? KBF_PATH : "/"} className={`hidden min-h-11 items-center gap-2 text-[12px] text-[#BEB8B1] hover:text-white sm:inline-flex ${focus}`}>
          {detail ? "Current watchlist" : "About BarrelBook"}<ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
    <main id="radar-content" tabIndex={-1}>{children}</main>
    <footer className={`${shell} pb-10`}>
      <div className="flex flex-col justify-between gap-4 border-t border-[#333] pt-6 text-[12px] text-[#AAA39B] sm:flex-row">
        <p>An independent watchlist by BarrelBook. Check the source before you go.</p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/" className={focus}>BarrelBook</Link><Link href="/privacy" className={focus}>Privacy</Link><Link href="/terms" className={focus}>Terms</Link>
        </nav>
      </div>
    </footer>
  </div>;
}

function ReleaseRow({ release }: { release: ActiveRelease }) {
  return <li className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-3 gap-y-4 border-b border-[#333] py-6 transition-colors hover:bg-[#121212] lg:grid-cols-[32px_minmax(0,1fr)_160px_146px] lg:items-center lg:gap-x-5" value={release.slot} data-release-slug={release.slug}>
    <span className="pt-1 font-[family-name:var(--font-geist-mono)] text-[15px] text-[#E49B63]" aria-label={`List number ${release.slot}`}>{String(release.slot).padStart(2, "0")}</span>
    <div className="min-w-0">
      <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#B0A9A1]">{release.brand}</p>
      <h3 className="mb-2 text-[18px] font-semibold leading-tight tracking-[-0.02em]">
        <Link href={releasePath(release)} className={`hover:text-[#F2AE79] ${focus}`}>{release.name}</Link>
      </h3>
      <p className="max-w-[440px] text-[12px] leading-relaxed text-[#B7B0A8]">{release.why}</p>
      <a className={`mt-2 inline-flex items-center gap-1 text-[11px] text-[#AAA39B] underline decoration-[#555] underline-offset-4 hover:text-white ${focus}`} href={releaseSources[release.source].url} target="_blank" rel="noopener noreferrer">
        {releaseSources[release.source].name}<ArrowUpRight size={11} aria-hidden="true" />
      </a>
    </div>
    <dl className="col-start-2 grid grid-cols-2 gap-4 lg:col-auto">
      {([ ["Age", release.age], ["Proof", release.proof] ] as const).map(([label, value]) => <div key={label}>
        <dt className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[#A9A49E]">{label}</dt>
        <dd className="flex flex-col gap-2 text-[13px] leading-snug"><span>{value?.value ?? "TBD"}</span>{value && <SourceLink fact={value} compact />}</dd>
      </div>)}
    </dl>
    <div className="col-start-2 flex items-center justify-between gap-3 lg:col-auto lg:block lg:border-l lg:border-[#444] lg:pl-4">
      <div>
        <StatusBadge status={release.status} />
        <p className="mt-2 text-[12px] text-[#DBD5CE]">{scheduleLabel(release)}</p>
        <p className="mt-1 text-[10px] text-[#AAA39B]">{release.schedule.state === "reported" ? "Reported days" : release.schedule.state === "confirmed" ? "Day confirmed" : "Sale details pending"}</p>
      </div>
      <Link href={releasePath(release)} aria-label={`Details for ${release.brand} ${release.name}`} className={`inline-flex min-h-11 min-w-11 items-center justify-center text-[#E49B63] lg:hidden ${focus}`}><ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </li>;
}

// Plan 4: filters use typed numbers and source-backed dates, never parsed copy.
function Watchlist() {
  const [day, setDay] = useState<FestivalDay | "all" | "pending">("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReleaseStatus | "all">("all");
  const [exclusive, setExclusive] = useState(false);
  const [older, setOlder] = useState(false);
  const [stronger, setStronger] = useState(false);
  const clear = () => { setDay("all"); setQuery(""); setStatus("all"); setExclusive(false); setOlder(false); setStronger(false); };
  const normalize = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "");
  const filtered = releases.filter((release) =>
    (day === "all" || (day === "pending" ? release.schedule.days.length === 0 : release.schedule.days.includes(day))) &&
    normalize(`${release.brand} ${release.name} ${release.why}`).includes(normalize(query.trim())) &&
    (status === "all" || release.status === status) &&
    (!exclusive || release.exclusive !== null) && (!older || (release.age?.minimum ?? 0) >= 10) && (!stronger || (release.proof?.minimum ?? 0) >= 120));
  const unfiltered = day === "all" && !query.trim() && status === "all" && !exclusive && !older && !stronger;
  const tabs = [
    { id: "all" as const, label: "All bottles", count: releases.length },
    ...days.map((value) => ({ id: value, label: dayLabels[value], count: releases.filter((r) => r.schedule.days.includes(value)).length })),
    { id: "pending" as const, label: "Day TBD", count: releases.filter((r) => r.schedule.days.length === 0).length },
  ];
  const fields = <>
    <div className="mb-6 flex items-center justify-between gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em]">Refine the list</span>
      <button onClick={clear} className={`min-h-11 px-2 text-[12px] text-[#F2AE79] hover:text-white ${focus}`}>Clear all</button>
    </div>
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-[#BDB5AC]">Search bottles</span>
      <span className="relative block"><Search size={16} aria-hidden="true" className="absolute left-3 top-3.5 text-[#AAA39B]" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bottle or brand" className={`min-h-11 w-full rounded border border-[#4A4540] bg-[#171513] py-2 pl-9 pr-3 text-[16px] placeholder:text-[#A59C92] ${focus}`} /></span>
    </label>
    <label className="mt-6 block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-[#BDB5AC]">KBF status</span>
      <select value={status} onChange={(event) => setStatus(event.target.value as ReleaseStatus | "all")} className={`min-h-11 w-full rounded border border-[#4A4540] bg-[#171513] px-3 text-[14px] ${focus}`}>
        <option value="all">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}
      </select>
    </label>
    <fieldset className="mt-6 border-t border-[#333] pt-4">
      <legend className="px-1 text-[11px] uppercase tracking-[0.1em] text-[#BDB5AC]">Bottle details</legend>
      {([{ label: "KBF only", value: exclusive, set: setExclusive }, { label: "10+ years", value: older, set: setOlder }, { label: "120+ proof", value: stronger, set: setStronger }]).map((filter) => <label key={filter.label} className="flex min-h-11 cursor-pointer items-center gap-3 text-[13px]">
        <input type="checkbox" checked={filter.value} onChange={(event) => filter.set(event.target.checked)} className={`h-4 w-4 accent-[#D2691E] ${focus}`} />{filter.label}
      </label>)}
    </fieldset>
    <div className="mt-5 border-t border-[#333] pt-5">
      <p className="text-[13px] text-[#F2AE79]">Read the labels</p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#B7B0A8]">List order is not a rating. A listed bottle may be a pour only.</p>
    </div>
  </>;
  return <Frame>
    <section className={`${shell} flex flex-col justify-between gap-8 pb-10 pt-14 sm:pt-20 lg:flex-row lg:items-end`}>
      <div>
        <p className={`${eyebrow} mb-4`}>Kentucky Bourbon Festival 2026</p>
        <h1 style={serif} className="mb-5 text-[48px] leading-[1.02] tracking-[-0.05em] sm:text-[72px]">Plan your KBF<br />bottle hunt.</h1>
        <p className="max-w-[530px] text-[16px] leading-relaxed text-[#C2BAB1]">{releases.length} bottles to watch. See the specs, check the sources, and plan your stops.</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#BDB5AC]">
          <span>List updated <CheckDate /></span><span className="inline-flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" />Sept. 10 to 13 · Bardstown, KY</span>
        </div>
      </div>
      <aside className="flex items-center gap-4 border-l border-[#D2691E] pl-5 lg:mb-2 lg:max-w-[285px]">
        <span style={serif} className="text-[64px] leading-none text-[#E49B63]">{releases.length}</span>
        <div><p className="text-[17px] font-medium">bottles on our radar</p><p className="mt-1 text-[12px] leading-relaxed text-[#B7B0A8]">{openSlots.length ? `${openSlots.length} pick${openSlots.length === 1 ? "" : "s"} still open.` : "All picks are in."} New details may change the list.</p></div>
      </aside>
    </section>
    <div className={shell}>
      <div role="group" aria-label="Filter by sale day" className="grid grid-cols-3 overflow-hidden rounded border border-[#3D3833] sm:grid-cols-6">
        {tabs.map((tab) => <button key={tab.id} type="button" aria-pressed={day === tab.id} aria-controls="release-list" onClick={() => setDay(tab.id)} className={`min-h-[74px] border-r border-[#3D3833] px-2 py-3 text-[12px] last:border-r-0 sm:text-[14px] ${day === tab.id ? "bg-[#1A1612] text-[#F3F0EB] shadow-[inset_0_-2px_#D2691E]" : "text-[#C2BAB1] hover:bg-[#151311]"} ${focus}`}>
          {tab.label}<span className={`mt-1 block text-[11px] ${day === tab.id ? "text-[#F2AE79]" : "text-[#AAA39B]"}`}>{tab.count}</span>
        </button>)}
      </div>
      <p className="mt-3 text-[11px] text-[#AAA39B]">Day filters include reported plans. Bottles can appear on more than one day. Times are Eastern.</p>
    </div>
    <div className={`${shell} grid gap-7 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10`}>
      <aside aria-label="Bottle filters" className="self-start rounded border border-[#333] bg-[#0E0D0C] p-5">
        <details className="lg:hidden"><summary className={`flex min-h-11 cursor-pointer items-center gap-2 text-[14px] ${focus}`}><SlidersHorizontal size={16} aria-hidden="true" />Search and filters</summary><div className="pt-3">{fields}</div></details>
        <div className="hidden lg:block">{fields}</div>
      </aside>
      <section aria-labelledby="watchlist-title" className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className={`${eyebrow} mb-2`}>The BarrelBook watchlist</p><h2 id="watchlist-title" style={serif} className="text-[32px] tracking-[-0.035em] sm:text-[36px]">What we’re watching.</h2></div>
          <p role="status" aria-live="polite" aria-atomic="true" className="pb-1 text-[12px] text-[#C2BAB1]">{filtered.length} of {releases.length} bottles</p>
        </div>
        <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2">
          {statuses.map((value) => <span key={value} title={statusDescriptions[value]}><StatusBadge status={value} /></span>)}
          <a href="#source-labels" className={`inline-flex items-center text-[11px] text-[#C2BAB1] underline underline-offset-4 ${focus}`}>What these mean</a>
        </div>
        <ol id="release-list" aria-label="KBF bottle watchlist" className="border-t border-[#333]">{filtered.map((release) => <ReleaseRow key={release.slug} release={release} />)}</ol>
        {/* Master sync 3: an open pick is not a bottle, result, or detail link. */}
        {unfiltered && openSlots.map((slot) => <aside key={slot} data-open-slot={slot} aria-label={`Open pick ${slot}`} className="mt-6 flex gap-4 rounded border border-dashed border-[#725334] bg-[#14110E] p-5">
          <span className="pt-1 font-[family-name:var(--font-geist-mono)] text-[15px] text-[#E49B63]">{String(slot).padStart(2, "0")}</span>
          <div><h3 className="text-[18px] font-medium">Pick still open</h3><p className="mt-2 text-[13px] leading-relaxed text-[#B7B0A8]">We haven’t chosen this bottle yet.</p></div>
        </aside>)}
        {filtered.length === 0 && <div className="py-14 text-center">
          <h3 style={serif} className="text-[28px]">No bottles match.</h3><p className="mt-3 text-[14px] text-[#C2BAB1]">Try another search or clear the filters.</p>
          <button onClick={clear} className={`mt-5 min-h-11 rounded border border-[#93633C] px-5 text-[14px] text-[#F2AE79] ${focus}`}>Show all {releases.length}</button>
        </div>}
      </section>
    </div>
    <section id="source-labels" className={`${shell} scroll-mt-8 pb-16`} aria-labelledby="source-labels-title">
      <div className="border-t border-[#333] pt-8"><h2 id="source-labels-title" style={serif} className="mb-5 text-[28px]">Know what’s confirmed.</h2>
        <dl className="grid gap-5 sm:grid-cols-3">{statuses.map((value) => <div key={value}><dt><StatusBadge status={value} /></dt><dd className="mt-3 text-[13px] text-[#C2BAB1]">{statusDescriptions[value]}</dd></div>)}</dl>
        <p className="mt-6 text-[12px] text-[#AAA39B]">These are our picks. A source confirms a claim, not current stock. Each bottle page lists the gaps.</p>
      </div>
    </section>
  </Frame>;
}

function Detail({ release, related }: { release: Release; related: Release[] }) {
  const sources = sourceIdsFor(release);
  const parked = release.slot === null;
  return <Frame detail>
    <div className={`${shell} pb-16`}>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 py-8 text-[12px] text-[#BDB5AC]">
        <Link href={KBF_PATH} className={`inline-flex min-h-11 items-center gap-2 hover:text-white ${focus}`}><ArrowLeft size={14} aria-hidden="true" />KBF watchlist</Link><span aria-hidden="true">/</span><span aria-current="page">{release.brand}</span>
      </nav>
      {parked && <aside aria-label="Watchlist status" className="mb-8 rounded border border-[#725334] bg-[#17120E] p-5">
        <p className="text-[17px] font-medium text-[#F2AE79]">Off the current watchlist</p><p className="mt-2 text-[14px] text-[#C2BAB1]">This bottle is parked. Its details stay here for reference.</p>
        <Link href={KBF_PATH} className={`mt-3 inline-flex min-h-11 items-center gap-2 text-[13px] text-[#F2AE79] underline underline-offset-4 ${focus}`}>See current picks<ArrowRight size={14} aria-hidden="true" /></Link>
      </aside>}
      <section className="grid gap-6 border-b border-[#333] pb-10 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-8">
        <div className="flex items-center gap-4 border-l border-[#D2691E] pl-4 sm:block sm:self-start">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#BDB5AC]">{parked ? "List status" : "List no."}</p>
          <p style={serif} className={parked ? "text-[24px] leading-tight text-[#C2BAB1]" : "text-[50px] leading-tight text-[#E49B63] sm:text-[60px]"}>{parked ? "Parked" : `#${String(release.slot).padStart(2, "0")}`}</p>
        </div>
        <div className="min-w-0">
          <p className={`${eyebrow} mb-3`}>{release.brand}</p>
          <h1 style={serif} className="max-w-[990px] text-[42px] leading-[1.05] tracking-[-0.045em] sm:text-[60px] lg:text-[72px]">{release.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4"><StatusBadge status={release.status} /><p className="text-[12px] text-[#BDB5AC]">Last checked <CheckDate date={release.lastCheckedAt} /></p></div>
          <p className="mt-4 max-w-[720px] text-[14px] leading-relaxed text-[#C2BAB1]">{release.statusNote}</p>
          <div className="mt-7"><h2 className={`${eyebrow} mb-2`}>{parked ? "Why it caught our eye" : "Why we’re watching"}</h2><p className="max-w-[720px] text-[18px] leading-relaxed text-[#E2DCD5]">{release.why}</p></div>
        </div>
      </section>
      <div className="grid items-start gap-6 py-9 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded border border-[#333] p-6 sm:p-8" aria-labelledby="known-title">
          <p className={`${eyebrow} mb-3`}>Bottle details</p><h2 id="known-title" style={serif} className="text-[32px] tracking-[-0.035em]">What we know.</h2>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 border-t border-[#333]">
            <FactCell label="Age" fact={release.age} /><FactCell label="Proof" fact={release.proof} /><FactCell label="Price" fact={release.price} /><FactCell label="Bottle count" fact={release.bottles} />
            {release.batch && <FactCell label="Batch" fact={release.batch} />}{release.finish && <FactCell label="Finish" fact={release.finish} />}{release.exclusive && <FactCell label="Release" fact={release.exclusive} />}
          </dl>
        </section>
        <aside className="rounded border border-[#6C4B2D] bg-[#17120E] p-6 sm:p-8" aria-labelledby="find-title">
          <p className={`${eyebrow} mb-3`}>Find it at KBF</p><h2 id="find-title" style={serif} className="text-[30px] leading-tight tracking-[-0.035em]">{scheduleLabel(release)}</h2>
          <p className="mt-3 text-[12px] text-[#F0BE85]">{release.schedule.state === "reported" ? "Reported plan" : release.schedule.state === "confirmed" ? "Day confirmed" : "Sale plan pending"}</p>
          <p className="mt-4 text-[14px] leading-relaxed text-[#C2BAB1]">{release.schedule.note}</p>
          <div className="mt-3"><SourceLink fact={{ value: "Schedule", source: release.schedule.source }} /></div>
          <dl className="mt-3"><FactCell label="Sale time (Eastern)" fact={release.time} /><FactCell label="Place" fact={release.venue} /></dl>
        </aside>
      </div>
      <section className="border-t border-[#333] py-8" aria-labelledby="unknown-title">
        <h2 id="unknown-title" style={serif} className="text-[30px]">What we don’t know.</h2>
        <ul className="mt-4 grid list-inside list-disc gap-3 text-[14px] text-[#C2BAB1] sm:grid-cols-2">{release.unknowns.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="grid gap-6 border-y border-[#333] py-8 sm:grid-cols-[1fr_1.4fr]" aria-labelledby="sources-title">
        <div><p className={`${eyebrow} mb-3`}>Check the source</p><h2 id="sources-title" style={serif} className="text-[32px]">Where the details came from.</h2><p className="mt-4 text-[13px] text-[#BDB5AC]">Checked <CheckDate date={release.lastCheckedAt} />. Plans can change.</p></div>
        <ul className="space-y-3">{sources.map((id) => { const source = releaseSources[id]; return <li key={id}>
          <a href={source.url} target="_blank" rel="noopener noreferrer" className={`flex min-h-[72px] items-center justify-between gap-4 rounded border border-[#49392A] px-5 py-4 hover:bg-[#201810] ${focus}`}>
            <span><span className="block text-[14px] text-[#F2AE79]">{source.name}</span><span className="mt-1 block text-[12px] text-[#BDB5AC]">{source.note}</span></span><ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-[#E49B63]" />
          </a>
        </li>; })}</ul>
      </section>
      <section className="py-8" aria-labelledby="updates-title"><h2 id="updates-title" className={eyebrow}>Updates</h2><ul className="mt-3 space-y-2 text-[12px] text-[#BDB5AC]">{release.updates.map((update) => <li key={`${update.date}-${update.note}`}><CheckDate date={update.date} />: {update.note}</li>)}</ul></section>
      <section className="pt-4" aria-labelledby="related-title"><p className={`${eyebrow} mb-3`}>Keep exploring</p><h2 id="related-title" style={serif} className="text-[32px]">Also on our list.</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">{related.map((other) => <li key={other.slug}>
          <Link href={releasePath(other)} className={`group flex h-full flex-col gap-3 rounded border border-[#333] p-5 hover:border-[#93633C] hover:bg-[#16120F] ${focus}`}>
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#BDB5AC]">#{other.slot} · {other.brand}</span><span className="text-[17px] font-medium leading-snug group-hover:text-[#F2AE79]">{other.name}</span><span className="mt-auto"><StatusBadge status={other.status} /></span>
          </Link>
        </li>)}</ul>
      </section>
    </div>
  </Frame>;
}

export default function ReleaseRadar({ release, related = [] }: { release?: Release; related?: Release[] }) {
  return release ? <Detail release={release} related={related} /> : <Watchlist />;
}
