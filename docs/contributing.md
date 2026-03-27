# Contributing

## Adding a Review

Open `design-system/reviews.json` and append an object:

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

The `url` is the permalink to the individual Facebook post — click the timestamp on the recommendation to get it. Tracking parameters (`?__cft__...`) can be stripped.

## Updating Brand Data

Edit `design-system/brand.json` for contact info, tagline, or social links. After changing it, update any pages that display that data.

## Changing Visual Identity

Edit `design-system/design.json` for color tokens, typography, or border radius, then update `design-system/tailwind.config.js` to reflect the new token values.

## Adding or Changing Component Rules

Edit `design-system/instructions.prompt`. This is the authoritative source for component specs, conversion rules, and accessibility constraints.

## Deploy

Merging to `main` triggers an automatic deploy to GitHub Pages. For Cloudflare Pages, configure manually in the dashboard:
- Build command: `bash scripts/build.sh`
- Output directory: `dist`
- Framework preset: None
