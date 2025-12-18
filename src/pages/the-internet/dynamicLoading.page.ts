// src/pages/the-internet/dynamicLoading.page.ts
// https://the-internet.herokuapp.com

import { Page, Locator, expect } from '@playwright/test';
import { appUrls } from '../../config/appUrls';

export class DynamicLoadingPage {
  readonly page: Page;

  readonly example1Link: Locator;
  readonly example2Link: Locator;

  readonly startButton: Locator;
  readonly loader: Locator;
  readonly helloWorld: Locator;

  constructor(page: Page) {
    this.page = page;

    // Example navigation links
    this.example1Link = page.getByRole('link', {
      name: 'Example 1: Element on page that is hidden',
    });
    this.example2Link = page.getByRole('link', {
      name: 'Example 2: Element rendered after the fact',
    });

    // Dynamic loading elements
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.loader = page.locator('#loading img');
    this.helloWorld = page.locator('#finish h4');
  }

  // Navigate to Dynamic Loading entry page
  async goto(): Promise<void> {
    await this.page.goto(`${appUrls.theInternet}dynamic_loading`);
  }

  // Open Example 1 via page link
  async openExample1(): Promise<void> {
    await this.example1Link.click();
  }

  // Open Example 2 via page link
  async openExample2(): Promise<void> {
    await this.example2Link.click();
  }

  // Start the dynamic loading process
  async start(): Promise<void> {
    await this.startButton.click();
  }

  // Verify loader lifecycle (appear, stay briefly, disappear)
  async expectLoaderLifecycle(): Promise<void> {
    await expect(this.loader).toBeVisible();
    await expect(this.loader).toBeVisible({ timeout: 300 });
  }

  // Verify final "Hello World!" message
  async expectHelloWorld(): Promise<void> {
    await expect(this.helloWorld).toBeVisible();
    await expect(this.helloWorld).toHaveText('Hello World!');
  }
}
