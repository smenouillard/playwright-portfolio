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

    // go to page
    await alerts.goto();

    // accept alert
    page.once('dialog', dialog => dialog.accept());

    // click alert button
    await alerts.jsAlertButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText('You successfully clicked an alert');
  });
});

// JS Confirm
test.describe('JS Confirm', () => {
  test('accept confirm', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // go to page
    await alerts.goto();

    // accept confirm
    page.once('dialog', dialog => dialog.accept());

    // click confirm button
    await alerts.jsConfirmButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText('You clicked: Ok');
  });

  test('dismiss confirm', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // go to page
    await alerts.goto();

    // dismiss confirm
    page.once('dialog', dialog => dialog.dismiss());

    // click confirm button
    await alerts.jsConfirmButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText('You clicked: Cancel');
  });
});

// JS Prompt
test.describe('JS Prompt', () => {
  test('dismiss prompt returns null', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // go to page
    await alerts.goto();

    // dismiss prompt
    page.once('dialog', dialog => dialog.dismiss());

    // click prompt button
    await alerts.jsPromptButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText('You entered: null');
  });

  test('accept empty input', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // go to page
    await alerts.goto();

    // accept prompt with empty string
    page.once('dialog', dialog => dialog.accept(''));

    // click prompt button
    await alerts.jsPromptButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText('You entered:');
  });

  test('accept custom text', async ({ page }) => {
    const alerts = new JsAlertsPage(page);

    // go to page
    await alerts.goto();

    // accept prompt with custom text
    page.once('dialog', dialog =>
      dialog.accept('Portfolio Playwright Sylvain Menouillard')
    );

    // click prompt button
    await alerts.jsPromptButton().click();

    // assert result
    await expect(alerts.resultText()).toHaveText(
      'You entered: Portfolio Playwright Sylvain Menouillard'
    );
  });
});
