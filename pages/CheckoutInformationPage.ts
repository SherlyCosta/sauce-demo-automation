import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutInformationPage extends BasePage {
  readonly title: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName);
  }

  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.postalCodeInput, postalCode);
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  async continue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async cancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessageContainer);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }
}
