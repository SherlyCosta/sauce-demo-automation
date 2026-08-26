import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Reset App State Tests', () => {
  test('should clear cart and badge count when Reset App State is clicked', async ({ inventoryPage, burgerMenu }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await burgerMenu.resetAppState();
    await burgerMenu.closeMenu();

    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
