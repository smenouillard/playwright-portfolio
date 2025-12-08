// tests/specs/the-internet/addRemoveElements.spec.ts
// https://the-internet.herokuapp.com/

import { test, expect } from '@playwright/test';
import { AddRemoveElementsPage } from '../../../src/pages/the-internet/addRemoveElements.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for The Internet
test.use({ baseURL: appUrls.theInternet });

test.describe('The Internet – Add/Remove Elements', () => {

  test('Initial state contains no delete buttons', async ({ page }) => {
    const p = new AddRemoveElementsPage(page);
    await p.goto();

    // No delete buttons present at load
    await expect(p.deleteButtons).toHaveCount(0);
  });

  test('Add multiple delete buttons (random between 3 and 10)', async ({ page }) => {
    const p = new AddRemoveElementsPage(page);
    await p.goto();

    // Random count between 3 and 10
    const count = Math.floor(Math.random() * 8) + 3;

    // Add elements
    for (let i = 0; i < count; i++) {
      await p.addButton.click();
    }

    // Verify correct number of added delete buttons
    await expect(p.deleteButtons).toHaveCount(count);
  });

  test('Remove delete buttons one by one until none remain', async ({ page }) => {
    const p = new AddRemoveElementsPage(page);
    await p.goto();

    // Add a random number of elements
    const count = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < count; i++) {
      await p.addButton.click();
    }

    // Now remove one by one
    for (let remaining = count; remaining > 0; remaining--) {
      await expect(p.deleteButtons).toHaveCount(remaining);

      // Always delete the first button
      await p.deleteButtons.first().click();
    }

    // All elements should be removed
    await expect(p.deleteButtons).toHaveCount(0);
  });

});
