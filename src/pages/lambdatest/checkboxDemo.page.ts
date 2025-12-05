// src/pages/lambdatest/checkboxDemo.page.ts
// https://www.lambdatest.com/selenium-playground/

import { Page, Locator } from '@playwright/test';

export class CheckboxDemoPage {
  readonly page: Page;

  readonly singleCheckbox: Locator;
  readonly singleMessage: Locator;

  readonly disabledOption1: Locator;
  readonly disabledOption2: Locator;
  readonly disabledOption3: Locator;
  readonly disabledOption4: Locator;

  readonly multiOption1: Locator;
  readonly multiOption2: Locator;
  readonly multiOption3: Locator;
  readonly multiOption4: Locator;

  readonly checkAllButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Single checkbox
    this.singleCheckbox = page.locator('text=Click on check box').locator('input');

    // Single checkbox message
    this.singleMessage = page.locator('text=Checked!');

    // Disabled Checkbox Demo section
    const disabledSection = page
      .locator('h2:text("Disabled Checkbox Demo")')
      .locator('xpath=following-sibling::div[1]');

    // Disabled checkboxes
    this.disabledOption1 = disabledSection.locator('label:has-text("Option 1") input');
    this.disabledOption2 = disabledSection.locator('label:has-text("Option 2") input');
    this.disabledOption3 = disabledSection.locator('label:has-text("Option 3") input');
    this.disabledOption4 = disabledSection.locator('label:has-text("Option 4") input');

    // Multiple Checkbox Demo
    this.multiOption1 = page.locator('input[name="option1"]');
    this.multiOption2 = page.locator('input[name="option2"]');
    this.multiOption3 = page.locator('input[name="option3"]');
    this.multiOption4 = page.locator('input[name="option4"]');

    // Check All / Uncheck All button
    this.checkAllButton = page.locator('button:has-text("Check All"), button:has-text("Uncheck All")');
  }

  // Navigate to checkbox demo page
  async goto() {
    await this.page.goto('checkbox-demo');
  }
}
