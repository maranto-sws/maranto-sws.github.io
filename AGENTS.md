# AI Agent Workflow — maranto-sws.github.io

This project uses Claude (via Anthropic's Cowork) as a collaborative web-building agent. This document explains how that's set up, what the agent knows, and how to work with it effectively.

## How It Works

Rather than re-explaining the project every session, the design system folder acts as a **persistent briefing** — a set of structured files the agent reads before touching anything. This means the agent always knows the real business name, real phone number, real reviews, and the correct visual style without being told each time.

The technical instructions for Claude specifically live in [`CLAUDE.md`](./CLAUDE.md).

## The Design System Folder

`/design-system` is the single source of truth for everything an agent (or developer) needs to build consistently:

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

## Prompting Tips

Because the agent reads the design system files automatically, you don't need to repeat brand details in your requests. Effective prompts are short and task-focused:

- "Build a services page using the design system."
- "Add the new review I just put in reviews.json to the homepage."
- "Update the phone number in brand.json and rebuild the header."

If something should always be true going forward (a new rule, a new component pattern), the right place for it is `instructions.prompt` — not just a one-off message to the agent.

## Site Structure

The main homepage lives at `plumbing/index.html`. It is a single self-contained HTML file using Tailwind CDN — no build step required. Open it directly in a browser or push to GitHub Pages to see changes live.
