import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async waitForElementVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async click(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElementVisible(locator);
    return (await locator.textContent())?.trim() || '';
  }

  async hover(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.hover();
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.selectOption(value);
  }

  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${fileName}.png` });
  }
}
