# Project Structure

The Pre-Rift announcement includes a warning-triangle “WHAT DOES THIS MEAN FOR PLAYERS?” heading before the player information cards. Player guidance contains Event Rescheduling, Existing Registrations & Payments, and Stay Updated with supplied wording and double line breaks. Two standalone sections follow: WHAT IS KC GAMES DOING? and TO OUR RIFTBOUND COMMUNITY, preserving approved paragraphs and clear blank lines. The article uses an unboxed page layout, without the outer card, Official Announcement box, or divider above its hashtags; inner content cards remain unchanged. Hashtags sit closer to the community section with extra clearance before the bottom Back to Home button, which matches the top button styling.

Homepage notice: yellow **OFFICIAL ANNOUNCEMENT** button under Latest News replaces the temporary KC Games x Riftbound link; the bottom-floating warning keeps its Riftbound event heading.

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

- `src/app/page.tsx`: Landing experience with hero, bottom-floating urgent Riftbound Pre-Rift announcement warning, Riftbound launch announcement, brand/partner cards, services, mission, benefits, contact section, shared Betobee retailer-app banner below Company Information, homepage canonical metadata, and JSON-LD organization schema for Malaysia and Brunei SEO.
- `src/app/announcements/riftbound-radiance-pre-rift/page.tsx`: Official Riftbound: Radiance Pre-Rift event delay announcement page for Malaysia with article metadata, JSON-LD, and top/bottom Back to Home links.
- `src/app/retailer/page.tsx`: KC Games themed retailer pre-signup page that leads into the live Betobee signup, presents the shared themed Betobee app-store download banner, serves Malaysia & Brunei, and declares retailer canonical metadata.
- `src/app/retailers/page.tsx`: Authorised retailer directory page that imports retailer data from JSON and emits retailer ItemList JSON-LD.
- `src/app/survey/page.tsx`: Demo-only retailer survey page with noindex metadata.
- `src/app/survey/SurveyForm.tsx`: Twelve-question Formity retailer simulation with JSON shop/branch choice, real retail/play photo inputs, seating, social media, weekly hours, event categories (personal event at step 10), feedback at step 11, products and a Ready to submit dialog in `SubmissionModal.tsx` (native modal, email/password sent only to livetest; X/Cancel disabled in-flight). `submitSurvey.ts` implements the one-request credentials/answers contract, validated receipts, safe status messages, timeout, and credential-free exact-payload retry persistence; covered by `submitSurvey.test.ts`. `surveyImages.tsx` implements validated, resized in-memory image attachments and previews/removal, with image-processing tests in `surveyImages.test.tsx`; reselect photos after refresh. The staging and shop-prefix simulation notice blocks are removed. Flow/UI is covered by `SurveyForm.test.tsx`.
- `src/app/survey/useSurveyDraft.ts`: Validated, versioned session draft of the current step and unsent answers stored in the tab's `sessionStorage` and restored into Formity via `initialState`; tolerates corrupt or blocked storage, and `Start over` clears only the survey draft key. Unit-tested in `src/app/survey/useSurveyDraft.test.ts`.
- `src/app/survey/surveyData.ts`: Read-only retailer JSON options, explicitly simulated chain groups and sample-picture metadata; unit-tested in `surveyData.test.ts`.
- `src/app/layout.tsx`: Root layout plus page metadata, robots directives, release/version markers, and Google Tag Manager snippet.
- `src/app/robots.ts`: Static robots.txt metadata route with sitemap pointer.
- `src/app/sitemap.ts`: Static sitemap metadata route for the homepage, announcement, retailer signup, and retailer directory pages.
- `src/app/globals.css`: Tailwind entrypoint and global styles.
- `src/components/ContactWidget.tsx`: Phone display and WhatsApp CTA with a simple math gate.
- `src/components/FacebookFooterLink.tsx`: Shared Facebook footer link used across landing pages.
- `src/components/RetailerAppBanner.tsx`: Shared navy/silver Betobee app-download banner used on the homepage and retailer flow.
- `src/components/RetailerSearch.tsx`: Retailer directory search, All/Hobby Gaming Stores/Playing Locations/Retail Only Stores filters, dynamic region navigation chips, and playing-location badges.
- `src/data/retailers.json`: Retailer records with region, country, store-type, and playing-location flags.
- `public/logo.png`: KC Games logo used in the hero section.
- `public/banner.jpg`: Hero background image.
- `public/partners/`: Click-through brand and partner logos for the homepage brand section.
- `public/retailer/`: Signup-step and perk images mirrored from the source retailer page.
- `public/riftbound/`: Riftbound campaign artwork used for the homepage announcement section.
- `.github/workflows/azure-static-web-apps-nice-wave-0858e1900.yml`: Production deploy for `main` via Azure Static Web Apps after building `out/` and stamping epoch release and short commit version markers across exported HTML pages.
- `.github/workflows/deploy-demo-azure-blob.yml`: Demo deploy for `demo` via Azure Blob Static Website, stamps exported HTML pages with epoch release and short commit version markers, logs the preview URL, and can notify Telegram.
