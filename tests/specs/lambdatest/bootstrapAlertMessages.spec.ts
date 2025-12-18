// tests/specs/lambdatest/bootstrapAlertMessages.spec.ts
// https://www.lambdatest.com/selenium-playground/bootstrap-alert-messages-demo

import { test, expect } from '@playwright/test';
import { appUrls } from '../../../src/config/appUrls';
import { BootstrapAlertMessagesPage } from '../../../src/pages/lambdatest/bootstrapAlertMessages.page';

// Set baseURL for Lambdatest playground
test.use({ baseURL: appUrls.lambdaTest });

test.describe('Bootstrap Alert Messages – Success alerts', () => {
  let alertsPage: BootstrapAlertMessagesPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object
    alertsPage = new BootstrapAlertMessagesPage(page);

    // Navigate to page
    await alertsPage.goto();
  });

  test('Should display and auto-dismiss success alert without closing on clicks', async () => {
    // Trigger autoclosable success alert
    await alertsPage.triggerAutoSuccessAlert();

    // Verify alert is displayed
    await expect(alertsPage.autoSuccessAlert).toBeVisible();

    // Click on the alert and ensure it remains visible
    await alertsPage.clickOnAlert(alertsPage.autoSuccessAlert);
    await expect(alertsPage.autoSuccessAlert).toBeVisible();

    // Click outside the alert and ensure it remains visible
    await alertsPage.clickOutsideAlert();
    await expect(alertsPage.autoSuccessAlert).toBeVisible();

    // Ensure alert stays visible briefly before auto-dismiss
    await expect(alertsPage.autoSuccessAlert).toBeVisible({ timeout: 1000 });

    // Verify alert auto-dismisses within expected time
    await expect(alertsPage.autoSuccessAlert).toBeHidden({ timeout: 6000 });

    // Verify alert cannot be displayed again
    await alertsPage.triggerAutoSuccessAlert();
    await expect(alertsPage.autoSuccessAlert).toBeHidden();
  });

  test('Should display and manually close success alert without closing on clicks', async () => {
    // Trigger manual success alert
    await alertsPage.triggerManualSuccessAlert();

    // Verify alert is displayed
    await expect(alertsPage.manualSuccessAlert).toBeVisible();

    // Click on the alert and ensure it remains visible
    await alertsPage.clickOnAlert(alertsPage.manualSuccessAlert);
    await expect(alertsPage.manualSuccessAlert).toBeVisible();

    // Click outside the alert and ensure it remains visible
    await alertsPage.clickOutsideAlert();
    await expect(alertsPage.manualSuccessAlert).toBeVisible();

    // Close alert using close button
    await alertsPage.closeManualAlert();
    await expect(alertsPage.manualSuccessAlert).toBeHidden();

    // Verify alert cannot be displayed again
    await alertsPage.triggerManualSuccessAlert();
    await expect(alertsPage.manualSuccessAlert).toBeHidden();
  });
});
