import { test, expect } from '../../fixtures/page.fixture';

test.describe('Remove Products from Inventory Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should remove one added product and update button state', async ({ inventoryPage }) => {
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addItemToCartByName(productName);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeItemByName(productName);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    const addButton = inventoryPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('Add to cart');
  });

  test('should remove multiple added products', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);

    await inventoryPage.removeItemByName('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.removeItemByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should remove all products after adding all', async ({ inventoryPage }) => {
    await inventoryPage.addAllItemsToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe(6);

    const names = await inventoryPage.getAllProductNames();
    for (const name of names) {
      await inventoryPage.removeItemByName(name);
    }

    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
