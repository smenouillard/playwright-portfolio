// src/pages/lambdatest/bootstrapAlertMessages.page.ts
// https://www.lambdatest.com/selenium-playground/bootstrap-alert-messages-demo

import { Locator, Page } from '@playwright/test';

export class BootstrapAlertMessagesPage {
  readonly page: Page;

  // Action buttons
  readonly autoSuccessButton: Locator;
  readonly manualSuccessButton: Locator;

  // Success alerts
  readonly autoSuccessAlert: Locator;
  readonly manualSuccessAlert: Locator;
  readonly manualSuccessCloseButton: Locator;

  // Neutral page area
  readonly pageContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Map action buttons
    this.autoSuccessButton = page.locator('.btn-success-auto');
    this.manualSuccessButton = page.locator('.btn-success-manual');

    // Map success alerts
    this.autoSuccessAlert = page.locator('.alert-success').first();
    this.manualSuccessAlert = page.locator('.alert-success.alert-dismissible');
    this.manualSuccessCloseButton = this.manualSuccessAlert.locator('.close');

    // Map neutral page container outside alerts
    this.pageContainer = page.locator('section.mt-50');
  }

  // Navigate to Bootstrap Alert Messages page
  async goto(): Promise<void> {
    await this.page.goto('bootstrap-alert-messages-demo');
  }

  // Trigger autoclosable success alert
  async triggerAutoSuccessAlert(): Promise<void> {
    await this.autoSuccessButton.click();
  }

  // Trigger manual success alert
  async triggerManualSuccessAlert(): Promise<void> {
    await this.manualSuccessButton.click();
  }

  // Click directly on the alert element
  async clickOnAlert(alert: Locator): Promise<void> {
    await alert.click();
  }

  // Click on a neutral page area outside alerts
  async clickOutsideAlert(): Promise<void> {
    await this.pageContainer.click();
  }

  // Close manual alert using close button
  async closeManualAlert(): Promise<void> {
    await this.manualSuccessCloseButton.click();
  }
}
