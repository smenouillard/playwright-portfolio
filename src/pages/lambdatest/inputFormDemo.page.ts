// src/pages/lambdatest/inputFormDemo.page.ts
// https://www.lambdatest.com/selenium-playground/input-form-demo

import { Page, Locator } from '@playwright/test';

export class InputFormDemoPage {
  readonly page: Page;

  // form
  readonly form: Locator;

  // form fields
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly companyInput: Locator;
  readonly websiteInput: Locator;
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;

  // button and success message
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // form container
    this.form = page.locator('#seleniumform');

    // text inputs
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#inputEmail4');
    this.passwordInput = page.locator('#inputPassword4');
    this.companyInput = page.locator('#company');
    this.websiteInput = page.locator('#websitename');
    this.cityInput = page.locator('#inputCity');
    this.address1Input = page.locator('#inputAddress1');
    this.address2Input = page.locator('#inputAddress2');
    this.stateInput = page.locator('#inputState');
    this.zipInput = page.locator('#inputZip');

    // dropdown
    this.countrySelect = page.locator('select[name="country"]');

    // submit button
    this.submitButton = page.locator('button.selenium_btn');

    // success message
    this.successMessage = page.locator('.success-msg');
  }

  // navigate to page
  async goto() {
    await this.page.goto('input-form-demo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // fill all form fields
  async fillForm(data: {
    name: string;
    email: string;
    password: string;
    company: string;
    website: string;
    country?: string;
    city: string;
    address1: string;
    address2: string;
    state: string;
    zip: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.companyInput.fill(data.company);
    await this.websiteInput.fill(data.website);
    // select only if a value is provided (allows tests to leave country empty)
    if (data.country) {
      await this.countrySelect.selectOption(data.country);
    }
    await this.cityInput.fill(data.city);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
  }
}
