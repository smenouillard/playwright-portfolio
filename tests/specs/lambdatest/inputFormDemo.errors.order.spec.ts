// tests/specs/lambdatest/inputFormDemo.errors.order.spec.ts
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

/**
 * NOTE — We only test the stable part of HTML5 validation order:
 * Name → Email → Password.
 *
 * Browsers always flag the first invalid required field in DOM order.
 * Testing deeper ordering adds no value.
 * 
 * Full required-field coverage is in inputFormDemo.requiredFields.spec.ts.
 */


test.describe('LambdaTest – Input Form Demo – Required fields order validation', () => {

  test('Empty submit shows error on first required field (Name)', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // submit empty form
    await p.submitButton.click();

    // first error is on Name
    await expectInvalid(p.nameInput);
  });

  test('Correcting Name moves error to Email', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill Name only
    await p.nameInput.fill('John Doe');

    // submit -> error on Email
    await p.submitButton.click();
    await expectInvalid(p.emailInput);
  });

  test('Correcting Name + Email moves error to Password', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // fill Name + Email only
    await p.nameInput.fill('John Doe');
    await p.emailInput.fill('john@example.com');

    // submit -> error on Password
    await p.submitButton.click();
    await expectInvalid(p.passwordInput);
  });

  test('Fixing an invalid field makes it valid on next submit', async ({ page }) => {
    const p = new InputFormDemoPage(page);
    await p.goto();

    // leave Email empty
    await p.nameInput.fill('John Doe');

    // first submit -> invalid email
    await p.submitButton.click();
    await expectInvalid(p.emailInput);

    // fix email
    await p.emailInput.fill('john@example.com');

    // next submit -> email is now valid
    await p.submitButton.click();
    await expectValid(p.emailInput);
  });

});
