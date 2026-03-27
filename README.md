# Maranto's Sewer & Water Services

Website for **Maranto's Sewer & Water Services LLC** — a local plumbing business serving Bloomingdale, IL.

Live site: [marantosws.com](https://www.marantosws.com)

---

## Tech Stack

- **Static HTML** — no build step, no framework, no npm required to run the site
- **Tailwind CSS** (CDN) — configured via inline config block in each page
- **Google Fonts** — Montserrat (headings) and Inter (body)
- **Playwright** — behavioral, accessibility, visual regression, and content-integrity tests

---

## Project Structure

```
design-system/       # Single source of truth for all brand/content data
  brand.json         # Business name, phone, address, tagline, email, social links
  reviews.json       # Real customer recommendations (Facebook format)
  design.json        # Color tokens, typography, border radius
  tailwind.config.js # Tailwind mapping of design tokens
  instructions.prompt # Component specs, conversion rules, build constraints
  values.json        # "Why Maranto's" card content

tests/               # Playwright + Node test suite
scripts/
  build.sh           # Copies public-facing files into dist/
```

---

## Development

No install needed to view or edit the site — open `index.html` directly in a browser.

To run the test suite:

```bash
npm install          # installs Playwright and axe-core
npm test             # content integrity + all Playwright tests
```

Individual test targets:

| Command | What it runs |
|---|---|
| `npm run test:content` | Content integrity checks (brand data, phone numbers, etc.) |
| `npm run test:behavioral` | Behavioral + accessibility tests |
| `npm run test:visual` | Visual regression snapshots |
| `npm run test:update-snapshots` | Regenerate visual regression baselines |

---

## Build & Deploy

```bash
npm run build
# or
bash scripts/build.sh
```

Copies only public-facing files (`index.html`, `404.html`, `assets/`, `robots.txt`, `humans.txt`, `CNAME`, `sitemap.xml`) into `dist/`.

**GitHub Pages** — deploys automatically on push to `main` via `.github/workflows/deploy.yml`.

**Cloudflare Pages** — configure manually in the dashboard:
- Build command: `bash scripts/build.sh`
- Output directory: `dist`
- Framework preset: None

---

## Design System

All real business data lives in `design-system/`. Never use placeholder content — if data is missing, add it to the appropriate file:

- Contact info or branding → `brand.json`
- New customer reviews → `reviews.json`
- Visual identity changes → `design.json`
- Site strategy or component rules → `instructions.prompt`

See [`AGENTS.md`](AGENTS.md) for the full agent and developer guide.
