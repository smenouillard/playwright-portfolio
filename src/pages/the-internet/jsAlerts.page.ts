// src/pages/the-internet/jsAlerts.page.ts
// https://the-internet.herokuapp.com/

import { Page } from '@playwright/test';

export class JsAlertsPage {
  constructor(private page: Page) { }

  async goto() {
    // Go to alerts page
    await this.page.goto('/javascript_alerts');
  }

  jsAlertButton() {
    // Return JS alert button
    return this.page.getByRole('button', { name: 'Click for JS Alert' });
  }

  jsConfirmButton() {
    // Return JS confirm button
    return this.page.getByRole('button', { name: 'Click for JS Confirm' });
  }

  jsPromptButton() {
    // Return JS prompt button
    return this.page.getByRole('button', { name: 'Click for JS Prompt' });
  }

  resultText() {
    // Return result element
    return this.page.locator('#result');
  }
}
