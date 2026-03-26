// @ts-check
/**
 * Accessibility Tests — plumbing/index.html
 *
 * Runs axe-core against the page at desktop and mobile viewports.
 * Failures here represent real barriers for screen reader and keyboard users
 * — they block the PR just like any other test failure.
 *
 * Requires: @axe-core/playwright
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGE = '/plumbing/';

test.describe('Accessibility — axe-core (WCAG 2.1 AA)', () => {
  test('desktop (1280px): no critical or serious violations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(PAGE);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (blocking.length > 0) {
      const summary = blocking.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => n.target.join(' ')),
      }));
      console.error('Accessibility violations:\n', JSON.stringify(summary, null, 2));
    }

    expect(blocking, `Found ${blocking.length} critical/serious a11y violation(s)`).toHaveLength(0);
  });

  test('mobile (375px): no critical or serious violations', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(blocking, `Found ${blocking.length} critical/serious a11y violation(s) on mobile`).toHaveLength(0);
  });
});

test.describe('Accessibility — Structural / Manual Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('all <img> elements have alt text', async ({ page }) => {
    const count = await page.locator('img:not([alt])').count();
    expect(count).toBe(0);
  });

  test('hamburger button has an aria-label', async ({ page }) => {
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-label');
  });

  test('carousel prev/next buttons both have aria-labels', async ({ page }) => {
    await expect(page.locator('#reviews-prev')).toHaveAttribute('aria-label');
    await expect(page.locator('#reviews-next')).toHaveAttribute('aria-label');
  });

  test('booking form has an aria-label', async ({ page }) => {
    await expect(page.locator('#booking form')).toHaveAttribute('aria-label');
  });

  test('all form inputs have associated <label> elements', async ({ page }) => {
    const inputIds = ['name', 'phone', 'address', 'service', 'details'];
    for (const id of inputIds) {
      await expect(page.locator(`label[for="${id}"]`)).toBeAttached();
    }
  });

  test('heading hierarchy: h1 → h2 (no skipped levels)', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    const h3Count = await page.locator('h3').count();
    const h2Count = await page.locator('h2').count();

    // Must have exactly 1 h1
    expect(h1Count).toBe(1);
    // If h3s exist, h2s must also exist (no skipping h2)
    if (h3Count > 0) {
      expect(h2Count).toBeGreaterThan(0);
    }
    // Must not have h4+ without h3 (check h4 as a proxy)
    const h4Count = await page.locator('h4').count();
    if (h4Count > 0) {
      expect(h3Count).toBeGreaterThan(0);
    }
  });

  test('landmark regions: page has <main> or major sections with aria-label', async ({ page }) => {
    const mainCount = await page.locator('main').count();
    const labeledSections = await page.locator('section[aria-labelledby], section[aria-label]').count();
    expect(mainCount + labeledSections).toBeGreaterThan(0);
  });

  test('external links (target="_blank") have rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      const href = await externalLinks.nth(i).getAttribute('href');
      expect(rel, `External link to ${href} is missing rel="noopener"`).toMatch(/noopener/);
    }
  });

  test('panic button is keyboard-focusable (not tabindex="-1")', async ({ page }) => {
    const tabindex = await page.locator('a.panic-ring').getAttribute('tabindex');
    expect(tabindex).not.toBe('-1');
  });

  test('mobile nav links are keyboard-accessible when nav is open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('#menu-toggle').click();

    const links = page.locator('#mobile-nav a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const tabindex = await links.nth(i).getAttribute('tabindex');
      expect(tabindex).not.toBe('-1');
    }
  });
});
