// tests/specs/lambdatest/radioButtonDemo.spec.ts
// https://www.lambdatest.com/selenium-playground/radiobutton-demo

import { test, expect } from '@playwright/test';
import { RadioButtonDemoPage } from '../../../src/pages/lambdatest/radioButtonDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for LambdaTest
test.use({ baseURL: appUrls.lambdaTest });

test.describe('LambdaTest – Radio Button Demo', () => {

  test('Test 1 – Get selected value', async ({ page }) => {
    const p = new RadioButtonDemoPage(page);
    await p.goto();

    // select male and verify message
    await p.maleRadio.check();
    await p.getValueButton.click();
    await expect(p.singleResult).toHaveText("Radio button 'Male' is checked");

    // select female and verify message
    await p.femaleRadio.check();
    await p.getValueButton.click();
    await expect(p.singleResult).toHaveText("Radio button 'Female' is checked");
  });

  test('Test 2 – Disabled radio button behavior', async ({ page }) => {
    const p = new RadioButtonDemoPage(page);
    await p.goto();

    // radio button 1 selectable
    await p.rb1.check();
    await expect(p.rb1).toBeChecked();

    // radio button 2 selectable, replaces rb1
    await p.rb2.check();
    await expect(p.rb2).toBeChecked();
    await expect(p.rb1).not.toBeChecked();

    // disabled radio cannot be selected
    await expect(p.rbDisabled).toBeDisabled();
  });

  test('Test 3 – Random selection for gender and age', async ({ page }) => {
    const p = new RadioButtonDemoPage(page);
    await p.goto();

    // select random gender
    const genders = ['Male', 'Female', 'Other'];
    const genderValue = genders[Math.floor(Math.random() * genders.length)];
    await page.locator(`input[name="gender"][value="${genderValue}"]`).check();

    // select random age range
    const ages = ['0 - 5', '5 - 15', '15 - 50'];
    const ageValue = ages[Math.floor(Math.random() * ages.length)];
    await page.locator(`input[name="ageGroup"][value="${ageValue}"]`).check();

    // get values
    await p.getValuesButton.click();

    // verify gender output
    await expect(p.genderOutput).toHaveText(genderValue);

    // verify age output
    await expect(p.ageOutput).toHaveText(ageValue);
  });

});
