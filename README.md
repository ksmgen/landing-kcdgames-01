# landing-kcdgames-01

The Pre-Rift announcement includes a warning-triangle “WHAT DOES THIS MEAN FOR PLAYERS?” heading before the player information cards. Player guidance contains Event Rescheduling, Existing Registrations & Payments, and Stay Updated with supplied wording and double line breaks. Two standalone sections follow: WHAT IS KC GAMES DOING? and TO OUR RIFTBOUND COMMUNITY, preserving approved paragraphs and clear blank lines. The article uses an unboxed page layout, without the outer card, Official Announcement box, or divider above its hashtags; inner content cards remain unchanged. Hashtags sit closer to the community section with extra clearance before the bottom Back to Home button, which matches the top button styling.

Homepage notice: yellow **OFFICIAL ANNOUNCEMENT** button under Latest News replaces the temporary KC Games x Riftbound link; the bottom-floating warning keeps its Riftbound event heading.

KC Games landing page built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## What is in this repo

- A single-page marketing site in `src/app/page.tsx` with homepage canonical metadata and the shared Betobee retailer-app banner below Company Information
- A KC Games themed retailer pre-signup page in `src/app/retailer/page.tsx` for Malaysia & Brunei with retailer canonical metadata and the shared themed Betobee app-store download banner
- An urgent Riftbound announcement page in `src/app/announcements/riftbound-radiance-pre-rift/page.tsx`, highlighted by a bottom-floating homepage warning
- An authorised retailer directory in `src/app/retailers/page.tsx`, backed by `src/data/retailers.json` with store-type and playing-location flags for easy add/remove updates
- A demo-only 12-question retailer survey in `src/app/survey/page.tsx` (noindex), using Formity 3, JSON-only shops/conditional simulated branches, simulated shop pictures, seating, socials, hours, five event categories (personal event at step 10), two feedback fields at step 11 and other products; Ready to submit opens a username/password modal; Submit reports that Firebase/API are not connected, clears credentials and preserves answers. X/Cancel are the only dismissal controls. SessionStorage preserves progress and unfinished answers across refresh; no uploads or backend.
- Shared contact UI in `src/components/ContactWidget.tsx` and shared retailer-app UI in `src/components/RetailerAppBanner.tsx`
- KC Games brand assets, mirrored retailer images, partner logos, and campaign banners in `public/`
- SEO helpers in `src/app/robots.ts`, `src/app/sitemap.ts`, and homepage JSON-LD
- Deployment workflows in `.github/workflows/`
- Source marketing copy in `CONTENT.MD`, including the homepage region copy for Malaysia & Brunei

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Available scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - lint the codebase
- `npm run typecheck` - run `tsc --noEmit`
- `npm run test` - run the Vitest suite (jsdom + React Testing Library)

## Documentation upkeep

Refresh these files before each push when the codebase, structure, or workflow changes:

- `AGENTS.md`
- `docs/PROJECT_STRUCTURE.md`
- `README.md`

## Deployment

- `main` deploys with Azure Static Web Apps after GitHub Actions builds `out/` and stamps epoch release and short commit version markers across exported HTML pages
- `demo` deploys to Azure Blob Static Website from GitHub Actions, stamps exported HTML pages with epoch release and short commit version markers, logs the preview URL, and can notify Telegram on completion
