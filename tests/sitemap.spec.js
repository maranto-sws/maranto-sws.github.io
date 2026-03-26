// @ts-check
/**
 * Sitemap & Robots Tests
 *
 * Ensures sitemap.xml and robots.txt are served correctly and don't drift:
 *   - /sitemap.xml returns HTTP 200
 *   - sitemap.xml contains the canonical homepage URL
 *   - sitemap.xml has valid urlset XML structure
 *   - robots.txt references the sitemap at the correct URL
 */

const { test, expect } = require('@playwright/test');

test.describe('sitemap.xml', () => {
  test('GET /sitemap.xml returns HTTP 200', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
  });

  test('sitemap.xml contains canonical homepage URL', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();
    expect(body).toContain('https://www.marantosws.com/');
  });

  test('sitemap.xml contains valid <urlset> XML structure', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();
    expect(body).toContain('<urlset');
  });
});

test.describe('robots.txt', () => {
  test('robots.txt references sitemap at canonical URL', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const body = await response.text();
    expect(body).toContain('Sitemap: https://www.marantosws.com/sitemap.xml');
  });
});
