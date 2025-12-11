// tests/specs/lambdatest/sliders.spec.ts
// https://www.lambdatest.com/selenium-playground/

import { test, expect } from '@playwright/test';
import { SlidersPage } from '../../../src/pages/lambdatest/sliders.page';
import { appUrls } from '../../../src/config/appUrls';

// Ensure relative paths resolve against the Lambdatest playground
test.use({ baseURL: appUrls.lambdaTest });

test.describe('Drag & Drop Sliders', () => {
  test('move default value 25 slider to 95 and verify', async ({ page }) => {
    const sliders = new SlidersPage(page);

    // Go to page
    await sliders.goto();

    // Set slider to 95
    await sliders.setSliderTo(95);

    // Assert value is 95
    await expect(sliders.outputDefault25()).toHaveText('95');
  });
});
