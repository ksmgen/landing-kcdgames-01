# Project Structure

## Update Rule

Keep this file, `AGENTS.md`, and `README.md` updated before each push whenever the project structure or workflow changes.

## Top-Level Layout

- `src/app/`: Next.js App Router entrypoints, layout, and global styles.
- `src/components/`: Reusable UI components.
- `public/`: Static site assets such as the logo and hero banner.
- `.github/workflows/`: Deployment workflows for Azure Static Web Apps (`main`) and Azure Blob Static Website (`demo`).
- `CONTENT.MD`: Source marketing copy and company information.
- `tailwind.config.ts`: Custom theme tokens for the KC Games visual style.
- `tsconfig.json`: TypeScript configuration with the `@/*` path alias.
- `next.config.mjs`: Next.js runtime configuration.

## Current Files

- `src/app/page.tsx`: Single-page landing experience with hero, services, mission, benefits, and contact section.
- `src/app/layout.tsx`: Root layout plus page metadata and Google Tag Manager snippet.
- `src/app/globals.css`: Tailwind entrypoint and global styles.
- `src/components/ContactWidget.tsx`: Phone display and WhatsApp CTA with a simple math gate.
- `public/logo.png`: KC Games logo used in the hero section.
- `public/banner.jpg`: Hero background image.
- `.github/workflows/azure-static-web-apps-nice-wave-0858e1900.yml`: Production deploy for `main` via Azure Static Web Apps.
- `.github/workflows/deploy-demo-azure-blob.yml`: Demo deploy for `demo` via Azure Blob Static Website plus Discord thread notification.
