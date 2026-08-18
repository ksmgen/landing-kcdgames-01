# Project Structure

## Update Rule

Keep this file, `AGENTS.md`, and `README.md` updated before each push whenever the project structure or workflow changes.

## Top-Level Layout

- `src/app/`: Next.js App Router entrypoints, layout, and global styles.
- `src/components/`: Reusable UI components.
- `src/data/`: Static JSON datasets used by the app.
- `public/`: Static site assets such as the logo, hero banner, retailer images, partner logos, and campaign banners.
- `.github/workflows/`: Deployment workflows for Azure Static Web Apps (`main`) and Azure Blob Static Website (`demo`).
- `CONTENT.MD`: Source marketing copy and company information.
- `tailwind.config.ts`: Custom theme tokens for the KC Games visual style.
- `tsconfig.json`: TypeScript configuration with the `@/*` path alias.
- `next.config.mjs`: Next.js runtime configuration.

## Current Files

- `src/app/page.tsx`: Landing experience with hero, Riftbound launch announcement, brand/partner cards, services, mission, benefits, contact section, homepage canonical metadata, and JSON-LD organization schema for Malaysia and Brunei SEO.
- `src/app/retailer/page.tsx`: KC Games themed retailer pre-signup page that leads into the live Betobee signup, links the Betobee retailer mobile apps, serves Malaysia & Brunei, and declares retailer canonical metadata.
- `src/app/retailers/page.tsx`: Authorised retailer directory page that imports retailer data from JSON and emits retailer ItemList JSON-LD.
- `src/app/layout.tsx`: Root layout plus page metadata, robots directives, release/version markers, and Google Tag Manager snippet.
- `src/app/robots.ts`: Static robots.txt metadata route with sitemap pointer.
- `src/app/sitemap.ts`: Static sitemap metadata route for the homepage and retailer page.
- `src/app/globals.css`: Tailwind entrypoint and global styles.
- `src/components/ContactWidget.tsx`: Phone display and WhatsApp CTA with a simple math gate.
- `src/components/FacebookFooterLink.tsx`: Shared Facebook footer link used across landing pages.
- `src/components/RetailerSearch.tsx`: Retailer directory search, All/Hobby Gaming Stores/Playing Locations/Retail Only Stores filters, dynamic region navigation chips, and playing-location badges.
- `src/data/retailers.json`: Retailer records with region, country, store-type, and playing-location flags.
- `public/logo.png`: KC Games logo used in the hero section.
- `public/banner.jpg`: Hero background image.
- `public/partners/`: Click-through brand and partner logos for the homepage brand section.
- `public/retailer/`: Signup-step and perk images mirrored from the source retailer page.
- `public/riftbound/`: Riftbound campaign artwork used for the homepage announcement section.
- `.github/workflows/azure-static-web-apps-nice-wave-0858e1900.yml`: Production deploy for `main` via Azure Static Web Apps after building `out/` and stamping epoch release and short commit version markers across exported HTML pages.
- `.github/workflows/deploy-demo-azure-blob.yml`: Demo deploy for `demo` via Azure Blob Static Website, stamps exported HTML pages with epoch release and short commit version markers, logs the preview URL, and can notify Telegram.
