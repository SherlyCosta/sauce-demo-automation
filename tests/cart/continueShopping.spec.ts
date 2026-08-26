import { test, expect } from '../../fixtures/page.fixture';

test.describe('Continue Shopping Navigation Tests', () => {
  test('should navigate back to inventory page via Continue Shopping button', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.goToCart();

    await cartPage.continueShopping();

    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
