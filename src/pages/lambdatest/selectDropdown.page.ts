// src/pages/lambdatest/selectDropdown.page.ts
// https://www.lambdatest.com/selenium-playground/

import { Page, Locator } from '@playwright/test';

export class SelectDropdownPage {
  readonly page: Page;

  // Multi-select dropdown
  readonly multiSelect: Locator;

  // Buttons
  readonly firstSelectedBtn: Locator;
  readonly getAllSelectedBtn: Locator;

  // Output spans
  readonly firstSelectedOutput: Locator;
  readonly allSelectedOutput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locate <select id="multi-select">
    this.multiSelect = page.locator('#multi-select');

    // Buttons
    this.firstSelectedBtn = page.locator('#printMe');
    this.getAllSelectedBtn = page.locator('#printAll');

    // Outputs
    this.firstSelectedOutput = page.locator('span.genderbutton');
    this.allSelectedOutput = page.locator('span.groupradiobutton');
  }

  // Navigate to dropdown page
  async goto() {
    await this.page.goto('select-dropdown-demo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Use real CTRL-clicks because selectOption() does not trigger this demo's JS logic
  async ctrlSelect(options: string[]) {
    await this.multiSelect.focus();
    await this.page.keyboard.down('Control');

    for (const option of options) {
      await this.multiSelect.locator(`option[value="${option}"]`).click();

      // Small delay required in CI to ensure multi-select registers correctly
      await this.page.waitForTimeout(50);
    }

    await this.page.keyboard.up('Control');
  }
}
