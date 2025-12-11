// src/pages/lambdatest/bootstrapModal.page.ts
// https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo

import { Page, Locator } from '@playwright/test';

export class BootstrapModalPage {
  private readonly page: Page;

  constructor(page: Page) {
    // Store Playwright page instance
    this.page = page;
  }

  // Return launch button for single modal
  singleModalLaunchButton(): Locator {
    return this.page.getByRole('button', { name: 'Launch Modal' }).first();
  }

  // Return single modal container
  singleModal(): Locator {
    return this.page.locator('#myModal');
  }

  // Return Close button inside modal
  closeButton(): Locator {
    return this.page.locator('#myModal').getByRole('button', { name: 'Close' });
  }

  // Return Save changes button inside modal
  saveChangesButton(): Locator {
    return this.page
      .locator('#myModal')
      .getByRole('button', { name: 'Save changes' });
  }

  // Open single modal
  async openSingleModal(): Promise<void> {
    await this.singleModalLaunchButton().click();
  }

  // Close modal using Close button
  async closeWithCloseButton(): Promise<void> {
    await this.closeButton().click();
  }

  // Close modal using Save changes button
  async closeWithSaveChanges(): Promise<void> {
    await this.saveChangesButton().click();
  }
}
