# Maranto's Sewer & Water Services

Static website for a local plumbing business in Bloomingdale, IL.

## Before Touching Any Page Content

Read the design-system files first — they are the single source of truth. Never use placeholder names, fake phone numbers, invented addresses, or dummy review text.

- `design-system/brand.json` — business name, phone, address, tagline, email, social links
- `design-system/reviews.json` — real customer recommendations (Facebook format, no star ratings)
- `design-system/design.json` — color tokens, typography, border radius
- `design-system/tailwind.config.js` — Tailwind design token mapping
- `design-system/instructions.prompt` — component specs, conversion rules, accessibility constraints

## Tech Stack

- **Static HTML** — no build step, no framework, no npm required to run the site
- **Tailwind CDN** — inline config block per page; don't reference classes outside the base stylesheet
- **Google Fonts** — Montserrat (headings) and Inter (body)
- **Inline SVG icons** — thick-stroke 2px, no icon library

## Conventions

- **Mobile-first** — all interactive elements must have `min-height: 44px`
- **Conversion priority** — Phone call > SMS > Booking form
- **Reviews** — Facebook "recommends" format only; each links to its original post URL
- **Schema.org** — include `Plumber` JSON-LD on every page for local SEO
- **No placeholder content** — if real data is missing, ask rather than invent
- `CLAUDE.md` is a symlink to this file — do not replace it with a regular file

## Build

```bash
npm run build  # or: bash scripts/build.sh
```

Copies public-facing files to `dist/`. GitHub Pages deploys automatically on push to `main`.

## Contributing

See [docs/contributing.md](docs/contributing.md) for content workflows (adding reviews, updating brand data, etc.).
