import { ChevronRight, House } from "lucide-react";
import { Metadata } from "next";
import FacebookFooterLink from "../../components/FacebookFooterLink";
import RetailerSearch, { type Retailer } from "../../components/RetailerSearch";
import retailersData from "../../data/retailers.json";

export const metadata: Metadata = {
  title: "Authorised Riftbound Retailers in Malaysia & Brunei | KC Games",
  description:
    "Find 172 authorised KC Games Riftbound TCG retailers across Malaysia and Brunei. Filter by store type — all stores, hobby gaming stores, or retail only stores — and get directions to your nearest stockist.",
  alternates: {
    canonical: "/retailers.html",
  },
  openGraph: {
    title: "Authorised Riftbound Retailers in Malaysia & Brunei | KC Games",
    description:
      "Find 172 authorised KC Games Riftbound TCG retailers across Malaysia and Brunei. Search by state, filter by store type, and get directions to your nearest stockist.",
    type: "article",
    url: "/retailers.html",
    siteName: "KC Games",
    locale: "en_MY",
    images: [
      {
        url: "/riftbound/riftbound-banner.jpg",
        width: 1600,
        height: 900,
        alt: "Riftbound Trading Card Game by KC Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authorised Riftbound Retailers in Malaysia & Brunei | KC Games",
    description:
      "Find 172 authorised KC Games Riftbound TCG retailers across Malaysia and Brunei. Search by state, filter by store type, and get directions to your nearest stockist.",
    images: ["/riftbound/riftbound-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const retailers = retailersData as Retailer[];

const retailersSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "KC Games Authorised Retailers",
  description:
    "Authorised KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei.",
  url: "https://www.kc-games.com/retailers.html",
  itemListElement: retailers.map((retailer, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Store",
      name: retailer.name,
      description: `Authorised KC Games Riftbound TCG retailer in ${retailer.region}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: retailer.address,
        addressCountry: retailer.country === "Brunei" ? "BN" : "MY",
      },
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${retailer.name}, ${retailer.address}`)}`,
    },
  })),
};

export default function RetailersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(retailersSchema),
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,59,83,0.85),_transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
            <a
              href="/"
              className="font-display text-xl font-bold tracking-tight text-silver-100 transition-colors hover:text-white"
              aria-label="KC Games Home"
            >
              KC Games
            </a>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-silver-300 md:flex">
              <a href="/" className="transition-colors hover:text-white">Home</a>
              <a href="/retailer.html" className="transition-colors hover:text-white">Sign Up as Retailer</a>
            </nav>
          </div>
        </header>

        <div className="relative mx-auto max-w-6xl px-6 pt-10 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between gap-4">
            <a
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-silver-400/20 bg-navy-900/60 text-silver-100 backdrop-blur-sm transition hover:border-silver-300/40 hover:bg-navy-800"
              aria-label="Home"
            >
              <House className="h-4 w-4" aria-hidden />
            </a>
            <div className="inline-flex items-center gap-2 rounded-full border border-silver-500/20 bg-silver-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-silver-200">
              Retailers
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Our Retail Network
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-navy-200">
              Find your nearest KC Games authorised retailer for Riftbound Trading Card Game products across Malaysia and Brunei.
            </p>
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <RetailerSearch retailers={retailers} />

          <div className="mt-16 rounded-3xl border border-navy-700/50 bg-card-gradient p-8 text-center shadow-2xl sm:p-12">
            <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Want to join the network?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-200">
              Become an authorised KC Games retailer and stock Riftbound Trading Card Game products in your store.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/retailer.html"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                <span className="relative flex items-center gap-2 font-display tracking-wider">
                  Sign Up as Retailer
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </span>
              </a>
              <a
                href="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-silver-400/20 bg-navy-900/60 text-silver-100 backdrop-blur-sm transition hover:border-silver-300/40 hover:bg-navy-800"
                aria-label="Home"
              >
                <House className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-4 pb-10 pt-6">
          <FacebookFooterLink className="text-silver-400" />
          <p className="text-sm text-navy-400">© 2026 KC Games Sdn Bhd. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
