// tests/specs/lambdatest/selectDropdown.spec.ts
// https://www.lambdatest.com/selenium-playground/

import { test, expect } from '@playwright/test';
import { SelectDropdownPage } from '../../../src/pages/lambdatest/selectDropdown.page';
import { appUrls } from '../../../src/config/appUrls';

test.use({ baseURL: appUrls.lambdaTest });

test.describe('Lambdatest – Select Dropdown Demo', () => {

  // Skip suite on WebKit: this demo's multi-select widget does not support multi-selection on WebKit (Meta-click included)
  test.skip(({ browserName }) => browserName === 'webkit',
    'This demo page does not support multi-select behavior on WebKit.'
  );

  test('Select multiple options then verify full list and first selected', async ({ page }) => {
    const d = new SelectDropdownPage(page);
    await d.goto();

    const options = ['California', 'Texas', 'New Jersey'];

    // Select options using custom ctrl-select helper
    await d.ctrlSelect(options);

    // Check full list
    await d.getAllSelectedBtn.click();
    await expect(d.allSelectedOutput).toHaveText('California,Texas,New Jersey');

    // Check first selected
    await d.firstSelectedBtn.click();
    await expect(d.firstSelectedOutput).toHaveText('California');
  });

  test('Select multiple options then verify first selected then full list', async ({ page }) => {
    const d = new SelectDropdownPage(page);
    await d.goto();

    const options = ['California', 'Texas', 'New Jersey'];

    // Select options using custom ctrl-select helper
    await d.ctrlSelect(options);

    // First selected
    await d.firstSelectedBtn.click();
    await expect(d.firstSelectedOutput).toHaveText('California');

    // Full list
    await d.getAllSelectedBtn.click();
    await expect(d.allSelectedOutput).toHaveText('California,Texas,New Jersey');
  });

});
