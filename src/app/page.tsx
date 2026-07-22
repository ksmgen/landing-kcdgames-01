import { ArrowRight, Globe, Handshake, MapPin, Target, Truck, Users } from "lucide-react";
import ContactWidget from "../components/ContactWidget";
import FacebookFooterLink from "../components/FacebookFooterLink";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

const services = [
  {
    title: "Game distribution",
    description: "For digital and physical titles",
    icon: <Truck className="h-5 w-5 text-silver-300" aria-hidden />,
  },
  {
    title: "Market entry",
    description: "Regional rollout",
    icon: <Globe className="h-5 w-5 text-silver-300" aria-hidden />,
  },
  {
    title: "Channel management",
    description: "Partner management",
    icon: <Handshake className="h-5 w-5 text-silver-300" aria-hidden />,
  },
  {
    title: "Localisation",
    description: "Market adaptation support",
    icon: <Users className="h-5 w-5 text-silver-300" aria-hidden />,
  },
  {
    title: "Sales & Logistics",
    description: "Distribution coordination",
    icon: <Target className="h-5 w-5 text-silver-300" aria-hidden />,
  },
];

const SITE_URL = process.env.SITE_URL ?? "https://www.kc-games.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KC Games Sdn Bhd",
  url: SITE_URL,
  description:
    "KC Games Sdn Bhd is a game distribution company based in Kuala Lumpur, Malaysia, serving retail partners across Malaysia and Brunei.",
  areaServed: ["Malaysia", "Brunei"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kuala Lumpur",
    addressCountry: "MY",
  },
  serviceType: ["Game distribution", "Market entry", "Channel management", "Sales & logistics"],
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 selection:bg-silver-500/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-800 via-navy-950 to-navy-950 opacity-80" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Full Width Banner - Section 1: Hero */}
      <header className="relative w-full h-[80vh] min-h-[600px] shadow-2xl border-b border-navy-700/50">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: 'url(/banner.jpg)',
              backgroundPosition: 'calc(0% - 200px) center'
            }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
            @media (min-width: 640px) {
              header .absolute.inset-0 > div {
                background-position: center center !important;
              }
            }
          `}} />
          {/* Stronger dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
          <div className="absolute inset-0 bg-navy-950/30" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 pb-6 text-center sm:px-10">
          {/* Company Logo */}
          <div className="relative w-48 h-48 sm:w-48 sm:h-48">
            <Image
              src="/logo.png"
              alt="KC Games Logo"
              fill
              className="object-contain drop-shadow-2xl"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1
              className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)'
              }}
            >
              Game Distribution. Market Access. Growth.
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-medium uppercase tracking-[0.28em] text-silver-200/90 sm:text-base">
              Serving retailers across Malaysia and Brunei.
            </p>
          </div>

          <div className="flex w-full max-w-4xl flex-wrap items-stretch justify-center gap-4">
            <a
              className="order-2 sm:order-none group relative inline-flex min-h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:min-w-[240px]"
              href="/retailer.html"
            >
              <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
              <span className="relative flex items-center gap-2 text-center font-display tracking-wider">
                Sign up as retailer
                <ArrowRight className="h-5 w-5" aria-hidden />
              </span>
            </a>
            <a
              className="order-1 sm:order-none group inline-flex min-h-16 w-full items-center justify-center rounded-lg border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-8 py-4 text-base font-semibold text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-[rgba(50,42,28,0.85)] hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:w-auto sm:min-w-[240px]"
              href="/retailers.html"
            >
              <span className="text-center font-display tracking-wide leading-tight">Riftbound Official Stores</span>
            </a>
            <a
              className="order-3 sm:order-none group inline-flex min-h-16 w-full items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:min-w-[240px]"
              href="#contact-us"
            >
              <span className="flex items-center gap-2 text-center font-display tracking-wide">
                Contact Us
              </span>
            </a>
          </div>

          <div className="mt-4 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 border-t border-white/10 pt-4 sm:pt-8">
            <a
              href="#riftbound"
              className="group flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
            >
              <p className="font-display text-xs font-bold uppercase tracking-widest text-silver-400">Latest News</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-silver-100 drop-shadow-sm flex items-center gap-2">
                KC Games x Riftbound
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </p>
            </a>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">

        <section id="riftbound" className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(12,24,43,0.95),rgba(18,39,67,0.92))] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_36%)]" />

          <div className="relative">
            <div className="border-b border-white/10 bg-[#0b1220]">
              <div className="flex justify-center px-5 pb-4 pt-5 sm:hidden">
                <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  Official Announcement
                </div>
              </div>

              <div className="relative overflow-hidden sm:hidden">
                <Image
                  src="/riftbound/riftbound-mobile-full.png"
                  alt="Riftbound League of Legends Trading Card Game key art"
                  width={1179}
                  height={2556}
                  className="h-auto w-full"
                />
              </div>

              <div className="relative hidden overflow-hidden sm:block">
                <Image
                  src="/riftbound/riftbound-banner.jpg"
                  alt="Riftbound League of Legends Trading Card Game key art"
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-x-0 top-0 flex justify-center p-5 sm:p-6 lg:justify-start lg:p-8">
                  <div className="inline-flex rounded-full border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:text-xs">
                    Official Announcement
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-6 p-8 text-center sm:p-10 lg:p-12">
              <div className="space-y-4">
                <h2 className="mx-auto max-w-4xl font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  KC Games is the official distributor for Riftbound Trading Card Game
                </h2>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-navy-100">
                  Retail partners can now work with KC Games on Riftbound retail, onboarding, and follow-up
                  coordination. If you are planning retail availability, our team is ready to connect.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/retailer.html"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                  <span className="relative flex items-center gap-2 font-display tracking-wider">
                    Sign Up as Retailer
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </span>
                </a>

                <a
                  href="/retailers.html"
                  className="inline-flex items-center justify-center rounded-lg border border-amber-400/40 bg-[rgba(32,28,21,0.78)] px-8 py-4 text-base font-semibold text-amber-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-[rgba(50,42,28,0.85)] hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  <span className="font-display tracking-wider">Riftbound Official Stores</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Intro paragraph */}
        <section className="text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-navy-200">
            KC Games Sdn Bhd is a game distribution company based in Kuala Lumpur, Malaysia. We focus on bringing
            high-quality digital and physical games to the right markets, connecting game developers and publishers
            with retail partners, platforms, and players across Malaysia and Brunei.
          </p>
        </section>

        {/* Section 2: What We Do */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">What We Do</h2>
            <p className="mx-auto max-w-3xl text-lg text-navy-200 leading-relaxed">
              KC Games specialises in game distribution and market expansion, providing a reliable bridge between content creators and distribution channels.
            </p>
          </div>

          <div className="text-navy-200 leading-relaxed">
            <p className="font-semibold text-white mb-3">Our services include:</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item) => (
                <article
                  key={item.title}
                  className="group relative flex items-start gap-3 rounded-xl border border-navy-700/50 bg-navy-900/40 p-4 transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/60 hover:shadow-card-hover"
                >
                  <div className="absolute inset-0 bg-foil opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none rounded-xl" />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 shadow-inner ring-1 ring-silver-500/20 group-hover:ring-silver-500/50">
                    <div className="text-silver-200 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-silver-100 group-hover:text-white">{item.title}</h3>
                    <p className="text-sm text-navy-300">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className="text-navy-200 leading-relaxed">
            We work closely with developers, publishers, and partners to ensure games reach their target audiences efficiently and commercially successfully.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Partners</h2>
            <a
              href="https://uvsgames.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/40 p-8 shadow-card transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/60 hover:shadow-card-hover"
            >
              <div className="absolute inset-0 bg-foil opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-center">
                <Image
                  src="/partners/uvs-games-logo.png"
                  alt="UVS Games"
                  width={220}
                  height={120}
                  className="h-[120px] w-auto"
                />
              </div>
            </a>
          </div>

          <div className="space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Brands</h2>
            <a
              href="https://riftbound.leagueoflegends.com/en-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/40 p-8 shadow-card transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/60 hover:shadow-card-hover"
            >
              <div className="absolute inset-0 bg-foil opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-center">
                <Image
                  src="/partners/riftbound-brand.png"
                  alt="Riftbound"
                  width={320}
                  height={120}
                  className="h-[120px] w-auto"
                />
              </div>
            </a>
          </div>
        </section>

        {/* Section 3: Our Mission */}
        <section className="relative overflow-hidden rounded-2xl border border-navy-700/50 bg-card-gradient p-8 shadow-2xl sm:p-12">
          <div className="absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-silver-500/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-silver-500/30 rounded-br-2xl" />

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Our Mission</h2>
            <p className="text-lg text-navy-100 leading-relaxed">
              Our mission is to empower game creators by simplifying distribution and unlocking new market opportunities. We aim to build long-term partnerships based on trust, transparency, and shared growth.
            </p>
          </div>
        </section>

        {/* Section 4: Why KC Games */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Why KC Games</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Focused Expertise", desc: "Dedicated solely to game distribution" },
              { title: "Regional Knowledge", desc: "Understanding of Southeast Asian markets" },
              { title: "Partner-Driven", desc: "We succeed when our partners succeed" },
              { title: "Scalable Approach", desc: "Supporting indie titles to large-scale releases" }
            ].map((feature, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-navy-700/50 bg-navy-900/40 p-6 transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/60 hover:shadow-card-hover">
                <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-navy-900/50 text-silver-400 ring-1 ring-silver-500/30">
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
                <div>
                  <p className="font-display font-semibold text-silver-100 mb-1">{feature.title}</p>
                  <p className="text-sm text-navy-200">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-navy-200 leading-relaxed text-center">
            As a new company, we bring fresh energy, flexibility, and a strong commitment to building meaningful industry relationships.
          </p>
        </section>

        {/* Section 5: Company Information */}
        <section id="contact-us" className="relative overflow-hidden rounded-2xl border border-navy-700/50 bg-card-gradient p-8 shadow-2xl sm:p-12">
          <div className="absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-silver-500/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-silver-500/30 rounded-br-2xl" />

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Company Information</h2>
              <p className="font-display text-xl text-silver-200">KC Games Sdn Bhd</p>
              <p className="text-sm text-navy-400">Company No: 202404041289</p>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-navy-900/50 p-6 ring-1 ring-navy-700">
              <MapPin className="h-6 w-6 shrink-0 text-silver-400 mt-1" />
              <div className="text-navy-200">
                <p>Unit 09-11, Level 9, Block A</p>
                <p>The Vertical Suites, Bangsar South</p>
                <p>59200 Kuala Lumpur</p>
                <p>W.P. Kuala Lumpur</p>
              </div>
            </div>

            <ContactWidget />

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:info@kc-games.com"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-silver-400/30 bg-navy-900/60 px-6 py-4 text-base font-semibold text-silver-100 backdrop-blur-sm shadow-lg transition-all hover:border-white hover:bg-navy-800"
              >
                <span className="font-display tracking-wide">📧 Email Us</span>
              </a>

              <a
                href="/retailer.html"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-silver-100 px-6 py-4 text-base font-bold text-navy-950 shadow-lg transition-all hover:bg-white"
              >
                <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                <span className="relative z-10 font-display tracking-wider flex items-center gap-2">
                  Sign up as retailer
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
            </div>

          </div>
        </section>

        <footer className="flex flex-col items-center gap-4 text-center -mt-8 pb-4">
          <FacebookFooterLink className="text-silver-400" />
          <p className="text-sm text-navy-400">© 2026 KC Games Sdn Bhd. All rights reserved.</p>
        </footer>

      </div>
    </main>
  );
}
