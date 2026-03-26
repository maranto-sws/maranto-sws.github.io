// @ts-check
/**
 * Visual Regression Tests — plumbing/index.html
 *
 * Captures screenshots and compares them to committed baselines.
 * These act as a pixel-level diff layer: if an AI edit changes layout,
 * color, spacing, or SVG rendering in unexpected ways, the test fails
 * and the diff is uploaded as a CI artifact for human review.
 *
 * WORKFLOW:
 *   1. First run: baselines don't exist yet → tests create them automatically.
 *      Inspect the generated images in tests/snapshots/, then commit them.
 *   2. Future runs: Playwright diffs new screenshots against committed baselines.
 *      Any pixel difference beyond the threshold fails the test.
 *   3. Intentional visual change (e.g. brand refresh):
 *      Run `npm run test:update-snapshots`, review diffs, commit updated baselines.
 *
 * Threshold: maxDiffPixelRatio: 0.02 = up to 2% of pixels can differ.
 * Tighten to 0.005 for pixel-perfect enforcement, loosen if fonts render
 * inconsistently across environments.
 */

const { test, expect } = require('@playwright/test');

const PAGE = '/plumbing/';
const THRESHOLD = { maxDiffPixelRatio: 0.02 };

// Wait for fonts and layout to fully settle before capturing
async function waitForReady(page) {
  await page.waitForLoadState('networkidle');
  // Give animations and font rendering a moment
  await page.waitForTimeout(300);
}

test.describe('Visual Regression', () => {

  test.describe('Full Page', () => {
    test('full page — mobile 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await waitForReady(page);
      await expect(page).toHaveScreenshot('full-page-375.png', { fullPage: true, ...THRESHOLD });
    });

    test('full page — tablet 768px', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE);
      await waitForReady(page);
      await expect(page).toHaveScreenshot('full-page-768.png', { fullPage: true, ...THRESHOLD });
    });

    test('full page — desktop 1280px', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(PAGE);
      await waitForReady(page);
      await expect(page).toHaveScreenshot('full-page-1280.png', { fullPage: true, ...THRESHOLD });
    });
  });

  test.describe('Section Snapshots (desktop 1280px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(PAGE);
      await waitForReady(page);
    });

    test('emergency header', async ({ page }) => {
      await expect(page.locator('#emergency-header')).toHaveScreenshot('section-header.png', THRESHOLD);
    });

    test('hero section', async ({ page }) => {
      await expect(page.locator('#hero')).toHaveScreenshot('section-hero.png', THRESHOLD);
    });

    test('trust bar', async ({ page }) => {
      await expect(page.locator('#trust-bar')).toHaveScreenshot('section-trust-bar.png', THRESHOLD);
    });

    test('services grid', async ({ page }) => {
      await expect(page.locator('#services')).toHaveScreenshot('section-services.png', THRESHOLD);
    });

    test('reviews carousel', async ({ page }) => {
      await expect(page.locator('#reviews')).toHaveScreenshot('section-reviews.png', THRESHOLD);
    });

    test('team cards', async ({ page }) => {
      await expect(page.locator('#team')).toHaveScreenshot('section-team.png', THRESHOLD);
    });

    test('booking form', async ({ page }) => {
      await expect(page.locator('#booking')).toHaveScreenshot('section-booking.png', THRESHOLD);
    });

    test('footer', async ({ page }) => {
      await expect(page.locator('footer')).toHaveScreenshot('section-footer.png', THRESHOLD);
    });
  });

  test.describe('Section Snapshots (mobile 375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await waitForReady(page);
    });

    test('emergency header — mobile', async ({ page }) => {
      await expect(page.locator('#emergency-header')).toHaveScreenshot('mobile-header.png', THRESHOLD);
    });

    test('hero section — mobile', async ({ page }) => {
      await expect(page.locator('#hero')).toHaveScreenshot('mobile-hero.png', THRESHOLD);
    });

    test('services grid — mobile (single column)', async ({ page }) => {
      await expect(page.locator('#services')).toHaveScreenshot('mobile-services.png', THRESHOLD);
    });

    test('booking form — mobile', async ({ page }) => {
      await expect(page.locator('#booking')).toHaveScreenshot('mobile-booking.png', THRESHOLD);
    });
  });

  test.describe('Interactive States', () => {
    test('mobile nav — open state at 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await waitForReady(page);

      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toBeVisible();

      await expect(page.locator('#emergency-header')).toHaveScreenshot(
        'mobile-nav-open.png', THRESHOLD
      );
    });

    test('booking form — success state', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(PAGE);
      await waitForReady(page);

      await page.fill('#name', 'Jane Smith');
      await page.fill('#phone', '(630) 555-0000');
      await page.fill('#address', '123 Main St, Bloomingdale');
      await page.selectOption('#service', 'drain');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#booking-success')).toBeVisible();

      await expect(page.locator('#booking')).toHaveScreenshot('booking-success.png', THRESHOLD);
    });
  });
});
