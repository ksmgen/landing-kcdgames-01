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
- Demo-only player survey lives in `src/app/survey/page.tsx` with server metadata set to noindex; `src/app/survey/SurveyForm.tsx` drives a Formity 3 flow (`useFormity` with `Flow` from `@formity/react`): required game interest, required experience rating, optional feedback, real next/back navigation with Formity's in-memory value recall, and a completion summary with restart. `src/app/survey/useSurveyDraft.ts` keeps a validated, versioned draft of the current step and unsent answers in the tab's `sessionStorage`, so a refresh resumes the survey at the same step (completed drafts restore the summary) and `Start over` clears only the survey draft key. Nothing is submitted to any server, and nothing persists beyond the tab session.
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
