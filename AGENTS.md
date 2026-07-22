# AGENTS

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

- Main landing page lives in `src/app/page.tsx`, declares homepage canonical metadata, and targets Malaysia & Brunei in the intro copy.
- Retailer landing flow lives in `src/app/retailer/page.tsx`, declares retailer canonical metadata, and serves Malaysia & Brunei.
- Retailer directory data lives in `src/data/retailers.json`; update this JSON when adding/removing retailers or changing country/store-type/playing-location flags.
- Global metadata, release/version markers, robots directives, and Google Tag Manager are configured in `src/app/layout.tsx`.
- SEO routes live in `src/app/robots.ts` and `src/app/sitemap.ts`.
- Homepage structured data is emitted as JSON-LD from `src/app/page.tsx`.
- Shared contact UI lives in `src/components/ContactWidget.tsx`.
- Search/filter UI for the retailer directory lives in `src/components/RetailerSearch.tsx`.
- Shared footer social link UI lives in `src/components/FacebookFooterLink.tsx`.
- Static assets are served from `public/`.
- Brand and partner logos live in `public/partners/`.
- Retailer flow images mirrored from the source retailer page live in `public/retailer/`.
- Riftbound announcement assets live in `public/riftbound/`.
- `main` deploys through Azure Static Web Apps after GitHub Actions builds `out/` and stamps epoch release and short commit version markers across exported HTML pages.
- `demo` deploys to Azure Blob Static Website through GitHub Actions, stamps exported HTML pages with epoch release and short commit version markers, logs the resolved preview URL, and can notify Telegram on completion.
