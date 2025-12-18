// tests/specs/the-internet/dynamicLoading.spec.ts
// https://the-internet.herokuapp.com

import { test } from '@playwright/test';
import { DynamicLoadingPage } from '../../../src/pages/the-internet/dynamicLoading.page';

test.describe('Dynamic Loading – Hello World', () => {
  test.beforeEach(async ({ }, testInfo) => {
    // Skip test if not running on Windows Chromium
    test.skip(
      testInfo.project.name !== 'Windows - Chromium',
      'WIP we test Windows Chromium only for now'
    );
  });

  test('Example 1 – hidden element becomes visible', async ({ page }) => {
    // Instantiate page object
    const dynamicLoading = new DynamicLoadingPage(page);

    // Navigate to Dynamic Loading entry page
    await dynamicLoading.goto();

    // Open Example 1 page
    await dynamicLoading.openExample1();

    // Start dynamic loading
    await dynamicLoading.start();

    // Assert loader lifecycle
    await dynamicLoading.expectLoaderLifecycle();

    // Assert Hello World success message and loader disappearance
    await dynamicLoading.expectHelloWorld();
  });

  test('Example 2 – element is rendered dynamically', async ({ page }) => {
    // Instantiate page object
    const dynamicLoading = new DynamicLoadingPage(page);

    // Navigate to Dynamic Loading entry page
    await dynamicLoading.goto();

    // Open Example 2 page
    await dynamicLoading.openExample2();

    // Start dynamic loading
    await dynamicLoading.start();

    // Assert loader lifecycle
    await dynamicLoading.expectLoaderLifecycle();

    // Assert Hello World success message and loader disappearance
    await dynamicLoading.expectHelloWorld();
  });
});
