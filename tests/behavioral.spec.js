// @ts-check
/**
 * Behavioral Tests — plumbing/index.html
 *
 * Codifies the interactive UX contracts so AI edits can't silently break them:
 *   - Mobile nav open/close
 *   - CTA links (tel:, sms:, #booking anchor)
 *   - Booking form submission flow
 *   - Reviews carousel controls
 *   - Tap target minimum sizes (44px)
 *   - Page structure invariants
 */

const { test, expect } = require('@playwright/test');

const PAGE = '/plumbing/';
const PHONE_E164 = 'tel:+16304210091';
const SMS_E164   = 'sms:+16304210091';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
  });

  test('hamburger is visible and desktop nav is hidden at 375px', async ({ page }) => {
    await expect(page.locator('#menu-toggle')).toBeVisible();
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeHidden();
  });

  test('mobile nav is hidden by default', async ({ page }) => {
    await expect(page.locator('#mobile-nav')).toBeHidden();
  });

  test('hamburger starts with aria-expanded="false"', async ({ page }) => {
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking hamburger opens mobile nav and sets aria-expanded="true"', async ({ page }) => {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking hamburger again closes mobile nav', async ({ page }) => {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking a nav link closes the mobile drawer', async ({ page }) => {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    await page.locator('#mobile-nav a[href="#services"]').click();

    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('all four nav anchor links are present in mobile drawer', async ({ page }) => {
    for (const href of ['#services', '#team', '#reviews', '#booking']) {
      await expect(page.locator(`#mobile-nav a[href="${href}"]`)).toBeAttached();
    }
  });
});

test.describe('Desktop Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(PAGE);
  });

  test('desktop nav is visible and hamburger is hidden at 1280px', async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
    await expect(page.locator('#menu-toggle')).toBeHidden();
  });

  test('desktop nav contains all four anchor links', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]');
    for (const href of ['#services', '#team', '#reviews', '#booking']) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeAttached();
    }
  });
});

test.describe('CTA and Contact Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('panic button links to correct tel: number', async ({ page }) => {
    await expect(page.locator('a.panic-ring')).toHaveAttribute('href', PHONE_E164);
  });

  test('panic button has an aria-label', async ({ page }) => {
    await expect(page.locator('a.panic-ring')).toHaveAttribute('aria-label');
  });

  test('hero primary CTA links to correct tel: number', async ({ page }) => {
    await expect(page.locator('#hero a[href^="tel:"]').first()).toHaveAttribute('href', PHONE_E164);
  });

  test('hero secondary CTA links to #booking', async ({ page }) => {
    await expect(page.locator('#hero a[href="#booking"]')).toBeAttached();
  });

  test('SMS CTA uses correct sms: number', async ({ page }) => {
    await expect(page.locator(`a[href^="${SMS_E164}"]`).first()).toBeAttached();
  });

  test('footer phone link uses correct tel: number', async ({ page }) => {
    await expect(page.locator(`footer a[href="${PHONE_E164}"]`)).toBeAttached();
  });

  test('footer email link uses correct mailto:', async ({ page }) => {
    await expect(page.locator('footer a[href="mailto:marantosws@gmail.com"]')).toBeAttached();
  });
});

test.describe('Booking Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('form is visible and success message is hidden initially', async ({ page }) => {
    await expect(page.locator('#booking form')).toBeVisible();
    await expect(page.locator('#booking-success')).toBeHidden();
  });

  test('all required fields are present', async ({ page }) => {
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#address')).toBeVisible();
    await expect(page.locator('#service')).toBeVisible();
  });

  test('service dropdown contains all 7 options (6 services + Other)', async ({ page }) => {
    const count = await page.locator('#service option:not([disabled])').count();
    expect(count).toBe(7);
  });

  test('service options include all defined service values', async ({ page }) => {
    const expectedValues = ['emergency', 'drain', 'water-heater', 'pipes', 'fixture', 'sewer', 'other'];
    for (const value of expectedValues) {
      await expect(page.locator(`#service option[value="${value}"]`)).toBeAttached();
    }
  });

  test('submitting a filled form shows success and hides form', async ({ page }) => {
    await page.fill('#name', 'Jane Smith');
    await page.fill('#phone', '(630) 555-0000');
    await page.fill('#address', '123 Main St, Bloomingdale, IL');
    await page.selectOption('#service', 'drain');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('#booking form')).toBeHidden();
    await expect(page.locator('#booking-success')).toBeVisible();
    await expect(page.locator('#booking-success')).toContainText('Booking Received');
  });

  test('success message mentions confirmation timing', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#phone', '(630) 555-0000');
    await page.fill('#address', '123 Test St');
    await page.selectOption('#service', 'emergency');

    await page.locator('button[type="submit"]').click();

    // The confirmation message should convey a timeframe to set expectations
    await expect(page.locator('#booking-success')).toContainText('15 minutes');
  });

  test('submit button has accessible text', async ({ page }) => {
    const btn = page.locator('button[type="submit"]');
    const text = await btn.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Reviews Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('reviews track exists with scroll snap', async ({ page }) => {
    await expect(page.locator('#reviews-track')).toBeAttached();
  });

  test('at least 5 review cards are rendered', async ({ page }) => {
    const count = await page.locator('#reviews-track > *').count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('prev button has aria-label="Previous review"', async ({ page }) => {
    await expect(page.locator('#reviews-prev')).toHaveAttribute('aria-label', 'Previous review');
  });

  test('next button has aria-label="Next review"', async ({ page }) => {
    await expect(page.locator('#reviews-next')).toHaveAttribute('aria-label', 'Next review');
  });

  test('hidden review (Ryan Balfanz) is not in the DOM', async ({ page }) => {
    const count = await page.getByText('Ryan Balfanz').count();
    expect(count).toBe(0);
  });

  test('"See all" link points to Facebook reviews page', async ({ page }) => {
    const seeAll = page.locator('a[href="https://www.facebook.com/marantosws/reviews/"]');
    await expect(seeAll).toBeAttached();
  });

  test('Patricia Sokolowski review links to original Facebook post', async ({ page }) => {
    const reviewLink = page.locator('a[href*="patricia.sokolowski"]');
    await expect(reviewLink).toBeAttached();
    await expect(reviewLink).toHaveAttribute('target', '_blank');
    await expect(reviewLink).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('Page Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('page has exactly one h1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('all required section IDs are present', async ({ page }) => {
    for (const id of ['hero', 'services', 'reviews', 'team', 'booking']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('emergency header is position:sticky', async ({ page }) => {
    const position = await page.locator('#emergency-header').evaluate(
      el => getComputedStyle(el).position
    );
    expect(position).toBe('sticky');
  });

  test('Schema.org JSON-LD is present and has @type Plumber', async ({ page }) => {
    const scriptEl = page.locator('script[type="application/ld+json"]');
    await expect(scriptEl).toBeAttached();
    const raw = await scriptEl.textContent();
    const schema = JSON.parse(raw ?? '{}');
    expect(schema['@type']).toBe('Plumber');
  });

  test('6 service cards are present in the services section', async ({ page }) => {
    const cards = page.locator('#services article');
    await expect(cards).toHaveCount(6);
  });

  test('3 technician cards are present in the team section', async ({ page }) => {
    const cards = page.locator('#team article');
    await expect(cards).toHaveCount(3);
  });

  test('page title contains business name', async ({ page }) => {
    await expect(page).toHaveTitle(/Maranto/);
  });
});

test.describe('Tap Targets (min 44px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('panic button height ≥ 44px', async ({ page }) => {
    const box = await page.locator('a.panic-ring').boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('booking submit button height ≥ 44px', async ({ page }) => {
    const box = await page.locator('button[type="submit"]').boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('hamburger width and height ≥ 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const box = await page.locator('#menu-toggle').boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('hero primary CTA height ≥ 44px', async ({ page }) => {
    const box = await page.locator('#hero a[href^="tel:"]').first().boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('service card Book Now buttons height ≥ 44px', async ({ page }) => {
    const buttons = page.locator('#services article a');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
