import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CONSTANTS } from '../data/constants';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
  }

  async navigate(): Promise<void> {
    await this.navigateTo(CONSTANTS.BASE_URL);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessageContainer);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }

  async clearFields(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
