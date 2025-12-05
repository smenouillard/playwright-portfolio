// tests/specs/the-internet/dropdown.spec.ts
// https://the-internet.herokuapp.com/

import { test, expect } from '@playwright/test';
import { DropdownPage } from '../../../src/pages/the-internet/dropdown.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for The Internet
test.use({ baseURL: appUrls.theInternet });

test.describe('The Internet – Dropdown List', () => {

  test('Initial state shows placeholder text', async ({ page }) => {
    const d = new DropdownPage(page);
    await d.goto();

    // Dropdown shows placeholder text
    await expect(d.dropdown).toHaveValue('');
  });

  test('Selecting Option 1 is preserved', async ({ page }) => {
    const d = new DropdownPage(page);
    await d.goto();

    // Select Option 1
    await d.dropdown.selectOption('1');

    // Dropdown now has value "1"
    await expect(d.dropdown).toHaveValue('1');
  });

  test('Selecting Option 2 is preserved', async ({ page }) => {
    const d = new DropdownPage(page);
    await d.goto();

    // Select Option 2
    await d.dropdown.selectOption('2');

    // Dropdown now has value "2"
    await expect(d.dropdown).toHaveValue('2');
  });

});
