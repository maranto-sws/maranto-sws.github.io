# Maranto's Sewer & Water Services — Agent & Developer Guide

This is the single operating reference for both humans and AI agents. `CLAUDE.md` is a symlink to this file — there is no separate agent instructions document.

---

## Maintaining This File

**Describe capabilities, not file paths.** File paths drift; capabilities don't. If a fact already lives authoritatively in a source file (brand.json, design.json, etc.), reference that file — don't duplicate the value here. Duplication creates two sources of truth and guarantees one will go stale.

Rules of thumb:
- If removing a line would cause an agent to make a wrong decision, keep it.
- If removing a line would just mean the agent has to discover something itself, remove it.
- Never document directory trees or enumerate file lists — use `Glob`/`Grep` for discovery.
- When a component, rule, or path changes in code, update `instructions.prompt` — not this file.

---

## Before Touching Any Page Content

Always read these files in order — they are the single source of truth for all real data:

1. `design-system/brand.json` — business name, phone, address, tagline, email, social links
2. `design-system/reviews.json` — real customer recommendations (Facebook format, no star ratings)
3. `design-system/design.json` — color tokens, typography, border radius
4. `design-system/tailwind.config.js` — how design tokens map to Tailwind classes
5. `design-system/instructions.prompt` — component specs, core logic, and conversion rules

Never use placeholder names, fake phone numbers, invented addresses, or dummy review text. All real data lives in the files above.

## The Design System Folder

| File | What it contains | Update when... |
|---|---|---|
| `brand.json` | Business name, phone, address, tagline, email, social URLs | Contact info or branding changes |
| `reviews.json` | Real customer recommendations from Facebook | New reviews come in |
| `design.json` | Color tokens, typography, border radius | Visual identity changes |
| `tailwind.config.js` | Tailwind mapping of design tokens | Design tokens change |
| `instructions.prompt` | Component rules, conversion logic, build constraints | Site strategy changes |

### Adding a New Review

Open `design-system/reviews.json` and append an object following this schema:

```json
{
  "author": "Full Name",
  "text": "The review text exactly as written.",
  "recommends": true,
  "date": "YYYY-MM-DD",
  "platform": "Facebook",
  "url": "https://www.facebook.com/[profile]/posts/[postid]"
}
```

The `url` is the direct permalink to the individual Facebook post (click the timestamp on the recommendation to get it). Tracking parameters (`?__cft__...`) can be stripped — just keep the base URL.

## Tech Stack

- **Static HTML** — no build step, no framework, no npm
- **Tailwind CDN** — loaded via `<script src="https://cdn.tailwindcss.com">` with an inline config block; do not reference compiled Tailwind classes that aren't in the base stylesheet
- **Google Fonts** — Montserrat (headings) and Inter (body), loaded via `<link>`
- **Inline SVG icons** — thick-stroke (2px), no icon library dependency

## Key Conventions

- **Mobile-first** — all interactive elements must have `min-height: 44px`
- **Conversion priority** — Phone call > SMS > Booking form (in that order)
- **Reviews** — Facebook "recommends" format only; each review links to its original post URL; "See all" links to `brand.social.facebook_reviews`
- **Schema.org** — include `Plumber` JSON-LD on every page for local SEO
- **No placeholder content** — if real data is missing, ask rather than invent

## Files Not to Touch

- `.gitignore` — already configured
- `CNAME` — GitHub Pages domain config
- `CLAUDE.md` — symlink to this file; do not replace with a regular file

## Prompting Tips

Because the agent reads the design system files automatically, you don't need to repeat brand details in your requests. Effective prompts are short and task-focused:

- "Build a services page using the design system."
- "Add the new review I just put in reviews.json to the homepage."
- "Update the phone number in brand.json and rebuild the header."

If something should always be true going forward (a new rule, a new component pattern), the right place for it is `instructions.prompt` — not a one-off message to the agent.

## Build & Deploy

`scripts/build.sh` copies only public-facing files into `dist/` for deployment. Everything else — including this file — is intentionally excluded.

```
npm run build
# or
bash scripts/build.sh
```

**GitHub Pages:** automated on push to `main` via `.github/workflows/deploy.yml`.

**Cloudflare Pages:** configure manually in the dashboard (cannot be set via code):
- Build command: `bash scripts/build.sh`
- Output directory: `dist`
- Framework preset: None
