// Playwright Test Configuration
// For Phase 6+ Frontend Testing

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/playwright',
  fullyParallel: false, // Run tests sequentially for data consistency
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid race conditions
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'https://parent-staging.adhdlearn.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'echo "Using staging server - no local server needed"',
    url: 'https://parent-staging.adhdlearn.com',
    timeout: 1000,
    reuseExistingServer: true,
  },
});
