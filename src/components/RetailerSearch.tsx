"use client";

import { ArrowUp, Check, Map as MapIcon, MapPin, Search, Store, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type Retailer = {
  id: number;
  name: string;
  address: string;
  region: string;
  country: "Malaysia" | "Brunei";
  playing: boolean;
  storeType: "hobby" | "retail";
};

type RetailerSearchProps = {
  retailers: Retailer[];
};

type RegionDef = { key: string; label: string };

type SuperGroup = {
  name: string;
  regions: RegionDef[];
  isCountry?: boolean;
};

const SUPER_GROUPS: SuperGroup[] = [
  {
    name: "Peninsular Malaysia",
    regions: [
      { key: "JOHOR", label: "Johor" },
      { key: "KEDAH", label: "Kedah" },
      { key: "KELANTAN", label: "Kelantan" },
      { key: "KUALA LUMPUR", label: "Kuala Lumpur" },
      { key: "MELAKA", label: "Melaka" },
      { key: "NEGERI SEMBILAN", label: "Negeri Sembilan" },
      { key: "PAHANG", label: "Pahang" },
      { key: "PENANG", label: "Pulau Pinang" },
      { key: "PERAK", label: "Perak" },
      { key: "PERLIS", label: "Perlis" },
      { key: "PUTRAJAYA", label: "Putrajaya" },
      { key: "SELANGOR", label: "Selangor" },
      { key: "TERENGGANU", label: "Terengganu" },
    ],
  },
  {
    name: "East Malaysia",
    regions: [
      { key: "SABAH", label: "Sabah" },
      { key: "SARAWAK", label: "Sarawak" },
      { key: "LABUAN", label: "Labuan" },
    ],
  },
  {
    name: "Brunei",
    isCountry: true,
    regions: [{ key: "BRUNEI", label: "Brunei" }],
  },
];

function regionAnchor(key: string) {
  return key.toLowerCase().replace(/\s+/g, "-");
}

function normalizeAddress(address: string) {
  return address
    .replace(/\s+/g, " ")
    .replace(/\s*\.\s*(?:\d{1,2}\.\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}\.\d{2}\s*(?:AM|PM|am|pm))\.?/g, "")
    .replace(/\s*(?:\.|,)?\s*01\d[-\s]?\d{7,8}\b/g, "")
    .replace(/\bJln\b/gi, "JALAN")
    .replace(/\bW\.P\.\s*Kuala Lumpur\b/g, "Kuala Lumpur")
    .replace(/\bFederal Territory of Kuala Lumpur\b/g, "Kuala Lumpur")
    .replace(/\bWilayah Persekutuan Kuala Lumpur\b/g, "Kuala Lumpur")
    .replace(/\bJohor Darul Ta'zim\b/g, "Johor")
    .replace(/\bMY\b/g, "Malaysia")
    .replace(/\s+,/g, ",")
    .replace(/,{2,}/g, ",")
    .replace(/\s*\.\s*$/g, "")
    .trim();
}

function mapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${normalizeAddress(address)}`)}`;
}

export default function RetailerSearch({ retailers }: RetailerSearchProps) {
  const [query, setQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "hobby" | "retail">("all");

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToRegion = (key: string) => {
    const el = document.getElementById(regionAnchor(key));
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = retailers;

    if (filterMode !== "all") {
      list = list.filter((r) => r.storeType === filterMode);
    }

    if (!q) return list;
    return list.filter((r) =>
      [r.name, r.address, r.region, r.country].some((field) => field.toLowerCase().includes(q))
    );
  }, [filterMode, query, retailers]);

  const regionMap = useMemo(() => {
    const map = new Map<string, Retailer[]>();
    filtered.forEach((r) => {
      if (!map.has(r.region)) map.set(r.region, []);
      map.get(r.region)!.push(r);
    });
    map.forEach((items) => items.sort((a, b) => a.name.localeCompare(b.name, "en-MY", { sensitivity: "base" })));
    return map;
  }, [filtered]);

  const grouped = useMemo(
    () =>
      SUPER_GROUPS.map((group) => ({
        ...group,
        regions: group.regions
          .filter((region) => regionMap.has(region.key))
          .map((region) => ({
            ...region,
            retailers: regionMap.get(region.key)!,
          })),
      })).filter((group) => group.regions.length > 0),
    [regionMap]
  );

  const countLabel = `${filtered.length} location${filtered.length === 1 ? "" : "s"}`;

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-navy-400" aria-hidden />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search retailer, city, state..."
            className="w-full rounded-xl border border-navy-700/50 bg-navy-900/60 py-3 pl-11 pr-10 text-sm text-white placeholder-navy-400 shadow-sm transition-all focus:border-silver-500/50 focus:bg-navy-800/60 focus:outline-none focus:ring-1 focus:ring-silver-500/30"
            aria-label="Search retailers"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-navy-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="text-sm font-medium text-navy-300">{countLabel}</p>
      </div>

      <div className="mb-8 space-y-4">
        {SUPER_GROUPS.map((group) => {
          const groupHasResults = group.regions.some((r) => regionMap.has(r.key));

          return (
            <div
              key={group.name}
              aria-disabled={!groupHasResults}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 transition-opacity sm:p-4 ${
                group.isCountry
                  ? "border-amber-400/20 bg-amber-400/10"
                  : "border-white/15 bg-white/5"
              } ${groupHasResults ? "" : "opacity-40"}`}
            >
              <span
                className={`shrink-0 text-xs font-bold uppercase tracking-[0.2em] ${
                  group.isCountry ? "text-amber-300" : "text-silver-300"
                }`}
              >
                {group.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.regions.map((region) => {
                  const hasResults = regionMap.has(region.key);

                  return (
                    <button
                      key={region.key}
                      type="button"
                      onClick={() => scrollToRegion(region.key)}
                      disabled={!hasResults}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:bg-navy-950/60 disabled:text-navy-600 ${
                        group.isCountry
                          ? "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25 hover:text-white disabled:bg-amber-950/20 disabled:text-amber-900/70"
                          : "bg-navy-900/60 text-silver-300 hover:bg-navy-800 hover:text-white"
                      }`}
                    >
                      {region.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            aria-pressed={filterMode === "all"}
            className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
              filterMode === "all"
                ? "border-silver-400/40 bg-silver-400/15 text-silver-100"
                : "border-silver-400/20 bg-navy-950/60 text-navy-400 hover:text-silver-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("hobby")}
            aria-pressed={filterMode === "hobby"}
            className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
              filterMode === "hobby"
                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200"
                : "border-emerald-500/20 bg-navy-950/60 text-navy-400 hover:text-emerald-300"
            }`}
          >
            {filterMode === "hobby" && <Check className="h-3.5 w-3.5" aria-hidden />}
            Hobby Gaming Stores
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("retail")}
            aria-pressed={filterMode === "retail"}
            className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
              filterMode === "retail"
                ? "border-amber-500/40 bg-amber-500/20 text-amber-200"
                : "border-amber-500/20 bg-navy-950/60 text-navy-400 hover:text-amber-300"
            }`}
          >
            {filterMode === "retail" && <Check className="h-3.5 w-3.5" aria-hidden />}
            Retail Only Stores
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-navy-700/50 bg-navy-900/40 p-12 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-800/60">
            <Search className="h-5 w-5 text-navy-400" aria-hidden />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-silver-100">No retailers found</h3>
          <p className="mt-2 text-sm text-navy-300">Try a different city, state, or shop name.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-navy-800"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {grouped.map((group) => (
            <div key={group.name}>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-navy-700/50" />
                <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">
                  {group.isCountry ? `- ${group.name} -` : group.name}
                </h2>
                <div className="h-px flex-1 bg-navy-700/50" />
              </div>

              <div className="space-y-10">
                {group.regions.map(({ key, label, retailers }) => (
                  <section key={key} id={regionAnchor(key)}>
                    {!group.isCountry && (
                      <h3 className="mb-4 font-display text-xl font-semibold text-silver-100 sm:text-2xl">{label}</h3>
                    )}

                    <div className="hidden overflow-hidden rounded-3xl border border-navy-700/50 bg-navy-900/40 shadow-2xl md:block">
                      <div className="grid grid-cols-[1.2fr_2fr] bg-navy-900/60 text-xs font-bold uppercase tracking-[0.2em] text-silver-400">
                        <div className="border-b border-navy-700/50 px-6 py-3">Retailer</div>
                        <div className="border-b border-navy-700/50 px-6 py-3">Address</div>

                        {retailers.map((retailer, index) => {
                          const isLast = index === retailers.length - 1;
                          const borderClass = isLast ? "" : "border-b border-navy-700/50";
                          return (
                            <div key={retailer.id} className="contents">
                              <div
                                className={`group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-navy-800/50 ${borderClass}`}
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 transition-all group-hover:ring-silver-500/50">
                                  <Store className="h-5 w-5 text-silver-200 transition-colors group-hover:text-white" aria-hidden />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-display font-semibold text-silver-100 transition-colors group-hover:text-white">
                                    {retailer.name}
                                  </h4>
                                  {retailer.playing && (
                                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                      <Check className="h-3 w-3" aria-hidden />
                                      Playing location
                                    </span>
                                  )}
                                </div>
                              </div>

                              <a
                                href={mapsUrl(retailer.name, retailer.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${retailer.name} address in Google Maps`}
                                className={`group/addr flex items-start gap-2 px-6 py-5 text-sm text-navy-300 transition-colors hover:bg-navy-800/50 hover:text-silver-200 ${borderClass}`}
                              >
                                <MapPin
                                  className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 transition-colors group-hover/addr:text-silver-300"
                                  aria-hidden
                                />
                                <address className="min-w-0 flex-1 not-italic leading-relaxed">{normalizeAddress(retailer.address)}</address>
                                <MapIcon
                                  className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-navy-500 transition-colors group-hover/addr:text-silver-300"
                                  aria-hidden
                                />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 md:hidden">
                      {retailers.map((retailer) => {
                        return (
                          <article
                            key={retailer.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/60 p-5 transition-all hover:border-silver-500/40 hover:bg-navy-800/80"
                          >
                            <div className="absolute inset-0 bg-foil opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none rounded-2xl" />
                            <div className="relative flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 group-hover:ring-silver-500/50">
                                <Store className="h-5 w-5 text-silver-200 transition-colors group-hover:text-white" aria-hidden />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-display font-semibold text-silver-100 transition-colors group-hover:text-white">
                                  {retailer.name}
                                </h4>
                                {retailer.playing && (
                                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                    <Check className="h-3 w-3" aria-hidden />
                                    Playing location
                                  </span>
                                )}
                                <a
                                  href={mapsUrl(retailer.name, retailer.address)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open ${retailer.name} address in Google Maps`}
                                  className="group/addr mt-2 flex items-start gap-2 text-sm text-navy-300 transition-colors hover:text-silver-200"
                                >
                                  <MapPin
                                    className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 transition-colors group-hover/addr:text-silver-300"
                                    aria-hidden
                                  />
                                  <address className="min-w-0 flex-1 not-italic uppercase leading-relaxed">{normalizeAddress(retailer.address)}</address>
                                  <MapIcon
                                    className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-navy-500 transition-colors group-hover/addr:text-silver-300"
                                    aria-hidden
                                  />
                                </a>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-navy-700/50 bg-navy-900/80 text-silver-200 shadow-lg backdrop-blur-sm transition-all hover:border-silver-500/50 hover:bg-navy-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-silver-500/40 ${
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </button>
    </>
  );
}
