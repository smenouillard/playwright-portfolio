// src/pages/the-internet/dropdown.page.ts
// https://the-internet.herokuapp.com/

import { Page, Locator } from '@playwright/test';

export class DropdownPage {
  readonly page: Page;

  // Dropdown element
  readonly dropdown: Locator;

  // Options
  readonly placeholder: Locator;
  readonly option1: Locator;
  readonly option2: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main dropdown
    this.dropdown = page.locator('#dropdown');

    // Placeholder option
    this.placeholder = page.locator('#dropdown option[disabled]');

    // Selectable options
    this.option1 = page.locator('#dropdown option[value="1"]');
    this.option2 = page.locator('#dropdown option[value="2"]');
  }

  // Navigate to dropdown page
  async goto() {
    await this.page.goto('dropdown');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
