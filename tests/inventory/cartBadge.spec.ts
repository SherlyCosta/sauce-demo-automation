import { test, expect } from '../../fixtures/page.fixture';

test.describe('Cart Badge Count Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should not display cart badge when no products are added', async ({ inventoryPage }) => {
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('should increment badge count as products are added and decrement when removed', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.addItemToCartByName('Sauce Labs Fleece Jacket');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.removeItemByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeItemByName('Sauce Labs Fleece Jacket');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
