// tests/specs/lambdatest/inputFormDemo.errors.email.spec.ts
// https://www.lambdatest.com/selenium-playground/input-form-demo

import { test, expect, Locator } from '@playwright/test';
import { InputFormDemoPage } from '../../../src/pages/lambdatest/inputFormDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// helper matchers for native validity
const expectInvalid = async (locator: Locator) => {
  const isValid = await locator.evaluate(el => (el as HTMLInputElement).checkValidity());
  await expect(isValid).toBe(false);
};

const expectValid = async (locator: Locator) => {
  const isValid = await locator.evaluate(el => (el as HTMLInputElement).checkValidity());
  await expect(isValid).toBe(true);
};

// Set baseURL for LambdaTest
test.use({ baseURL: appUrls.lambdaTest });

test.describe('LambdaTest – Input Form Demo – Native HTML5 email validation', () => {

  // invalid emails dataset (value = tested data, label = safe test name)
  const invalidEmails = [
    { value: 'test', label: 'simple text' },
    { value: 'test@', label: 'name with at sign' },
    { value: 'john@.com', label: 'name at dot com' },
    { value: '@domain.com', label: 'missing local part' },
    { value: 'john@@example.com', label: 'double at sign' },
    { value: 'john@domain..com', label: 'double dot in domain' },
  ];

  for (const { value, label } of invalidEmails) {
    test(`Email invalid – ${label}`, async ({ page }) => {
      const p = new InputFormDemoPage(page);
      await p.goto();

      // fill all required fields except email
      await p.nameInput.fill('John Doe');
      await p.passwordInput.fill('abc123');
      await p.companyInput.fill('MyCompany');
      await p.websiteInput.fill('example.com');
      await p.cityInput.fill('Paris');
      await p.address1Input.fill('123 Street');
      await p.address2Input.fill('Apt 4');
      await p.stateInput.fill('IDF');
      await p.zipInput.fill('75000');

      // fill invalid email
      await p.emailInput.fill(value);

      // submit -> should trigger native email validation
      await p.submitButton.click();

      // email must be invalid
      await expectInvalid(p.emailInput);
    });
  }

  test('Valid email passes HTML5 validation', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill all required fields with valid data
    await p.fillForm({
      name: 'Valid User',
      email: 'valid@example.com',
      password: 'password',
      company: 'Company',
      website: 'example.com',
      city: 'Paris',
      address1: '1 Rue Test',
      address2: '2nd Floor',
      state: 'IDF',
      zip: '75000',
    });

    // submit -> email should be valid
    await p.submitButton.click();
    await expectValid(p.emailInput);
  });

});
