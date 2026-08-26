import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly title: Locator;
  private readonly cartItems: Locator;
  private readonly itemNames: Locator;
  private readonly summarySubtotal: Locator;
  private readonly summaryTax: Locator;
  private readonly summaryTotal: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.getText(this.summarySubtotal);
    const match = text.match(/Item total: \$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.getText(this.summaryTax);
    const match = text.match(/Tax: \$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.getText(this.summaryTotal);
    const match = text.match(/Total: \$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton);
  }

  async cancelCheckout(): Promise<void> {
    await this.click(this.cancelButton);
  }
}
