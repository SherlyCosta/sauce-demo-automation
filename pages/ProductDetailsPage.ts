import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('button[data-test^="add-to-cart"]');
    this.removeButton = page.locator('button[data-test^="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.getText(this.productPrice);
    return parseFloat(priceText.replace('$', ''));
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
  }

  async removeFromCart(): Promise<void> {
    await this.click(this.removeButton);
  }

  async backToProducts(): Promise<void> {
    await this.click(this.backToProductsButton);
  }
}
