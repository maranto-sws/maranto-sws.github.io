#!/usr/bin/env node
/**
 * Content Integrity Tests
 *
 * Validates that plumbing/index.html stays in sync with design-system/*.json.
 * These tests are the first line of defense against AI-generated regressions:
 *   - Wrong phone number / email / address
 *   - Placeholder content slipping in
 *   - Hidden reviews accidentally rendered
 *   - Schema.org data drifting from brand data
 *
 * Zero external dependencies — pure Node.js stdlib.
 * Run with: node tests/content-integrity.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT    = path.join(__dirname, '..');
const html    = fs.readFileSync(path.join(ROOT, 'plumbing/index.html'), 'utf8');
const brand   = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/brand.json'), 'utf8'));
const reviews = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/reviews.json'), 'utf8'));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    console.error(`    \x1b[31m→ ${err.message}\x1b[0m`);
    failed++;
  }
}

function contains(str, label) {
  assert.ok(html.includes(str), `Expected HTML to contain: ${label || JSON.stringify(str)}`);
}

function notContains(str, label) {
  assert.ok(!html.includes(str), `Expected HTML NOT to contain: ${label || JSON.stringify(str)}`);
}

// ─── Phone & Contact ──────────────────────────────────────────────────────────
console.log('\nPhone & Contact');

test('tel: href uses E.164 format +16304210091', () => {
  contains('href="tel:+16304210091"');
});

test('phone number (630) 421-0091 appears as visible text', () => {
  contains('(630) 421-0091');
});

test('email href matches brand.json', () => {
  contains(`href="mailto:${brand.business.email}"`);
});

test('email address appears as visible text', () => {
  contains(brand.business.email);
});

test('sms: href uses correct E.164 number', () => {
  contains('href="sms:+16304210091"');
});

// ─── Address ─────────────────────────────────────────────────────────────────
console.log('\nAddress');

test('street address appears in page', () => {
  const lower = html.toLowerCase();
  assert.ok(
    lower.includes('235 nordic rd') || lower.includes('235 nordic road'),
    'Expected "235 Nordic Rd" in HTML'
  );
});

test('city Bloomingdale appears in page', () => {
  assert.ok(html.toLowerCase().includes('bloomingdale'), 'Expected "Bloomingdale" in HTML');
});

test('state IL appears alongside city', () => {
  // Check they appear near each other (within 100 chars)
  const idx = html.toLowerCase().indexOf('bloomingdale');
  const surrounding = html.slice(Math.max(0, idx - 20), idx + 100).toLowerCase();
  assert.ok(surrounding.includes('il'), 'Expected IL near Bloomingdale in HTML');
});

// ─── Business Identity ────────────────────────────────────────────────────────
console.log('\nBusiness Identity');

test('business tagline appears on page', () => {
  // Partial match — apostrophe may be encoded differently
  assert.ok(
    html.includes("If water goes through it") && html.includes("can do it"),
    'Expected tagline "If water goes through it, Maranto\'s can do it!" in HTML'
  );
});

test('license number PL-2024-0471 appears on page', () => {
  contains(brand.identity.license);
});

test('founded year 2004 appears in footer copy', () => {
  contains('2004');
});

test('no placeholder phone numbers in HTML', () => {
  // Common placeholder patterns that should never appear
  const placeholders = ['555-0000', '555-1234', '(555) 555', 'XXX-XXXX'];
  // Note: (555) 000-0000 appears as a form *placeholder* attribute — that's OK
  // We test that no tel: href points to a placeholder
  assert.ok(
    !html.includes('href="tel:+15555') && !html.includes('href="tel:555'),
    'Found a placeholder phone number in a tel: href'
  );
});

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────
console.log('\nSchema.org JSON-LD');

let schema = null;

test('JSON-LD script block is present and parses', () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'No <script type="application/ld+json"> block found');
  schema = JSON.parse(match[1]);
});

test('Schema @context is schema.org', () => {
  assert.ok(schema && schema['@context'] === 'https://schema.org', 'Schema @context must be https://schema.org');
});

test('Schema @type is Plumber', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.strictEqual(schema['@type'], 'Plumber', `Expected @type "Plumber", got "${schema?.['@type']}"`);
});

test('Schema telephone matches E.164 brand phone', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.strictEqual(schema.telephone, '+16304210091',
    `Schema telephone "${schema?.telephone}" does not match +16304210091`);
});

test('Schema email matches brand.json', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.strictEqual(schema.email, brand.business.email,
    `Schema email "${schema?.email}" does not match brand.json "${brand.business.email}"`);
});

test('Schema addressLocality is Bloomingdale', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.ok(
    schema?.address?.addressLocality?.toLowerCase().includes('bloomingdale'),
    `Schema addressLocality "${schema?.address?.addressLocality}" should be Bloomingdale`
  );
});

test('Schema addressRegion is IL', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.strictEqual(schema?.address?.addressRegion, 'IL',
    `Schema addressRegion should be IL, got "${schema?.address?.addressRegion}"`);
});

test('Schema has aggregateRating with ratingValue ≥ 4.0', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.ok(schema.aggregateRating, 'Schema missing aggregateRating');
  assert.ok(parseFloat(schema.aggregateRating.ratingValue) >= 4.0,
    `Schema ratingValue ${schema.aggregateRating.ratingValue} is below 4.0`);
});

test('Schema aggregateRating has reviewCount > 0', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.ok(parseInt(schema?.aggregateRating?.reviewCount, 10) > 0,
    'Schema reviewCount should be > 0');
});

test('Schema has service catalog with at least 1 item', () => {
  assert.ok(schema, 'Schema not parsed');
  assert.ok(
    Array.isArray(schema?.hasOfferCatalog?.itemListElement) &&
    schema.hasOfferCatalog.itemListElement.length > 0,
    'Schema missing hasOfferCatalog.itemListElement'
  );
});

// ─── Reviews ─────────────────────────────────────────────────────────────────
console.log('\nReviews');

const visibleReviews = reviews.filter(r => !r.hidden);
const hiddenReviews  = reviews.filter(r => r.hidden);

visibleReviews.forEach(review => {
  test(`Review by "${review.author}" is rendered`, () => {
    contains(review.author, `Author name: ${review.author}`);
  });
});

hiddenReviews.forEach(review => {
  test(`Hidden review by "${review.author}" is NOT rendered`, () => {
    notContains(review.author, `Hidden author should not appear: ${review.author}`);
  });
});

test('Reviews with Facebook URLs link to their original posts', () => {
  const linkedReviews = visibleReviews.filter(r => r.url);
  assert.ok(linkedReviews.length > 0, 'Expected at least one review with a URL');
  linkedReviews.forEach(r => {
    assert.ok(html.includes(r.url),
      `Missing Facebook URL for "${r.author}": ${r.url}`);
  });
});

test('"See all" link points to brand.social.facebook_reviews', () => {
  contains(brand.social.facebook_reviews, `facebook_reviews URL: ${brand.social.facebook_reviews}`);
});

test('No reviews marked "recommends: false" are rendered (all should recommend)', () => {
  const nonRecommenders = reviews.filter(r => !r.hidden && r.recommends === false);
  nonRecommenders.forEach(r => {
    notContains(r.author, `Non-recommending review author should not appear: ${r.author}`);
  });
});

// ─── Design Token Consistency ─────────────────────────────────────────────────
console.log('\nDesign Tokens in Tailwind Config');

test('Brand navy #002147 is declared in inline Tailwind config', () => {
  assert.ok(
    html.includes("'#002147'") || html.includes('"#002147"'),
    'Expected brand navy #002147 in inline tailwind.config'
  );
});

test('Brand orange #FF8C00 is declared in inline Tailwind config', () => {
  assert.ok(
    html.includes("'#FF8C00'") || html.includes('"#FF8C00"'),
    'Expected brand orange #FF8C00 in inline tailwind.config'
  );
});

test('Brand clean #F8F9FA is declared in inline Tailwind config', () => {
  assert.ok(
    html.includes("'#F8F9FA'") || html.includes('"#F8F9FA"'),
    'Expected brand clean #F8F9FA in inline tailwind.config'
  );
});

// ─── Structural Invariants ────────────────────────────────────────────────────
console.log('\nStructural Invariants');

test('Page has a <title> element', () => {
  assert.ok(/<title>[^<]+<\/title>/.test(html), 'Missing <title> tag');
});

test('Page has a meta description', () => {
  assert.ok(html.includes('name="description"') && html.includes('content="'), 'Missing meta description');
});

test('Page has lang="en" on <html>', () => {
  assert.ok(html.includes('lang="en"'), 'Missing lang="en" on <html>');
});

test('All section anchor IDs exist: #hero, #services, #reviews, #team, #booking', () => {
  const requiredIds = ['hero', 'services', 'reviews', 'team', 'booking'];
  requiredIds.forEach(id => {
    assert.ok(html.includes(`id="${id}"`), `Missing section id="${id}"`);
  });
});

test('Booking form has success message element #booking-success', () => {
  contains('id="booking-success"');
});

test('Mobile nav element #mobile-nav exists', () => {
  contains('id="mobile-nav"');
});

test('Emergency header #emergency-header exists', () => {
  contains('id="emergency-header"');
});

// ─── Summary ─────────────────────────────────────────────────────────────────
const total = passed + failed;
console.log(`\n${'─'.repeat(55)}`);
if (failed === 0) {
  console.log(`  \x1b[32m✓ All ${total} content integrity tests passed\x1b[0m\n`);
} else {
  console.log(`  \x1b[31m${failed} of ${total} tests failed\x1b[0m\n`);
  process.exit(1);
}
