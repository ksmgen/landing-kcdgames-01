import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, CalendarDays, Heart, PackageCheck, Ticket, Megaphone } from "lucide-react";
import FacebookFooterLink from "../../../components/FacebookFooterLink";

export const metadata: Metadata = {
  title: "Official Announcement: Riftbound Radiance Pre-Rift Events Malaysia | KC Games",
  description:
    "Official KC Games announcement regarding Riftbound: Radiance Pre-Rift event delays in Malaysia due to customs clearance delays.",
  alternates: {
    canonical: "/announcements/riftbound-radiance-pre-rift.html",
  },
  openGraph: {
    title: "Official Announcement: Riftbound Radiance Pre-Rift Events Malaysia | KC Games",
    description:
      "Important update for players and retailers about Riftbound: Radiance Pre-Rift events in Malaysia.",
    type: "article",
    url: "/announcements/riftbound-radiance-pre-rift.html",
    siteName: "KC Games",
    locale: "en_MY",
    images: [
      {
        url: "/riftbound/riftbound-banner.jpg",
        width: 1600,
        height: 900,
        alt: "Riftbound Trading Card Game announcement by KC Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Announcement: Riftbound Radiance Pre-Rift Events Malaysia | KC Games",
    description:
      "Important update for players and retailers about Riftbound: Radiance Pre-Rift events in Malaysia.",
    images: ["/riftbound/riftbound-banner.jpg"],
  },
};

const noticeSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: "Official Announcement: Riftbound Radiance Pre-Rift Events Malaysia",
  datePublished: "2026-10-14",
  dateModified: "2026-10-14",
  author: {
    "@type": "Organization",
    name: "KC Games Sdn Bhd",
  },
  publisher: {
    "@type": "Organization",
    name: "KC Games Sdn Bhd",
  },
  about: "Riftbound: Radiance Pre-Rift events in Malaysia",
};

const infoCards = [
  {
    title: "Event Rescheduling",
    icon: <CalendarDays className="h-5 w-5" aria-hidden />,
    body: (
      <>
        The official Radiance Pre-Rift event window runs from 16–22 October 2026.
        <br /><br />
        Affected retailers may need to reschedule or cancel their original events, with alternative sessions potentially being arranged within the permitted event window.
      </>
    ),
  },
  {
    title: "Existing Registrations & Payments",
    icon: <Ticket className="h-5 w-5" aria-hidden />,
    body: (
      <>
        If you have already registered or paid for a Pre-Rift event, please contact your respective participating retailer directly for updates regarding your event.
        <br /><br />
        Each retailer will be managing its own event arrangements, including rescheduling, registration transfers and refunds where applicable.
      </>
    ),
  },
];

export default function RiftboundRadiancePreRiftAnnouncementPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-white selection:bg-amber-400/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(noticeSchema) }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(180,83,9,0.24),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(36,59,83,0.55),_transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/85 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-10 lg:px-16">
            <a
              href="/"
              className="font-display text-xl font-bold tracking-tight text-silver-100 transition-colors hover:text-white"
              aria-label="KC Games Home"
            >
              KC Games
            </a>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-silver-300 md:flex">
              <a href="/" className="transition-colors hover:text-white">Home</a>
              <a href="/retailers.html" className="transition-colors hover:text-white">Retailers</a>
            </nav>
          </div>
        </header>

        <article className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-silver-400/20 bg-navy-900/60 px-4 py-2 text-sm font-semibold text-silver-200 backdrop-blur-sm transition hover:border-silver-300/40 hover:bg-navy-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Home
          </a>

          <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-400/30 bg-[linear-gradient(135deg,rgba(12,24,43,0.96),rgba(32,28,21,0.94))] shadow-2xl">
            <div className="space-y-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-5">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-200">Riftbound: Radiance Pre-Rift Events – Malaysia</p>
                <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Important update regarding Radiance Pre-Rift event product availability
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-navy-100">
                  Dear Riftbound Community, we regret to inform you that due to unforeseen customs clearance delays, a significant portion of the Riftbound: Radiance Pre-Rift products destined for participating retailers in Malaysia may not arrive in time for the start of Pre-Rift events on Friday, 16 October 2026.
                </p>
                <p className="max-w-3xl text-lg leading-relaxed text-navy-100">
                  As a result, some Pre-Rift events scheduled for this coming weekend may be affected.
                </p>
                <br />
                <h2 className="flex items-center gap-3 font-display text-xl font-bold text-amber-200 sm:text-2xl">
                  <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden />
                  WHAT DOES THIS MEAN FOR PLAYERS?
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {infoCards.map((card) => (
                  <section
                    key={card.title}
                    className="rounded-2xl border border-navy-700/60 bg-navy-900/55 p-5 shadow-lg"
                  >
                    <div className="flex items-center gap-3 text-amber-200">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-300/30">
                        {card.icon}
                      </div>
                      <h2 className="font-display text-lg font-bold text-white">{card.title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-navy-100 sm:text-base">{card.body}</p>
                  </section>
                ))}
              </div>

              <section className="rounded-2xl border border-silver-400/20 bg-navy-900/45 p-6">
                <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-white"><Megaphone className="h-6 w-6 shrink-0 text-amber-200" aria-hidden />Stay Updated</h2>
                <p className="mt-4 leading-relaxed text-navy-100">
                  We strongly encourage all players to check with their respective retailers before travelling to any scheduled Pre-Rift event.
                  <br /><br />
                  Please follow your retailer’s official communication channels for the latest event updates.
                </p>
              </section>

              <section className="rounded-2xl border border-navy-700/60 bg-navy-900/55 p-6">
                <h2 className="flex items-center gap-3 font-display text-xl font-bold text-amber-200 sm:text-2xl">
                  <PackageCheck className="h-6 w-6 shrink-0" aria-hidden />
                  WHAT IS KC GAMES DOING?
                </h2>
                <p className="mt-6 leading-relaxed text-navy-100">
                  KC Games is actively working with the relevant parties to expedite customs clearance and arrange the fastest possible delivery of the affected products to our retail partners.
                  <br /><br />
                  We are treating this situation as a matter of urgency and will continue providing updates as more information becomes available.
                </p>
              </section>

              <section className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-6">
                <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-white"><Heart className="h-6 w-6 shrink-0 text-red-400" aria-hidden />TO OUR RIFTBOUND COMMUNITY</h2>
                <div className="mt-6 space-y-6 leading-relaxed text-navy-100">
                  <p>
                    We understand how much excitement and anticipation surrounds the Radiance Pre-Rift events.
                  </p>
                  <p>
                    We sincerely apologise to all players, retailers and organisers who may be affected by this unexpected disruption.
                  </p>
                  <p>
                    Our retail partners have invested considerable time and effort into preparing these events, and we ask for your patience and understanding as they work to make alternative arrangements.
                  </p>
                  <p>
                    Please continue supporting your local game stores during this challenging period.
                  </p>
                  <p>
                    Thank you for your understanding and continued support of Riftbound in Malaysia.
                  </p>
                  <p className="font-semibold text-amber-200">
                    KC Games Sdn Bhd<br />
                    Official Riftbound Distributor – Malaysia
                  </p>
                </div>
              </section>

              <footer className="pt-6">
                <p className="mt-4 text-sm leading-relaxed text-navy-300">
                  #Riftbound #RiftboundTCG #RiftboundMalaysia #Radiance #PreRift #KCGames #LeagueOfLegends
                </p>
              </footer>
            </div>
          </section>

          <div className="mt-8 flex justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-5 py-3 text-sm font-bold text-amber-100 backdrop-blur-sm transition hover:border-amber-200/60 hover:bg-amber-400/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Home
            </a>
          </div>
        </article>

        <footer className="flex flex-col items-center gap-4 pb-10 pt-2">
          <FacebookFooterLink className="text-silver-400" />
          <p className="text-sm text-navy-400">© 2026 KC Games Sdn Bhd. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
