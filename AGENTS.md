# AGENTS

The Pre-Rift announcement includes a warning-triangle “WHAT DOES THIS MEAN FOR PLAYERS?” heading before the player information cards. Player guidance contains Event Rescheduling, Existing Registrations & Payments, and Stay Updated with supplied wording and double line breaks. Two standalone sections follow: WHAT IS KC GAMES DOING? and TO OUR RIFTBOUND COMMUNITY, preserving approved paragraphs and clear blank lines. The article uses an unboxed page layout, without the outer card, Official Announcement box, or divider above its hashtags; inner content cards remain unchanged. Hashtags sit closer to the community section with extra clearance before the bottom Back to Home button, which matches the top button styling.

Homepage notice: yellow **OFFICIAL ANNOUNCEMENT** button under Latest News replaces the temporary KC Games x Riftbound link; the bottom-floating warning keeps its Riftbound event heading.

## Project Overview

This repository contains the KC Games marketing site built with Next.js 14, TypeScript, and Tailwind CSS.

## Working Rules

- Keep changes small and targeted.
- Do not run local builds unless explicitly instructed; GitHub Actions owns build and deploy verification.
- Deliver clean, focused, working code changes; do not trigger build/deploy unless instructed.
- Preserve the current App Router structure under `src/app`.
- Prefer updating existing sections and components instead of introducing new abstractions unless reuse is clear.
- Keep business copy aligned with `CONTENT.MD` when marketing content changes.

## Docs To Refresh Before Each Push

Update these files before every push if the codebase, content, or workflow changed:

- `AGENTS.md`
- `docs/PROJECT_STRUCTURE.md`
- `README.md`

## Current App Notes

- Homepage highlights the urgent Riftbound: Radiance Pre-Rift announcement with a bottom-floating yellow warning and links to `src/app/announcements/riftbound-radiance-pre-rift/page.tsx`.
- Main landing page lives in `src/app/page.tsx`, declares homepage canonical metadata, targets Malaysia & Brunei in the intro copy, and shows the shared Betobee retailer-app banner below Company Information.
- Retailer landing flow lives in `src/app/retailer/page.tsx`, declares retailer canonical metadata, serves Malaysia & Brunei, and reuses the same app banner before its final signup CTA.
- Retailer directory data lives in `src/data/retailers.json`; update this JSON when adding/removing retailers or changing country/store-type/playing-location flags.
- Demo-only retailer survey lives in `src/app/survey/page.tsx` (noindex). The Formity 3 flow has 12 ordered questions: JSON retailer/conditional demo branch, real retail/play image uploads, tables/chairs, social media, weekly hours, event, notable event, learn to play, external event, personal event, shop/retailer feedback, other products; Ready to submit opens `SubmissionModal.tsx` with distributor email/password (X/Cancel only; disabled while sending). `submitSurvey.ts` posts credentials and all 12 answers in one request to the fixed livetest URL, with no Firebase frontend SDK/key/token or Authorization header. Only 200/201 with a matching received receipt is accepted and clears the draft/retry key. Failures retain answers and a credential-free exact-payload retry snapshot in sessionStorage; changed payloads are blocked for that ID. Credentials are cleared after each attempt. Legacy completed drafts still show their summary. `surveyData.ts` uses original JSON row IDs and explicit name-prefix branch grouping, not B2B relationships. `useSurveyDraft.ts` stores the versioned v2 current-step/partial-answer draft in sessionStorage, restores Formity initialState, and clears only its key on Start over. Real livetest JSON submission includes up to two processed JPEG images via the API images array. `surveyImages.tsx` handles JPEG/PNG/WebP inputs (5 MB max each), resize/metadata stripping, previews/removal and in-memory photos across steps; refresh requires reselection and cannot silently omit a selected photo. Retry storage keeps image hashes, not image bytes. The staging notice and shop-prefix simulation notice blocks were removed. Production unchanged.
- Tests use Vitest + React Testing Library: config in `vitest.config.ts`, setup in `src/test-setup.ts`, suite under `src/**/*.test.{ts,tsx}`; run with `npm run test`, typecheck with `npm run typecheck`.
- Global metadata, release/version markers, robots directives, and Google Tag Manager are configured in `src/app/layout.tsx`.
- SEO routes live in `src/app/robots.ts` and `src/app/sitemap.ts`.
- Homepage structured data is emitted as JSON-LD from `src/app/page.tsx`.
- Shared contact UI lives in `src/components/ContactWidget.tsx`.
- Shared Betobee app-download UI lives in `src/components/RetailerAppBanner.tsx`.
- Search/filter UI for the retailer directory lives in `src/components/RetailerSearch.tsx`.
- Shared footer social link UI lives in `src/components/FacebookFooterLink.tsx`.
- Static assets are served from `public/`.
- Brand and partner logos live in `public/partners/`.
- Retailer flow images mirrored from the source retailer page live in `public/retailer/`; themed retailer mobile app badges are shared across the homepage and retailer flow.
- Riftbound announcement assets live in `public/riftbound/`.
- `main` deploys through Azure Static Web Apps after GitHub Actions builds `out/` and stamps epoch release and short commit version markers across exported HTML pages.
- `demo` deploys to Azure Blob Static Website through GitHub Actions, stamps exported HTML pages with epoch release and short commit version markers, logs the resolved preview URL, and can notify Telegram on completion.
