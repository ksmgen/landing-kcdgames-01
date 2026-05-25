# landing-kcdgames-01

KC Games landing page built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## What is in this repo

- A single-page marketing site in `src/app/page.tsx` with homepage canonical metadata
- A KC Games themed retailer pre-signup page in `src/app/retailer/page.tsx` with retailer canonical metadata
- Shared contact UI in `src/components/ContactWidget.tsx`
- KC Games brand assets, mirrored retailer images, partner logos, and campaign banners in `public/`
- Deployment workflows in `.github/workflows/`
- Source marketing copy in `CONTENT.MD`

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

## Documentation upkeep

Refresh these files before each push when the codebase, structure, or workflow changes:

- `AGENTS.md`
- `docs/PROJECT_STRUCTURE.md`
- `README.md`

## Deployment

- `main` deploys with Azure Static Web Apps after GitHub Actions builds `out/` and stamps epoch release and short commit version markers across exported HTML pages
- `demo` deploys to Azure Blob Static Website from GitHub Actions, stamps exported HTML pages with epoch release and short commit version markers, logs the preview URL, and can notify Telegram on completion
