import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  private readonly inventoryItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly sortDropdown: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/inventory.html');
  }

  async getPageTitleText(): Promise<string> {
    return await this.getText(this.title);
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  async addItemToCartByName(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/ /g, '-');
    const addButton = this.page.locator(`[data-test="add-to-cart-${formattedName}"]`);
    await this.click(addButton);
  }

  async removeItemByName(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/ /g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${formattedName}"]`);
    await this.click(removeButton);
  }

  async addAllItemsToCart(): Promise<void> {
    const addButtons = this.page.locator('button[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(0).click();
    }
  }

  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.locator('.inventory_item_name', { hasText: productName });
    await this.click(productLink);
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const countText = await this.shoppingCartBadge.textContent();
      return countText ? parseInt(countText.trim(), 10) : 0;
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }

  async selectSortOption(optionValue: string): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }
}
