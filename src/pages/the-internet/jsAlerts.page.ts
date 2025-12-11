// src/pages/the-internet/jsAlerts.page.ts
// https://the-internet.herokuapp.com/

import { Page } from '@playwright/test';

export class JsAlertsPage {
  constructor(private page: Page) { }

  async goto() {
    // go to alerts page
    await this.page.goto('/javascript_alerts');
  }

  jsAlertButton() {
    // return js alert button
    return this.page.getByRole('button', { name: 'Click for JS Alert' });
  }

  jsConfirmButton() {
    // return js confirm button
    return this.page.getByRole('button', { name: 'Click for JS Confirm' });
  }

  jsPromptButton() {
    // return js prompt button
    return this.page.getByRole('button', { name: 'Click for JS Prompt' });
  }

  resultText() {
    // return result element
    return this.page.locator('#result');
  }
}
