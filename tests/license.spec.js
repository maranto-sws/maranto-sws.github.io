// @ts-check
/**
 * License Number Guard — PL-2024-0471
 *
 * IMPORTANT: The license number PL-2024-0471 has legal significance.
 * It is the official Illinois plumbing contractor license for
 * Maranto's Sewer & Water Services LLC and must NOT be changed without
 * explicit written confirmation from the business owner.
 *
 * This test intentionally fails loudly if the license number is
 * accidentally altered, removed, or replaced in any page.
 */

const { test, expect } = require('@playwright/test');

const LICENSE = 'PL-2024-0471';

test.describe('License number guard', () => {
  test('homepage (/plumbing/) displays the license number', async ({ page }) => {
    await page.goto('/plumbing/');
    await expect(page.getByText(LICENSE, { exact: false })).toBeVisible();
  });

  test('404 page (/404.html) displays the license number', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByText(LICENSE, { exact: false })).toBeVisible();
  });
});
