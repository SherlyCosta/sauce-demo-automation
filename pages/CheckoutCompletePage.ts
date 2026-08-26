import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly title: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async getCompleteText(): Promise<string> {
    return await this.getText(this.completeText);
  }

  async backHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}
