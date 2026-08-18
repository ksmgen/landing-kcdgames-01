import { Smartphone } from "lucide-react";

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

export default function RetailerAppBanner() {
  return (
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
  );
}
