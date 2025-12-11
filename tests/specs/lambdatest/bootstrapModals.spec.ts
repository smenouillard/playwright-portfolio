// tests/specs/lambdatest/bootstrapModal.windows.chromium.spec.ts
// https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo

import { test, expect } from '@playwright/test';
import { BootstrapModalPage } from '../../../src/pages/lambdatest/bootstrapModals.page';

test.describe('Bootstrap Modal – Windows Chromium only', () => {
  let modal: BootstrapModalPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Skip test if not running on Windows + Chromium (WIP, will run on other platforms later)
    test.skip(
      testInfo.project.name !== 'chromium' || process.platform !== 'win32',
      'Windows + Chromium only'
    );

    // Navigate to page
    await page.goto(
      'https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo',
      { waitUntil: 'domcontentloaded' }
    );

    // Instantiate page object
    modal = new BootstrapModalPage(page);
  });

  test('open modal and verify visibility', async () => {
    // Open single modal
    await modal.openSingleModal();

    // Verify modal is visible
    await expect(modal.singleModal()).toBeVisible();
  });

  test('close modal with Close button', async () => {
    // Open single modal
    await modal.openSingleModal();

    // Close modal using Close button
    await modal.closeWithCloseButton();

    // Verify modal is hidden
    await expect(modal.singleModal()).toBeHidden();
  });

  test('close modal with Save changes', async () => {
    // Open single modal
    await modal.openSingleModal();

    // Close modal using Save changes button
    await modal.closeWithSaveChanges();

    // Verify modal is hidden
    await expect(modal.singleModal()).toBeHidden();
  });
});
