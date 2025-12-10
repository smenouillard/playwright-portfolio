// tests/specs/lambdatest/checkboxDemo.spec.ts
// https://www.lambdatest.com/selenium-playground/

import { test, expect } from '@playwright/test';
import { CheckboxDemoPage } from '../../../src/pages/lambdatest/checkboxDemo.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for Lambdatest playground
test.use({ baseURL: appUrls.lambdaTest });

test.describe('Lambdatest Checkbox Demo', () => {

  test('Single checkbox displays the correct message', async ({ page }) => {
    const c = new CheckboxDemoPage(page);
    await c.goto();

    // Click single checkbox
    await c.singleCheckbox.check();

    // Validate success message
    await expect(c.singleMessage).toBeVisible();
    await expect(c.singleMessage).toHaveText('Checked!');
  });

  test('Disabled checkbox demo behaves correctly', async ({ page }) => {
    const c = new CheckboxDemoPage(page);
    await c.goto();

    // Enabled options (1 and 2)
    await expect(c.disabledOption1).toBeEnabled();
    await expect(c.disabledOption2).toBeEnabled();

    // They can be checked
    await c.disabledOption1.check();
    await expect(c.disabledOption1).toBeChecked();

    await c.disabledOption2.check();
    await expect(c.disabledOption2).toBeChecked();

    // Disabled options (3 and 4)
    await expect(c.disabledOption3).toBeDisabled();
    await expect(c.disabledOption4).toBeDisabled();

    // They must remain unchecked
    await expect(c.disabledOption3).not.toBeChecked();
    await expect(c.disabledOption4).not.toBeChecked();
  });

  test('Check All toggles all multiple checkbox options', async ({ page }) => {
    const c = new CheckboxDemoPage(page);
    await c.goto();

    // Click Check All
    await c.checkAllButton.click();

    // All options should now be checked
    await expect(c.multiOption1).toBeChecked();
    await expect(c.multiOption2).toBeChecked();
    await expect(c.multiOption3).toBeChecked();
    await expect(c.multiOption4).toBeChecked();

    // Button should now display "Uncheck All"
    await expect(c.checkAllButton).toHaveText('Uncheck All');

    // Click Uncheck All
    await c.checkAllButton.click();

    // All options should now be unchecked
    await expect(c.multiOption1).not.toBeChecked();
    await expect(c.multiOption2).not.toBeChecked();
    await expect(c.multiOption3).not.toBeChecked();
    await expect(c.multiOption4).not.toBeChecked();

    // Button should revert to "Check All"
    await expect(c.checkAllButton).toHaveText('Check All');
  });

});
