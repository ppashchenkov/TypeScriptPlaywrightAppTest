import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5 * 1000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['json', {  outputFile: 'reports/json-report/report.json' }],
    ['html', { outputFolder: 'reports/html-report/', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-report/report.xml' }],
    ['@estruyf/github-actions-reporter'],
    ['monocart-reporter', {
      name: "My Test Report",
      outputFile: 'reports/monocart-report/index.html'
    }],
    [
    "allure-playwright",
        {
          resultsDir: "allure-results",
          detail: true,
          suiteTitle: true,
          categories: [
            {
              name: "Reports",
              messageRegex: "bar",
              traceRegex: "baz",
              //matchedStatuses: [Status.FAILED, Status.BROKEN],
            },
          ],
          environmentInfo: {
            os_platform: os.platform(),
            os_release: os.release(),
            os_version: os.version(),
            node_version: process.version,
            process_platform: process.platform,
          },
          storeTrends: true,
        },
    ],
  ],
   use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});