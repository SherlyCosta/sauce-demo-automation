import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Cart Validation Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should open cart page and verify title', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goToCart();
    await expect(cartPage.page).toHaveURL(/.*cart.html/);
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('should verify added products, prices, and quantities in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);

    await inventoryPage.goToCart();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(2);

    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).toContain(PRODUCTS.BACKPACK.name);
    expect(itemNames).toContain(PRODUCTS.BIKE_LIGHT.name);

    // Verify item quantities are 1
    const quantities = await cartPage.page.locator('.cart_quantity').allTextContents();
    for (const qty of quantities) {
      expect(qty.trim()).toBe('1');
    }

    // Verify prices displayed match
    const prices = await cartPage.page.locator('.inventory_item_price').allTextContents();
    expect(prices).toContain(`$${PRODUCTS.BACKPACK.price}`);
    expect(prices).toContain(`$${PRODUCTS.BIKE_LIGHT.price}`);
  });
});
