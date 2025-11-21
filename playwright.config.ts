// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig({
  // Set test directory
  testDir: './tests/specs',

  // Set timeouts
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Enable parallel mode
  fullyParallel: true,

  // Set retries
  retries: 1,

  // Set default browser behavior
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Set reporters
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
  ],

  // Define browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],

  // Adjust workers on CI
  workers: process.env.GITHUB_ACTIONS ? 2 : undefined,
});
