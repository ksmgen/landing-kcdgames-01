import { MapPin, Store, ChevronRight, Phone, MapPinned } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import FacebookFooterLink from "../../components/FacebookFooterLink";

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
    name: "Dice & Dragons KK",
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
    name: "Arcane Alley BSB",
    address: "Unit 15, Ground Floor, The Mall Gadong, Jalan Gadong, BE3919 Bandar Seri Begawan",
    city: "Bandar Seri Begawan",
    region: "Brunei-Muara",
    phone: "+673 242 5566",
  },
  {
    id: 10,
    name: "Tabletop Treasury KB",
    address: "No. 9, Bangunan Haji Hashim, Jalan Pretty, Kuala Belait, KA1131 Brunei Darussalam",
    city: "Kuala Belait",
    region: "Belait",
    phone: "+673 333 7788",
  },
];

export default function RetailersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,59,83,0.85),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15" />

      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-silver-100 transition-colors hover:text-white"
              aria-label="KC Games Home"
            >
              KC Games
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-silver-300 md:flex">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <Link href="/retailer.html" className="transition-colors hover:text-white">Sign Up as Retailer</Link>
            </nav>
          </div>
        </header>

        <section className="relative mx-4 mt-6 overflow-hidden rounded-3xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(12,24,43,0.95),rgba(18,39,67,0.92))] shadow-2xl sm:mx-10 lg:mx-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_36%)]" />
          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:text-xs">
              Official Retailers
            </div>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Official Riftbound Retailers
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-navy-100">
              Find your nearest KC Games authorised retailer for Riftbound Trading Card Game products, organised play,
              and community events across Malaysia and Brunei.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Our Retail Network</h2>
              <p className="mt-2 text-navy-200">{retailers.length} authorised retailers across Malaysia and Brunei.</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-navy-700/50 bg-navy-900/60 px-4 py-2 text-xs font-semibold text-silver-300 sm:flex">
              <MapPinned className="h-4 w-4" aria-hidden />
              <span>{retailers.length} locations</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-navy-700/50 bg-navy-900/40 shadow-2xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-navy-700/50 bg-navy-900/60 text-xs font-bold uppercase tracking-[0.2em] text-silver-400">
                  <th className="px-6 py-4">Retailer</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Contact</th>
                </tr>
              </thead>
              <tbody>
                {retailers.map((retailer) => (
                  <tr
                    key={retailer.id}
                    className="group border-b border-navy-700/50 transition-colors last:border-b-0 hover:bg-navy-800/50"
                  >
                    <td className="px-6 py-5 align-bottom">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 transition-all group-hover:ring-silver-500/50">
                          <Store className="h-5 w-5 text-silver-200 transition-colors group-hover:text-white" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block rounded-full border border-navy-600/50 bg-navy-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-silver-400">
                            {retailer.region}
                          </span>
                          <h3 className="mt-1 font-display font-semibold text-silver-100 transition-colors group-hover:text-white">
                            {retailer.name}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-bottom">
                      <div className="flex items-start gap-2 text-sm text-navy-300">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" aria-hidden />
                        <address className="not-italic leading-relaxed">
                          {retailer.address}
                          <br />
                          <span className="text-silver-300">{retailer.city}, {retailer.region}</span>
                        </address>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-bottom text-right">
                      <a
                        href={`tel:${retailer.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-silver-400/30 bg-navy-900/60 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <Phone className="h-4 w-4" aria-hidden />
                        <span>{retailer.phone}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 rounded-3xl border border-navy-700/50 bg-card-gradient p-8 text-center shadow-2xl sm:p-12">
            <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Want to join the network?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-200">
              Become an authorised KC Games retailer and stock Riftbound Trading Card Game products in your store.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
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
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to Home
              </Link>
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
