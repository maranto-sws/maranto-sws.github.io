# Claude Project Instructions — maranto-sws.github.io

This is the website for **Maranto's Sewer & Water Services LLC**, a local plumbing and sewer business in Bloomingdale, IL. It is a static GitHub Pages site.

## Mandatory First Steps

Before generating or editing any page content, always read these files in order:

1. `design-system/brand.json` — business name, phone, address, tagline, email, social links
2. `design-system/reviews.json` — real customer recommendations (Facebook format, no star ratings)
3. `design-system/design.json` — color tokens, typography, border radius
4. `design-system/tailwind.config.js` — how design tokens map to Tailwind classes
5. `design-system/instructions.prompt` — component specs, core logic, and conversion rules

Never use placeholder names, fake phone numbers, invented addresses, or dummy review text. All real data lives in the files above.

## Repository Structure

```
/
├── design-system/
│   ├── brand.json          # Business identity (name, phone, address, tagline, social)
│   ├── reviews.json        # Real Facebook recommendations with direct post URLs
│   ├── design.json         # Design tokens (colors, fonts, radius)
│   ├── tailwind.config.js  # Tailwind mapping of design tokens
│   └── instructions.prompt # Component specs and site-building rules
├── plumbing/
│   └── index.html          # Main homepage (primary deliverable)
├── assets/                 # Shared assets (logo, images)
├── CLAUDE.md               # This file
├── AGENTS.md               # Human-readable AI workflow docs
└── .gitignore
```

## Tech Stack

- **Static HTML** — no build step, no framework, no npm
- **Tailwind CDN** — loaded via `<script src="https://cdn.tailwindcss.com">` with an inline config block; do not reference compiled Tailwind classes that aren't in the base stylesheet
- **Google Fonts** — Montserrat (headings) and Inter (body), loaded via `<link>`
- **Inline SVG icons** — thick-stroke (2px), no icon library dependency

## Design Tokens (quick reference)

| Token | Value | Use |
|---|---|---|
| `brand-navy` | `#002147` | Primary backgrounds, headings |
| `brand-orange` | `#FF8C00` | CTAs, urgency, accents |
| `brand-clean` | `#F8F9FA` | Page/card backgrounds |
| Heading font | Montserrat | All `font-heading` elements |
| Body font | Inter | All body copy |
| Border radius | 8px | All cards, buttons, inputs |

## Key Conventions

- **Mobile-first** — all interactive elements must have `min-height: 44px`
- **Conversion priority** — Phone call > SMS > Booking form (in that order)
- **Reviews** — Facebook "recommends" format only; each review links to its original post URL; "See all" links to `brand.social.facebook_reviews`
- **Schema.org** — include `Plumber` JSON-LD on every page for local SEO
- **No placeholder content** — if real data is missing, ask rather than invent

## Files Not to Touch

- `.gitignore` — already configured to ignore `.DS_Store`
- `CNAME` — GitHub Pages domain config
