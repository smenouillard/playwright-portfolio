// tests/specs/lambdatest/inputFormDemo.spec.ts
// https://www.lambdatest.com/selenium-playground/input-form-demo

import { test, expect } from '@playwright/test';
import { InputFormDemoPage } from '../../../src/pages/lambdatest/inputFormDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for LambdaTest
test.use({ baseURL: appUrls.lambdaTest });

/**
 * NOTE — This file contains the *happy path* (successful submission).
 * Validation logic is fully covered in:
 *  - inputFormDemo.requiredFields.spec.ts
 *  - inputFormDemo.errors.order.spec.ts
 *  - inputFormDemo.errors.email.spec.ts
 *  - inputFormDemo.rules.spec.ts
 */

test.describe('LambdaTest – Input Form Demo', () => {

  test('Submit full form successfully (happy path)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill all fields
    await p.fillForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      company: 'MyCompany',
      website: 'www.example.com',
      country: 'FR',
      city: 'Paris',
      address1: '123 Rue Test',
      address2: 'Apartment 4B',
      state: 'Ile-de-France',
      zip: '75000'
    });

    // submit form
    await p.submitButton.click();

    // success message is visible
    await expect(p.successMessage).toBeVisible();

    // form is hidden after submission
    await expect(p.form).toBeHidden();
  });

});
