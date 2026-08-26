import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly title: Locator;
  private readonly cartItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async removeItemByName(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/ /g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${formattedName}"]`);
    await this.click(removeButton);
  }

  async removeAllItems(): Promise<void> {
    const removeButtons = this.page.locator('button[data-test^="remove"]');
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.nth(0).click();
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }
}
