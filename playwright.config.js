// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for Maranto's SWS static site tests.
 *
 * Tests run against a local Python HTTP server serving the repo root.
 * The homepage is accessible at http://localhost:8080/plumbing/
 *
 * Visual regression baselines live in tests/snapshots/.
 * To regenerate baselines after intentional visual changes:
 *   npm run test:update-snapshots
 * Then commit the updated snapshots.
 */
module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  // Fail fast in CI if a test is accidentally left as `.only`
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],

  use: {
    baseURL: 'http://localhost:8080',
    // Capture trace on retry so failures in CI are debuggable
    trace: 'on-first-retry',
    // Reduce flakiness from animations
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Spin up a local static file server before running tests.
  // Python 3 is available on ubuntu-latest and macOS by default.
  webServer: {
    command: 'python3 -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },

  // Visual regression snapshots stored alongside tests for easy review
  snapshotDir: './tests/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
});
