"use client";

import { ArrowUp, Map as MapIcon, MapPin, Search, Store, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Retailer = {
  id: number;
  name: string;
  address: string;
  region: string;
};

type RetailerSearchProps = {
  retailers: Retailer[];
};

const REGION_ORDER = [
  "BRUNEI",
  "JOHOR",
  "KUALA LUMPUR",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PENANG",
  "KEDAH",
  "PERAK",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "PAHANG",
];

function titleCaseRegion(region: string) {
  return region
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function regionAnchor(region: string) {
  return region.toLowerCase().replace(/\s+/g, "-");
}

function mapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
}

export default function RetailerSearch({ retailers }: RetailerSearchProps) {
  const [query, setQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToRegion = (region: string) => {
    const el = document.getElementById(regionAnchor(region));
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
    if (!q) return retailers;
    return retailers.filter((r) =>
      [r.name, r.address, r.region].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query, retailers]);

  const grouped = useMemo(() => {
    const regionMap = new Map<string, Retailer[]>();
    filtered.forEach((r) => {
      if (!regionMap.has(r.region)) regionMap.set(r.region, []);
      regionMap.get(r.region)!.push(r);
    });
    return REGION_ORDER.filter((region) => regionMap.has(region)).map((region) => ({
      region,
      retailers: regionMap.get(region)!,
    }));
  }, [filtered]);

  const availableRegions = useMemo(
    () => grouped.map(({ region }) => region),
    [grouped]
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

      {availableRegions.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {availableRegions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => scrollToRegion(region)}
              className="rounded-full border border-navy-700/50 bg-navy-900/60 px-3 py-1.5 text-xs font-semibold text-silver-300 transition-all hover:border-silver-500/40 hover:bg-navy-800 hover:text-white"
            >
              {titleCaseRegion(region)}
            </button>
          ))}
        </div>
      )}

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
        <div className="space-y-10">
          {grouped.map(({ region, retailers }) => (
            <section key={region} id={regionAnchor(region)}>
              <h3 className="mb-4 font-display text-xl font-semibold text-silver-100 sm:text-2xl">
                {titleCaseRegion(region)}
              </h3>

              <div className="hidden overflow-hidden rounded-3xl border border-navy-700/50 bg-navy-900/40 shadow-2xl md:block">
                <div className="grid grid-cols-[1.2fr_2fr] auto-rows-fr bg-navy-900/60 text-xs font-bold uppercase tracking-[0.2em] text-silver-400">
                  <div className="border-b border-navy-700/50 px-6 py-4">Retailer</div>
                  <div className="border-b border-navy-700/50 px-6 py-4">Address</div>

                  {retailers.map((retailer, index) => {
                    const isLast = index === retailers.length - 1;
                    const borderClass = isLast ? "" : "border-b border-navy-700/50";
                    return (
                      <div key={retailer.id} className="contents">
                        <div className={`group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-navy-800/50 ${borderClass}`}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 transition-all group-hover:ring-silver-500/50">
                            <Store className="h-5 w-5 text-silver-200 transition-colors group-hover:text-white" aria-hidden />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-semibold text-silver-100 transition-colors group-hover:text-white">
                              {retailer.name}
                            </h4>
                          </div>
                        </div>

                        <a
                          href={mapsUrl(retailer.name, retailer.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${retailer.name} address in Google Maps`}
                          className={`group/addr flex items-start gap-2 px-6 py-5 text-sm text-navy-300 transition-colors hover:bg-navy-800/50 hover:text-silver-200 ${borderClass}`}
                        >
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 transition-colors group-hover/addr:text-silver-300" aria-hidden />
                          <address className="not-italic leading-relaxed">
                            {retailer.address}
                          </address>
                          <MapIcon className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-navy-500 transition-colors group-hover/addr:text-silver-300" aria-hidden />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:hidden">
                {retailers.map((retailer) => (
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
                        <a
                          href={mapsUrl(retailer.name, retailer.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${retailer.name} address in Google Maps`}
                          className="group/addr mt-2 flex items-start gap-2 text-sm text-navy-300 transition-colors hover:text-silver-200"
                        >
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 transition-colors group-hover/addr:text-silver-300" aria-hidden />
                          <address className="not-italic leading-relaxed">
                            {retailer.address}
                          </address>
                          <MapIcon className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-navy-500 transition-colors group-hover/addr:text-silver-300" aria-hidden />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
