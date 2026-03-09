# PALcares Website

PALcares embeds technical teams inside Alberta's social service organizations — building infrastructure and processes that let technology strengthen the relationships these organizations depend on.

## Quick Start

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

Static output is generated in the `out/` directory, ready for deployment.

## Project Structure

```
app/
├── components/       # React components (Hero, Storytelling, Contact, etc.)
├── lib/              # Content (site-content.ts) and animation constants
├── page.tsx          # Homepage composition
├── layout.tsx        # Root layout
└── globals.scss      # Global styles
tests/e2e/            # Playwright end-to-end tests
public/               # Static assets (images, SVGs, fonts)
```

## Tech Stack

Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Lenis smooth scroll · Raleway font

## Content Editing

All website copy lives in `app/lib/site-content.ts`. Edit text there, not in components. See `CONTENT.md` for a full content reference organized by section.

## Testing

```bash
npm run test:e2e              # Run all Playwright tests
npm run test:e2e:headed       # Run with visible browser
```
