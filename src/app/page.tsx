import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

const highlights = [
  {
    title: "Lightning-fast launch",
    description:
      "Spin up a polished landing page in minutes with built-in sections for trailers, features, and community links.",
    icon: <Zap className="h-5 w-5 text-ink-100" aria-hidden />,
  },
  {
    title: "Audience-ready",
    description:
      "Capture wishlists and signups with clean CTAs, responsive design, and accessible interactions out of the box.",
    icon: <Sparkles className="h-5 w-5 text-ink-100" aria-hidden />,
  },
  {
    title: "Creator-focused",
    description:
      "Customize colors, copy, and assets without wrestling configs. Ship updates as quickly as you ship builds.",
    icon: <Play className="h-5 w-5 text-ink-100" aria-hidden />,
  },
];

const stats = [
  { label: "studios shipped", value: "120+" },
  { label: "player wishlist adds", value: "1.4M" },
  { label: "deployment time", value: "<1 hr" },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-ink-900">
      <div className="pointer-events-none absolute inset-0 bg-grid [background-size:24px_24px] opacity-40" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink-800/70 px-3 py-1 text-sm font-medium text-ink-100 shadow-glow ring-1 ring-ink-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-highlight opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-highlight" />
              </span>
              Pre-launch toolkit for game studios
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Launch your next hit with a landing page players remember.
              </h1>
              <p className="max-w-2xl text-lg text-ink-200">
                KCD Games gives you a modern Next.js + Tailwind starter built for bold reveals, cinematic trailers, and the calls-to-action that grow your community from day one.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                className="inline-flex items-center justify-center rounded-full bg-highlight px-5 py-3 text-base font-semibold text-ink-900 shadow-lg shadow-highlight/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                href="#get-started"
              >
                Start building
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-ink-600/80 px-5 py-3 text-base font-semibold text-ink-50 transition hover:border-ink-400 hover:bg-ink-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                href="#trailer"
              >
                Watch trailer
                <Play className="ml-2 h-5 w-5" aria-hidden />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-ink-200">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-ink-800/60 px-4 py-3 ring-1 ring-ink-700">
                  <p className="text-xs uppercase tracking-wide text-ink-400">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-ink-700 bg-ink-800/70 shadow-2xl shadow-ink-900">
            <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between text-xs text-ink-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-900/60 px-3 py-1 ring-1 ring-ink-700">Gameplay capture</span>
              <span className="inline-flex items-center gap-1 text-ink-400">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                REC
              </span>
            </div>
            <Image
              id="trailer"
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
              alt="Futuristic game environment with neon lighting"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent" />
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl bg-ink-800/70 p-6 ring-1 ring-ink-700 sm:grid-cols-3 sm:p-10">
          {highlights.map((item) => (
            <article key={item.title} className="flex flex-col gap-3 rounded-2xl bg-ink-900/40 p-4 shadow-inner shadow-ink-900/40 ring-1 ring-ink-700/60">
              <div className="flex items-center gap-3 text-sm font-semibold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-800 text-highlight ring-1 ring-ink-700">
                  {item.icon}
                </span>
                {item.title}
              </div>
              <p className="text-sm text-ink-200">{item.description}</p>
            </article>
          ))}
        </section>

        <section
          id="get-started"
          className="grid gap-12 rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800/70 via-ink-800/30 to-ink-900/40 p-6 shadow-glow sm:grid-cols-[1.1fr_0.9fr] sm:p-10"
        >
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-300">Why KCD Games</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Tell a cinematic story, guide players to the next step, and iterate fast.
            </h2>
            <ul className="space-y-4 text-ink-200">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-highlight/20 text-highlight ring-1 ring-highlight/40">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-white">Responsive, accessible sections</p>
                  <p className="text-sm text-ink-300">
                    Hero, highlights, feature grid, and call-to-action components engineered with semantic HTML and keyboard-friendly interactions.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-highlight/20 text-highlight ring-1 ring-highlight/40">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-white">Customizable tokens</p>
                  <p className="text-sm text-ink-300">
                    Tweak color palette, typography, and spacing directly in Tailwind config to match your studio identity.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-highlight/20 text-highlight ring-1 ring-highlight/40">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-white">Deploy-ready Next.js stack</p>
                  <p className="text-sm text-ink-300">
                    Optimized images, metadata defaults, and best-practice linting so you can ship to Vercel or your preferred host instantly.
                  </p>
                </div>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 text-sm text-ink-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-900/60 px-3 py-1 ring-1 ring-ink-700">
                <span className="h-2 w-2 rounded-full bg-highlight" aria-hidden />
                Built with Next.js 14 & Tailwind CSS
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-900/60 px-3 py-1 ring-1 ring-ink-700">
                <Sparkles className="h-4 w-4" aria-hidden />
                Dark theme by default
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-ink-700 bg-ink-900/60 p-6">
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-highlight/10 blur-3xl" aria-hidden />
            <div className="absolute -right-20 -bottom-32 h-52 w-52 rounded-full bg-highlight/5 blur-3xl" aria-hidden />
            <div className="relative space-y-4">
              <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-ink-700">
                <p className="text-xs uppercase tracking-wide text-ink-400">Toolkit</p>
                <p className="text-lg font-semibold text-white">Command palette ready</p>
                <p className="text-sm text-ink-300">
                  Extend the starter with your own components or connect to your backend without leaving the design system.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-ink-700">
                  <p className="text-xs uppercase tracking-wide text-ink-400">Deploy</p>
                  <p className="text-2xl font-semibold text-white">1-click</p>
                  <p className="text-xs text-ink-300">Vercel & self-host friendly</p>
                </div>
                <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-ink-700">
                  <p className="text-xs uppercase tracking-wide text-ink-400">Performance</p>
                  <p className="text-2xl font-semibold text-white">Core Web Vitals</p>
                  <p className="text-xs text-ink-300">Image optimization and caching</p>
                </div>
                <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-ink-700">
                  <p className="text-xs uppercase tracking-wide text-ink-400">Customization</p>
                  <p className="text-2xl font-semibold text-white">Tokens</p>
                  <p className="text-xs text-ink-300">Update Tailwind variables</p>
                </div>
                <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-ink-700">
                  <p className="text-xs uppercase tracking-wide text-ink-400">Community</p>
                  <p className="text-2xl font-semibold text-white">Discord</p>
                  <p className="text-xs text-ink-300">Share builds & feedback</p>
                </div>
              </div>
              <a
                className="inline-flex w-full items-center justify-center rounded-full bg-highlight px-5 py-3 text-base font-semibold text-ink-900 shadow-lg shadow-highlight/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                href="mailto:hello@kcd.games"
              >
                Talk to the team
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
