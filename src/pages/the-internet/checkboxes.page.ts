// src/pages/the-internet/checkboxes.page.ts
// https://the-internet.herokuapp.com

import { Page, Locator } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;

  constructor(page: Page) {
    this.page = page;

    // Select checkbox 1
    this.checkbox1 = page.locator('#checkboxes input').nth(0);

    // Select checkbox 2
    this.checkbox2 = page.locator('#checkboxes input').nth(1);
  }

  // Navigate to checkboxes page
  async goto() {
    await this.page.goto('/checkboxes');
  }
}
