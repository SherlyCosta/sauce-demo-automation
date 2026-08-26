import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';

test.describe('Checkout Button Navigation Tests', () => {
  test('should navigate to checkout information page when items exist in cart', async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);

    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await expect(checkoutInformationPage.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');
  });
});
