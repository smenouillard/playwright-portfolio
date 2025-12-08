// tests/specs/lambdatest/inputFormDemo.rules.spec.ts
// https://www.lambdatest.com/selenium-playground/input-form-demo

import { test, expect, Locator } from '@playwright/test';
import { InputFormDemoPage } from '../../../src/pages/lambdatest/inputFormDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// Business Rules (current state observed on the live page)
// -------------------------------------------------------
// Name: required, accepts any non-empty string
// Email: required, must match HTML5 <input type="email"> format
// Password: required, accepts any non-empty string
// Company: required, accepts any non-empty string
// Website: required, accepts any non-empty string
// Country: optional, any selected value accepted
// City: required, accepts any non-empty string
// Address1: required, accepts any non-empty string
// Address2: required, accepts any non-empty string
// State: required, accepts any non-empty string
// Zip: required, accepts any non-empty string (no pattern constraint)
// -------------------------------------------------------
// Purpose of this test suite: detect any change in field validation rules
// If the site adds new constraints or removes existing ones, tests must fail
// -------------------------------------------------------

// helper to assert HTML5 validity = true
const expectValid = async (loc: Locator) => {
  const valid = await loc.evaluate(el => (el as HTMLInputElement | HTMLSelectElement).checkValidity());
  await expect(valid).toBe(true);
};

// helper to assert HTML5 validity = false
const expectInvalid = async (loc: Locator) => {
  const valid = await loc.evaluate(el => (el as HTMLInputElement | HTMLSelectElement).checkValidity());
  await expect(valid).toBe(false);
};

// Set baseURL for LambdaTest
test.use({ baseURL: appUrls.lambdaTest });

test.describe('LambdaTest – Input Form Demo – Business rules', () => {

  // Name: required, any non-empty string allowed
  test('Name accepts any non-empty string', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.nameInput.fill('');
    await expectInvalid(p.nameInput);
    await p.nameInput.fill('John');
    await expectValid(p.nameInput);
  });

  // Email: required, must follow HTML5 email pattern
  test('Email must follow HTML5 format rules', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.emailInput.fill('');
    await expectInvalid(p.emailInput);
    await p.emailInput.fill('invalid');
    await expectInvalid(p.emailInput);
    await p.emailInput.fill('valid@example.com');
    await expectValid(p.emailInput);
  });

  // Password: required, any non-empty string allowed
  test('Password accepts any non-empty string', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.passwordInput.fill('');
    await expectInvalid(p.passwordInput);
    await p.passwordInput.fill('abcd');
    await expectValid(p.passwordInput);
  });

  // Company: required, any non-empty string allowed
  test('Company accepts any non-empty string', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.companyInput.fill('');
    await expectInvalid(p.companyInput);
    await p.companyInput.fill('ACME');
    await expectValid(p.companyInput);
  });

  // Website: required, any non-empty string allowed
  test('Website accepts any non-empty string', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.websiteInput.fill('');
    await expectInvalid(p.websiteInput);
    await p.websiteInput.fill('test.com');
    await expectValid(p.websiteInput);
  });

  // Country: optional, any selected value valid
  test('Country is optional and any selected value is valid', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await expectValid(p.countrySelect);
    await p.countrySelect.selectOption('FR');
    await expectValid(p.countrySelect);
  });

  // City: required, any non-empty string allowed
  test('City accepts any non-empty string (required)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.cityInput.fill('');
    await expectInvalid(p.cityInput);
    await p.cityInput.fill('Paris');
    await expectValid(p.cityInput);
  });

  // Address1 & Address2: required, any non-empty string allowed
  test('Address1 and Address2 accept any non-empty string (required)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.address1Input.fill('');
    await expectInvalid(p.address1Input);
    await p.address1Input.fill('123 Street');
    await expectValid(p.address1Input);

    await p.address2Input.fill('');
    await expectInvalid(p.address2Input);
    await p.address2Input.fill('Floor 2');
    await expectValid(p.address2Input);
  });

  // State: required, any non-empty string allowed
  test('State accepts any non-empty string (required)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();
    await p.stateInput.fill('');
    await expectInvalid(p.stateInput);
    await p.stateInput.fill('IDF');
    await expectValid(p.stateInput);
  });

  // Zip: required, any non-empty string allowed (no regex)
  test('Zip accepts any non-empty string (required, no pattern)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    await p.zipInput.fill('');
    await expectInvalid(p.zipInput);

    await p.zipInput.fill('75000');
    await expectValid(p.zipInput);

    await p.zipInput.fill('ABCDE');
    await expectValid(p.zipInput);
  });

});
