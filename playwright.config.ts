// /playwright.config.ts

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Set tests root directory
  testDir: './tests',

  // Configure global timeouts
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Configure default test behavior
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    headless: !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Configure reporters for dashboard generation
  reporter: [
    ['list'],
    ['json', { outputFile: 'jsonReports/jsonReport.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'junit/test-results.xml' }],
  ],

  // Define browser matrix (aligned with workflow)
  projects: [
    // Windows
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },

    // macOS
    { name: 'chromium-mac', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },

    // Linux
    { name: 'chromium-linux', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-linux', use: { ...devices['Desktop Safari'] } },
  ],

  // Limit workers in CI
  workers: process.env.CI ? 2 : undefined,
});
