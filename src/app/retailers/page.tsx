import { MapPin, Store, ChevronRight, MapPinCheck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retailer List — KC Games Sdn Bhd",
  description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei. Find your nearest stockist.",
  alternates: {
    canonical: "https://www.kc-games.com/retailers.html",
  },
  openGraph: {
    title: "Retailer List — KC Games Sdn Bhd",
    description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei. Find your nearest stockist.",
    type: "website",
    url: "https://www.kc-games.com/retailers.html",
    siteName: "KC Games",
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retailer List — KC Games Sdn Bhd",
    description: "Official KC Games Riftbound Trading Card Game retailers across Malaysia and Brunei.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const retailers = [
  {
    id: 1,
    name: "Game Haven KL",
    address: "Lot 3-12, Level 3, Mid Valley Megamall, Lingkaran Syed Putra, 59200 Kuala Lumpur",
    city: "Kuala Lumpur",
    region: "Wilayah Persekutuan",
    phone: "+60 3-2287 1234",
  },
  {
    id: 2,
    name: "Card Quest Penang",
    address: "G-42, Gurney Paragon Mall, Persiaran Gurney, 10250 George Town",
    city: "George Town",
    region: "Penang",
    phone: "+60 4-261 5555",
  },
  {
    id: 3,
    name: "Tabletop Arena JB",
    address: "No. 17, Jalan Molek 1/10, Taman Molek, 81100 Johor Bahru",
    city: "Johor Bahru",
    region: "Johor",
    phone: "+60 7-351 8899",
  },
  {
    id: 4,
    name: "Dice & Dragons Kota Kinabalu",
    address: "Lot 2-08, Suria Sabah Shopping Mall, Jalan Tun Fuad Stephens, 88000 Kota Kinabalu",
    city: "Kota Kinabalu",
    region: "Sabah",
    phone: "+60 88-223 456",
  },
  {
    id: 5,
    name: "Mana Vault Kuching",
    address: "Ground Floor, 245, Jalan Tun Jugah, 93350 Kuching",
    city: "Kuching",
    region: "Sarawak",
    phone: "+60 82-445 678",
  },
  {
    id: 6,
    name: "Spellbound Games Ipoh",
    address: "No. 88, Jalan Dato Tahwil Azar, Taman Jubilee, 30250 Ipoh",
    city: "Ipoh",
    region: "Perak",
    phone: "+60 5-241 9900",
  },
  {
    id: 7,
    name: "Riftbound HQ Shah Alam",
    address: "Unit 1-3, Setia City Mall, Jalan Setia Dagang AG U13/AG, Setia Alam, 40170 Shah Alam",
    city: "Shah Alam",
    region: "Selangor",
    phone: "+60 3-3344 7788",
  },
  {
    id: 8,
    name: "Critical Hit Melaka",
    address: "12, Jalan Merdeka, Taman Melaka Raya, 75000 Melaka",
    city: "Melaka",
    region: "Melaka",
    phone: "+60 6-282 3344",
  },
  {
    id: 9,
    name: "Arcane Alley Bandar Seri Begawan",
    address: "Unit 15, Ground Floor, The Mall Gadong, Jalan Gadong, BE3919 Bandar Seri Begawan",
    city: "Bandar Seri Begawan",
    region: "Brunei-Muara",
    phone: "+673 242 5566",
  },
  {
    id: 10,
    name: "Tabletop Treasury Kuala Belait",
    address: "No. 9, Bangunan Haji Hashim, Jalan Pretty, Kuala Belait, KA1131 Brunei Darussalam",
    city: "Kuala Belait",
    region: "Belait",
    phone: "+673 333 7788",
  },
];

export default function RetailersPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white">
      <header className="relative border-b border-white/10 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 mx-auto max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-silver-100"
            aria-label="KC Games Home"
          >
            KC Games
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-navy-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/retailer.html" className="hover:text-white transition-colors">Sign Up as Retailer</Link>
          </nav>
        </div>
      </header>
      <section className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(12,24,43,0.95),rgba(18,39,67,0.92))] shadow-2xl mx-auto max-w-6xl mt-8 mb-16 px-6 py-12 sm:mx-10 sm:px-10 lg:mx-16 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_36%)]" />
        <div className="relative">
          <div className="border-b border-white/10 bg-[#0b1220] mb-8 -mx-6 -mb-12 px-6 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
            <div className="flex justify-center py-4 sm:hidden">
              <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                Official Retailers
              </div>
            </div>
            <div className="relative hidden sm:block">
              <div className="absolute inset-x-0 top-0 flex justify-center p-5 sm:p-6 lg:justify-start lg:p-8">
                <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:text-xs">
                  Official Retailers
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-6 p-6 text-center sm:p-10 lg:p-12">
            <div className="space-y-4">
              <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Official Riftbound Retailers
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-navy-100">
                Find your nearest KC Games authorised retailer for Riftbound Trading Card Game products,
                organised play, and community events across Malaysia and Brunei.
              </p>
            </div>

            <Link
              href="/retailer.html"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
              <span className="relative flex items-center gap-2 font-display tracking-wider">
                Sign Up as Retailer
                <ChevronRight className="h-5 w-5" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Our Retail Network</h2>
          <p className="mx-auto max-w-3xl text-lg text-navy-200 leading-relaxed">
            {retailers.length} authorised retailers across Malaysia and Brunei. Each location stocks Riftbound products
            and supports local play communities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {retailers.map((retailer) => (
            <article
              key={retailer.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/60 p-6 transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-foil opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none rounded-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 group-hover:ring-silver-500/50">
                  <Store className="h-5 w-5 text-silver-200 group-hover:text-white transition-colors" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-silver-100 group-hover:text-white truncate">{retailer.name}</h3>
                  <div className="mt-2 flex items-start gap-2 text-sm text-navy-300">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-navy-400" aria-hidden />
                    <address className="not-italic leading-relaxed">
                      {retailer.address}<br />
                      {retailer.city}, {retailer.region}
                    </address>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-navy-700/50">
                <a
                  href={`tel:${retailer.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-silver-400/30 bg-navy-900/60 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MapPinCheck className="h-4 w-4" aria-hidden />
                  <span>Call: {retailer.phone}</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/retailer.html"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MapPinCheck className="h-5 w-5" aria-hidden />
            Interested in becoming a retailer?
          </Link>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 text-center -mt-8 pb-8">
        <a
          href="https://www.facebook.com/kcgames"
          target="_blank"
          rel="noopener noreferrer"
          className="text-silver-400 hover:text-white transition-colors"
          aria-label="KC Games on Facebook"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <p className="text-sm text-navy-400">© 2026 KC Games Sdn Bhd. All rights reserved.</p>
      </footer>
    </main>
  );
}