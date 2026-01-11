import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
    {
      name: 'Mobile Android',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Android Low-End',
      use: {
        ...devices['Moto G4'],
        // Simulates budget Android device
        launchOptions: {
          args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad (gen 7)'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4000',
    port: 4000,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
