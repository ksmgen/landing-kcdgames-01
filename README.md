# landing-kcdgames-01

The Pre-Rift announcement includes a warning-triangle “WHAT DOES THIS MEAN FOR PLAYERS?” heading before the player information cards. Player guidance contains Event Rescheduling, Existing Registrations & Payments, and Stay Updated with supplied wording and double line breaks. Two standalone sections follow: WHAT IS KC GAMES DOING? and TO OUR RIFTBOUND COMMUNITY, preserving approved paragraphs and clear blank lines. The article uses an unboxed page layout, without the outer card, Official Announcement box, or divider above its hashtags; inner content cards remain unchanged. Hashtags sit closer to the community section with extra clearance before the bottom Back to Home button, which matches the top button styling.

Homepage notice: yellow **OFFICIAL ANNOUNCEMENT** button under Latest News replaces the temporary KC Games x Riftbound link; the bottom-floating warning keeps its Riftbound event heading.

KC Games landing page built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## What is in this repo

- A single-page marketing site in `src/app/page.tsx` with homepage canonical metadata and the shared Betobee retailer-app banner below Company Information
- A KC Games themed retailer pre-signup page in `src/app/retailer/page.tsx` for Malaysia & Brunei with retailer canonical metadata and the shared themed Betobee app-store download banner
- An urgent Riftbound announcement page in `src/app/announcements/riftbound-radiance-pre-rift/page.tsx`, highlighted by a bottom-floating homepage warning
- An authorised retailer directory in `src/app/retailers/page.tsx`, backed by `src/data/retailers.json` with store-type and playing-location flags for easy add/remove updates
- A 12-question retailer survey in `src/app/survey/page.tsx` (noindex), using Formity 3, shop selection from `public/data/survey-shop-options.json` with authoritative chain groups and standalone retailers (string MongoDB IDs, serial RIDs; name-prefix derivation removed), real shop-photo inputs, seating, socials, hours, five event categories (personal event at step 10), two feedback fields at step 11 and other products; Ready to submit opens a distributor email/password modal; Submit sends credentials plus all answers directly to the configured Betobee API in one HTTPS request; `answers.shop.id` is the selected B2B store ID and `answers.shop.ref` is its RID serial, including branch selections. No frontend Firebase or tokens. A confirmed received receipt shows Accepted and clears drafts; failures preserve answers and the same submission ID/payload for safe retries. Credentials are never persisted and are cleared after each attempt. The password eye toggle allows checking the exact case-sensitive value; submitting remasks it. Weekly opening/closing times use wide 12-hour AM/PM fields (hour + minute inputs + AM/PM selector); values convert to stored 24-hour HH:MM on submit, preserving midnight (12 AM = 00:00), noon (12 PM = 12:00), overnight support, strict 1–12/00–59 validation, and partial draft preservation across refresh. X/Cancel dismiss only when not sending. Retail/play photos accept JPEG, PNG or WebP up to 5 MB each, show real previews and are resized/re-encoded before inclusion in the API images array. Photos remain in memory across steps; refresh requires reselection while text answers resume. Image hashes protect retries without storing photo bytes in sessionStorage. The JSON is publicly accessible at `/data/survey-shop-options.json` without a note field. Old numeric-id drafts return to shop selection while preserving other answers. The staging notice and shop-prefix simulation notice blocks were removed. Live uses the production API; demo retains the test API.
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
- Survey API: the live workflow sets `NEXT_PUBLIC_SURVEY_SUBMIT_URL=https://api.betobee.co/api/survey/sales-distributor/submitSurvey` at build time; demo/local defaults to the same path on `livetest-api.betobee.co`. API payload, authentication and retry behavior are unchanged; survey remains noindex.
- `demo` deploys to Azure Blob Static Website from GitHub Actions, stamps exported HTML pages with epoch release and short commit version markers, logs the preview URL, and can notify Telegram on completion
