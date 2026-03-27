# ADR 001 — Booking Form SMS Privacy & Phone Number Exposure

**Date:** 2026-03-27
**Status:** Accepted

## Context

The "Book Online in 60 Seconds" section contains a form that, on submission, opens the visitor's native SMS app pre-populated with their booking details addressed to the business phone number (`+16304210091`). The phone number also appears in plain HTML in multiple other locations: `tel:` links in the nav, hero, service cards, and footer — eight occurrences total.

The question raised: is the form a meaningful privacy or abuse risk, and should the phone number be obfuscated (e.g. Base64-encoded, JS-assembled) to reduce scraping?

## Decision

**Do not obfuscate the phone number. Enable Cloudflare Bot Fight Mode.**

## Rationale

### The `sms:` booking form cannot be weaponized remotely

The form uses a `sms:` URI scheme, which opens the visitor's own messaging app and pre-fills a draft. The visitor must press **Send** manually. A bot cannot use this to flood the business owner's phone — any message sent would originate from the bot's own device and number. This is a fundamental property of the `sms:` URI scheme, not a configuration choice. No server-side handler exists to abuse.

### Phone number obfuscation provides negligible real-world protection

Base64 encoding or JS string assembly defeats only naive, regex-based scrapers. Any scraper capable of executing JavaScript (headless Chrome, Puppeteer, etc.) trivially decodes or evaluates these techniques. Cloudflare's own email obfuscation feature works the same way and they document it as friction, not a guarantee.

Additionally, the business phone number is already publicly indexed by Google, and is present in third-party directories (Google Business Profile, Yelp, HomeAdvisor, Angi). The website is not the exposure vector — it is already the least-controlled one.

Obfuscation would also:
- Break the page for visitors with JavaScript disabled
- Add ongoing maintenance burden (every `tel:` and `sms:` link becomes a JS dependency)
- Provide no measurable reduction in robocall or spam volume

### Cloudflare Bot Fight Mode is the correct lever

Cloudflare Bot Fight Mode (available on the free plan under Security > Bots) blocks known bad crawlers before they load the page at all. This addresses the actual scraping threat — automated page fetches — without touching the HTML or degrading the user experience. It requires zero code changes.

## Consequences

- The phone number remains in plain HTML. This is intentional.
- Cloudflare Bot Fight Mode should be enabled in the Cloudflare dashboard (Security > Bots > Bot Fight Mode: On). This is a dashboard toggle, not a code change.
- The booking form implementation (`sms:` URI, client-side only) requires no changes.
- If robocall volume becomes a real operational problem in future, the recommended next step is a dedicated business phone number with call screening (e.g. Google Voice, OpenPhone), not HTML obfuscation.

## Alternatives Considered

| Option | Verdict |
|---|---|
| Base64-encode phone number in HTML | Rejected — trivially reversible, breaks without JS |
| Assemble number via JS at runtime | Rejected — defeated by headless browsers, adds fragility |
| Server-side form handler with rate limiting | Overkill — the `sms:` form requires no server; introducing one adds attack surface |
| Replace `sms:` form with email form | Rejected — email has higher friction; `sms:` aligns with conversion priority |
| Cloudflare Bot Fight Mode | **Accepted** — highest ROI, zero code change, addresses root cause |
