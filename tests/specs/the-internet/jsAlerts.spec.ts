// tests/specs/the-internet/jsAlerts.spec.ts
// https://the-internet.herokuapp.com/

import { test, expect } from '@playwright/test';
import { JsAlertsPage } from '../../../src/pages/the-internet/jsAlerts.page';
import { appUrls } from '../../../src/config/appUrls';

test.use({ baseURL: appUrls.theInternet });

// JS Alert
test.describe('JS Alert', () => {
  test('accept alert', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Accept alert
    page.once('dialog', dialog => dialog.accept());

    // Click alert button
    await alerts.jsAlertButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText('You successfully clicked an alert');
  });
});

// JS Confirm
test.describe('JS Confirm', () => {
  test('accept confirm', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Accept confirm
    page.once('dialog', dialog => dialog.accept());

    // Click confirm button
    await alerts.jsConfirmButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText('You clicked: Ok');
  });

  test('dismiss confirm', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Dismiss confirm
    page.once('dialog', dialog => dialog.dismiss());

    // Click confirm button
    await alerts.jsConfirmButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText('You clicked: Cancel');
  });
});

// JS Prompt
test.describe('JS Prompt', () => {
  test('dismiss prompt returns null', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Dismiss prompt
    page.once('dialog', dialog => dialog.dismiss());

    // Click prompt button
    await alerts.jsPromptButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText('You entered: null');
  });

  test('accept empty input', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Accept prompt with empty string
    page.once('dialog', dialog => dialog.accept(''));

    // Click prompt button
    await alerts.jsPromptButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText('You entered:');
  });

  test('accept custom text', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // Go to page
    await alerts.goto();

    // Accept prompt with custom text
    page.once('dialog', dialog =>
      dialog.accept('Portfolio Playwright Sylvain Menouillard')
    );

    // Click prompt button
    await alerts.jsPromptButton().click();

    // Assert result
    await expect(alerts.resultText()).toHaveText(
      'You entered: Portfolio Playwright Sylvain Menouillard'
    );
  });
});
