"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SLIDE_DURATION = 6000;

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);

  const schedule = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!paused.current) setActive((s) => (s + 1) % 2);
      schedule();
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    schedule();
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (i: number) => {
    setActive(i);
    schedule();
  };

  const scrollToRiftbound = () => {
    document.getElementById("riftbound")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="relative w-full h-[80vh] min-h-[600px] shadow-2xl border-b border-navy-700/50 overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* Slide 1 — KC Games hero */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: active === 0 ? 1 : 0, pointerEvents: active === 0 ? "auto" : "none" }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url(/banner.jpg)",
              backgroundPosition: "calc(0% - 200px) center",
            }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `@media (min-width: 640px) { .kc-slide1-bg { background-position: center center !important; } }`,
          }} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
          <div className="absolute inset-0 bg-navy-950/30" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 pb-6 text-center sm:px-10">
          <div className="relative w-48 h-48 sm:w-48 sm:h-48">
            <Image
              src="/logo.png"
              alt="KC Games Logo"
              fill
              className="object-contain drop-shadow-2xl"
              style={{ mixBlendMode: "multiply" }}
              priority
            />
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1
              className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)" }}
            >
              Game Distribution. Market Access. Growth.
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-silver-100 px-8 py-4 text-base font-bold text-navy-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="/retailer.html"
            >
              <span className="absolute inset-0 bg-foil opacity-20 transition-opacity group-hover:opacity-40" />
              <span className="relative flex items-center gap-2 font-display tracking-wider">
                Sign up as retailer
                <ArrowRight className="h-5 w-5" aria-hidden />
              </span>
            </Link>
            <a
              className="group inline-flex items-center justify-center rounded-lg border border-silver-400/30 bg-navy-900/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="#contact-us"
            >
              <span className="flex items-center gap-2 font-display tracking-wide">Contact Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide 2 — Riftbound */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: active === 1 ? 1 : 0, pointerEvents: active === 1 ? "auto" : "none" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/riftbound/riftbound-hero.png"
            alt="Riftbound League of Legends Trading Card Game"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        </div>

        {/* CTA overlay — bottom center, below the "Trading Card Game" text */}
        <div className="absolute inset-x-0 bottom-16 flex justify-center px-6">
          <button
            onClick={scrollToRiftbound}
            className="group inline-flex items-center gap-2 rounded-lg border border-white/40 bg-navy-950/70 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="font-display tracking-wide">Read the Announcement</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2 z-20">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </header>
  );
}
