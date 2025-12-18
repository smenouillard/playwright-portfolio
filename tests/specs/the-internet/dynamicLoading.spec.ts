// tests/specs/the-internet/dynamicLoading.spec.ts
// https://the-internet.herokuapp.com

import { test } from '@playwright/test';
import { DynamicLoadingPage } from '../../../src/pages/the-internet/dynamicLoading.page';

test.describe('Dynamic Loading – Hello World', () => {
  test('Example 1 – hidden element becomes visible', async ({ page }) => {
    // Instantiate page object
    const dynamicLoading = new DynamicLoadingPage(page);

    // Navigate to Dynamic Loading entry page
    await dynamicLoading.goto();

    // Open "Example 1: Element on page that is hidden"
    await dynamicLoading.openExample1();

    // Start dynamic loading
    await dynamicLoading.start();

    // Assert loader appears, stays briefly, then disappears
    await dynamicLoading.expectLoaderLifecycle();

    // Assert final "Hello World!" message is visible and correct
    await dynamicLoading.expectHelloWorld();
  });

  test('Example 2 – element is rendered dynamically', async ({ page }) => {
    // Instantiate page object
    const dynamicLoading = new DynamicLoadingPage(page);

    // Navigate to Dynamic Loading entry page
    await dynamicLoading.goto();

    // Open "Example 2: Element rendered after the fact"
    await dynamicLoading.openExample2();

    // Start dynamic loading
    await dynamicLoading.start();

    // Assert loader appears, stays briefly, then disappears
    await dynamicLoading.expectLoaderLifecycle();

    // Assert final "Hello World!" message is visible and correct
    await dynamicLoading.expectHelloWorld();
  });
});
