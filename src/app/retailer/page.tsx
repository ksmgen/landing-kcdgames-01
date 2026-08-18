import { ArrowRight, BadgeCheck, Home, Megaphone, PackageCheck, Smartphone, Store } from "lucide-react";
import FacebookFooterLink from "../../components/FacebookFooterLink";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/retailer.html",
  },
  openGraph: {
    url: "/retailer.html",
  },
};

const signupSteps = [
  {
    step: "Step 1",
    title: "Submit your retailer details",
    description:
      "Start with your store and contact information so the KC Games team can review your application.",
    image: "/retailer/signup-step-1.png",
  },
  {
    step: "Step 2",
    title: "Wait for confirmation",
    description:
      "We verify the submission, confirm fit, and share the next instructions for your account activation.",
    image: "/retailer/signup-step-2.png",
  },
  {
    step: "Step 3",
    title: "Access retailer ordering",
    description:
      "Once approved, you can move into the retailer system and start working with KC Games releases.",
    image: "/retailer/signup-step-3.png",
  },
];

const perks = [
  {
    title: "Ready-to-sell catalogue",
    description: "Get access to titles selected for retail demand and commercial clarity.",
    icon: <Store className="h-5 w-5" aria-hidden />,
    image: "/retailer/perk-sell.png",
  },
  {
    title: "Marketing support",
    description: "Launch with stronger visibility through campaign materials and coordinated promotion.",
    icon: <Megaphone className="h-5 w-5" aria-hidden />,
    image: "/retailer/perk-marketing.png",
  },
  {
    title: "Pre-order momentum",
    description: "Capture demand early with pre-order aligned releases and retailer planning support.",
    icon: <PackageCheck className="h-5 w-5" aria-hidden />,
    image: "/retailer/perk-preorder.png",
  },
];

const retailerRequirements = [
  "Must be a business registered with SSM",
  "Must be a physical store with dedicated retail space and a playing area",
  "Must be open a minimum of 5 days a week",
  "Full business registration documents and owner ID documents are required",
];

const businessTerms = [
  "Prepayment before delivery",
  "Minimum order RM500",
  "Free shipping for orders above RM1500 to Peninsula Malaysia only",
  "We do not offer any terms or credit",
  "Shipping terms are Ex Works",
];

const retailerAppLinks = [
  {
    eyebrow: "Download on the",
    label: "App Store",
    platform: "apple",
    href: "https://apps.apple.com/app/betobee-retailer/id6739699685",
  },
  {
    eyebrow: "Get it on",
    label: "Google Play",
    platform: "google-play",
    href: "https://play.google.com/store/apps/details?id=com.kc.b2bretailerapp",
  },
];

export default function RetailerPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 selection:bg-silver-500/30 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,59,83,0.85),_transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-silver-400/20 bg-navy-900/60 px-4 py-2 text-sm font-semibold text-silver-100 backdrop-blur-sm transition hover:border-silver-300/40 hover:bg-navy-800"
          >
            <Home className="h-4 w-4" aria-hidden />
          </a>

          <div className="inline-flex items-center gap-2 rounded-full border border-silver-500/20 bg-silver-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-silver-200">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            Retailer programme
          </div>
        </div>

        <section>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="font-display text-sm font-bold uppercase tracking-[0.4em] text-silver-400">
                Become a retail partner
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Join the KC Games retailer network.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-navy-200">
                Partner with KC Games to access our retailer programme, understand the onboarding steps, and move
                directly into the live signup flow when you are ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Flow", value: "3 steps" },
                { label: "Location", value: "Malaysia & Brunei" },
                { label: "Signup", value: "Betobee" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-navy-700/50 bg-navy-900/50 p-4 shadow-card">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-silver-400">{item.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-silver-100">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://betobee.co/sign-up/kc-games-sdn-bhd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                  <span className="relative flex items-center gap-2 font-display tracking-wider">
                    Sign Up as Retailer
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </span>
                </a>

                <a
                  href="/#contact-us"
                  className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Contact first
                </a>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-silver-400/35 bg-[linear-gradient(135deg,rgba(24,49,73,0.96),rgba(8,25,42,0.98))] p-5 shadow-card sm:p-6 lg:p-7">
                <span className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-silver-300/10 blur-3xl" />
                <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-silver-200/50 to-transparent" />

                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex items-center gap-4 text-left">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-silver-300/20 bg-silver-100/10 text-silver-100 shadow-inner sm:h-14 sm:w-14">
                      <Smartphone className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-silver-300">Retailer mobile access</p>
                      <h2 className="mt-1 font-display text-xl font-bold text-white sm:whitespace-nowrap sm:text-2xl">
                        Get the Betobee Retailer app
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-navy-100">
                        Keep orders and retailer access close at hand.
                      </p>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
                    {retailerAppLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.eyebrow} ${link.label}`}
                        className="group inline-flex min-h-[64px] min-w-0 items-center gap-3 rounded-xl border border-silver-300/25 bg-navy-950/75 px-4 py-3 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:border-silver-200/60 hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-w-[190px]"
                      >
                        {link.platform === "apple" ? (
                          <svg className="h-8 w-8 shrink-0 fill-current" viewBox="0 0 384 512" aria-hidden="true">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                          </svg>
                        ) : (
                          <svg className="h-8 w-8 shrink-0 fill-current" viewBox="0 0 512 512" aria-hidden="true">
                            <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                          </svg>
                        )}
                        <span className="text-left leading-none">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-silver-400">
                            {link.eyebrow}
                          </span>
                          <span className="mt-1 block font-display text-lg font-bold text-white">{link.label}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-navy-700/50 bg-navy-900/40 p-6 shadow-card sm:p-8">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Retailer Registration Requirements</h2>
                <ul className="space-y-3 text-sm leading-relaxed text-navy-200 sm:text-base">
                  {retailerRequirements.map((item) => (
                    <li key={item} className="rounded-xl border border-navy-700/40 bg-navy-950/40 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-2xl border border-navy-700/50 bg-navy-900/40 p-6 shadow-card sm:p-8">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="font-display text-2xl font-bold text-silver-100 sm:text-3xl">Basic Business Terms</h2>
                <ul className="space-y-3 text-sm leading-relaxed text-navy-200 sm:text-base">
                  {businessTerms.map((item) => (
                    <li key={item} className="rounded-xl border border-navy-700/40 bg-navy-950/40 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Signup Process</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-navy-200">
              The retailer flow stays simple: submit, wait for confirmation, then move into the live ordering path.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {signupSteps.map((item) => (
              <article
                key={item.step}
                className="group overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/40 shadow-card transition-all hover:-translate-y-1 hover:border-silver-500/40 hover:bg-navy-800/60 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] border-b border-navy-700/50 bg-white/5 p-6">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-6" />
                </div>
                <div className="space-y-3 p-6">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-silver-400">{item.step}</p>
                  <h3 className="font-display text-2xl font-semibold text-silver-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-navy-200">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Retailer Perks</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-navy-200">
              Retail partners receive practical sales support, stronger launch visibility, and a smoother path for
              pre-orders and upcoming releases.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {perks.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/40 shadow-card"
              >
                <div className="relative aspect-[4/3] border-b border-navy-700/50 bg-white/5 p-6">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-6" />
                </div>
                <div className="space-y-3 p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 text-silver-200 ring-1 ring-silver-500/20">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-silver-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-navy-200">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-navy-700/50 bg-card-gradient p-8 shadow-2xl sm:p-12">
          <div className="absolute top-0 left-0 h-16 w-16 rounded-tl-3xl border-l-2 border-t-2 border-silver-500/30" />
          <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-3xl border-b-2 border-r-2 border-silver-500/30" />

          <div className="relative mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="font-display text-3xl font-bold text-silver-100 sm:text-4xl">Ready to become a KC Games retailer?</h2>
            <p className="text-lg leading-relaxed text-navy-100">
              Continue to the live signup page to register your store. If you need a direct conversation first, the contact
              section on the main landing page is still available.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://betobee.co/sign-up/kc-games-sdn-bhd"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
                <span className="relative flex items-center gap-2 font-display tracking-wider">
                  Sign Up as Retailer
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </span>
              </a>

              <a
                href="/"
                aria-label="Home"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-5 py-4 text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Home className="h-5 w-5" aria-hidden />
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
