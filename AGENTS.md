# AGENTS

## Project Overview

This repository contains the KC Games marketing site built with Next.js 14, TypeScript, and Tailwind CSS.

## Working Rules

- Keep changes small and targeted.
- Preserve the current App Router structure under `src/app`.
- Prefer updating existing sections and components instead of introducing new abstractions unless reuse is clear.
- Keep business copy aligned with `CONTENT.MD` when marketing content changes.

## Docs To Refresh Before Each Push

Update these files before every push if the codebase, content, or workflow changed:

- `AGENTS.md`
- `docs/PROJECT_STRUCTURE.md`
- `README.md`

## Current App Notes

- Main landing page lives in `src/app/page.tsx`.
- Retailer landing flow lives in `src/app/retailer/page.tsx`.
- Global metadata and Google Tag Manager are configured in `src/app/layout.tsx`.
- Shared contact UI lives in `src/components/ContactWidget.tsx`.
- Shared footer social link UI lives in `src/components/FacebookFooterLink.tsx`.
- Static assets are served from `public/`.
- Retailer flow images mirrored from the source retailer page live in `public/retailer/`.
- Riftbound announcement assets live in `public/riftbound/`.
- `main` deploys through Azure Static Web Apps.
- `demo` deploys to Azure Blob Static Website through GitHub Actions, logs the resolved preview URL, and can notify Telegram on completion.
