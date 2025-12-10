// tests/specs/lambdatest/inputFormDemo.requiredFields.spec.ts
// https://www.lambdatest.com/selenium-playground/input-form-demo

import { test, expect, Locator } from '@playwright/test';
import { InputFormDemoPage } from '../../../src/pages/lambdatest/inputFormDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// helper to assert native validation state
const expectInvalid = async (loc: Locator) => {
  const valid = await loc.evaluate(el =>
    (el as HTMLInputElement | HTMLSelectElement).checkValidity()
  );
  await expect(valid).toBe(false);
};

// Set baseURL for LambdaTest
test.use({ baseURL: appUrls.lambdaTest });

test.describe('LambdaTest – Input Form Demo – Required fields', () => {

  /**
   * NOTE – Required fields (HTML5 native validation)
   *
   * The following inputs enforce real browser-level required validation:
   *    • Name
   *    • Email
   *    • Password
   *    • Company
   *    • Website
   *    • City
   *    • Address 1
   *    • Address 2
   *    • State
   *    • Zip
   *
   * IMPORTANT:
   * Country is *not* required — empty selection passes HTML5 validation.
   * In a real-world project, QA would normally test and escalate mismatches between
   * visual cues (“looks required”) and actual technical validation rules.
   *
   * All tests here focus on fields that block submission via
   * checkValidity(). Their behavior (accepted formats / values) is tested
   * separately in inputFormDemo.rules.spec.ts.
   *
   */

  // Name is required
  test('Name is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.submitButton.click();
    await expectInvalid(p.nameInput);
  });

  // Email is required
  test('Email is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.nameInput.fill('John');
    await p.submitButton.click();
    await expectInvalid(p.emailInput);
  });

  // Password is required
  test('Password is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.submitButton.click();
    await expectInvalid(p.passwordInput);
  });

  // Company is required
  test('Company is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill up to Password only
    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');

    await p.submitButton.click();
    await expectInvalid(p.companyInput);
  });

  // Website is required
  test('Website is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill up to Company only
    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');

    await p.submitButton.click();
    await expectInvalid(p.websiteInput);
  });

  // City is required
  test('City is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');
    await p.websiteInput.fill('example.com');

    await p.submitButton.click();
    await expectInvalid(p.cityInput);
  });

  // Address1 is required
  test('Address1 is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');
    await p.websiteInput.fill('example.com');
    await p.cityInput.fill('Paris');

    await p.submitButton.click();
    await expectInvalid(p.address1Input);
  });

  // Address2 is required
  test('Address2 is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');
    await p.websiteInput.fill('example.com');
    await p.cityInput.fill('Paris');
    await p.address1Input.fill('123 Street');

    await p.submitButton.click();
    await expectInvalid(p.address2Input);
  });

  // State is required
  test('State is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');
    await p.websiteInput.fill('example.com');
    await p.cityInput.fill('Paris');
    await p.address1Input.fill('123 Street');
    await p.address2Input.fill('Apt 4');

    await p.submitButton.click();
    await expectInvalid(p.stateInput);
  });

  // Zip is required
  test('Zip is required', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.nameInput.fill('John');
    await p.emailInput.fill('john@example.com');
    await p.passwordInput.fill('abcd');
    await p.companyInput.fill('Company');
    await p.websiteInput.fill('example.com');
    await p.cityInput.fill('Paris');
    await p.address1Input.fill('123 Street');
    await p.address2Input.fill('Apt 4');
    await p.stateInput.fill('IDF');

    await p.submitButton.click();
    await expectInvalid(p.zipInput);
  });

});
