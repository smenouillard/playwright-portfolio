// src/pages/lambdatest/radioButtonDemo.page.ts
// https://www.lambdatest.com/selenium-playground/radiobutton-demo

import { Page, Locator } from '@playwright/test';

export class RadioButtonDemoPage {
  readonly page: Page;

  // Test 1 — single radio group
  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;
  readonly getValueButton: Locator;
  readonly singleResult: Locator;

  // Test 2 — disabled radio group
  readonly rb1: Locator;
  readonly rb2: Locator;
  readonly rbDisabled: Locator;

  // Test 3 — gender + age section
  readonly genderRadios: Locator;
  readonly ageRadios: Locator;
  readonly getValuesButton: Locator;

  // UPDATED: specific output spans
  readonly genderOutput: Locator;     // ← NEW
  readonly ageOutput: Locator;        // ← NEW

  constructor(page: Page) {
    this.page = page;

    // Test 1
    this.maleRadio = page.locator('input[name="optradio"][value="Male"]');
    this.femaleRadio = page.locator('input[name="optradio"][value="Female"]');
    this.getValueButton = page.locator('#buttoncheck');
    this.singleResult = page.locator('p.radiobutton');

    // Test 2
    this.rb1 = page.locator('input[name="prop"][value="RadioButton1"]');
    this.rb2 = page.locator('input[name="prop"][value="RadioButton2"]');
    this.rbDisabled = page.locator('input[name="prop"][value="RadioButton3"]');

    // Test 3
    this.genderRadios = page.locator('input[name="gender"]');
    this.ageRadios = page.locator('input[name="ageGroup"]');
    this.getValuesButton = page.locator('button:has-text("Get values")');

    // UPDATED: correct result locators
    this.genderOutput = page.locator('span.genderbutton');          // ← NEW
    this.ageOutput = page.locator('span.groupradiobutton');         // ← NEW
  }

  // Navigate to Radio Button Demo
  async goto() {
    await this.page.goto('radiobutton-demo');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
