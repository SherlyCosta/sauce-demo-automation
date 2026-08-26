import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Remove Items from Cart Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
  });

  test('should remove a single item from cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.removeItemByName(PRODUCTS.BACKPACK.name);

    expect(await cartPage.getItemCount()).toBe(1);
    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).not.toContain(PRODUCTS.BACKPACK.name);
    expect(itemNames).toContain(PRODUCTS.BIKE_LIGHT.name);
  });

  test('should remove all items from cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.removeAllItems();

    expect(await cartPage.getItemCount()).toBe(0);
  });
});
