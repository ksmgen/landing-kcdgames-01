import { ArrowLeft, ArrowRight, BadgeCheck, Megaphone, PackageCheck, Store } from "lucide-react";
import FacebookFooterLink from "../../components/FacebookFooterLink";
import Image from "next/image";
import Link from "next/link";

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

export default function RetailerPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 selection:bg-silver-500/30 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,59,83,0.85),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-silver-400/20 bg-navy-900/60 px-4 py-2 text-sm font-semibold text-silver-100 backdrop-blur-sm transition hover:border-silver-300/40 hover:bg-navy-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Home
          </Link>

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
                { label: "Location", value: "Malaysia" },
                { label: "Signup", value: "Betobee" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-navy-700/50 bg-navy-900/50 p-4 shadow-card">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-silver-400">{item.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-silver-100">{item.value}</p>
                </div>
              ))}
            </div>

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

              <Link
                href="/#contact-us"
                className="inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact first
              </Link>
            </div>
          </div>

        </section>

        <section className="space-y-8">
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

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden />
                Home
              </Link>
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
