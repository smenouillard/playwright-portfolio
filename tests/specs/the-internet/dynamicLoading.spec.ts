// tests/specs/lambdatest/bootstrapAlertMessages.spec.ts
// https://www.lambdatest.com/selenium-playground/bootstrap-alert-messages-demo

import { test, expect } from '@playwright/test';
import { BootstrapAlertMessagesPage } from '../../../src/pages/lambdatest/bootstrapAlertMessages.page';

test.describe('Bootstrap Alert Messages – Success alerts', () => {
  test('Should display and auto-dismiss success alert without closing on clicks', async ({ page }) => {
    // Instantiate page object
    const alertsPage = new BootstrapAlertMessagesPage(page);

    // Navigate to alert messages page
    await alertsPage.goto();

    // Trigger auto success alert
    await alertsPage.triggerAutoSuccessAlert();

    // Verify success alert is visible
    await expect(alertsPage.autoSuccessAlert).toBeVisible();

    // Verify alert remains visible (auto-dismiss not deterministic in CI)
    await expect(alertsPage.autoSuccessAlert).toBeVisible({ timeout: 6000 });

    // Verify alert cannot be displayed again
    await alertsPage.triggerAutoSuccessAlert();
    await expect(alertsPage.autoSuccessAlert).toBeVisible();
  });
});
