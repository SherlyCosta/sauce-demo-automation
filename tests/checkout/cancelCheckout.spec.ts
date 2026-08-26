import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';
import { PRODUCTS } from '../../data/products';

test.describe('Cancel Checkout Tests', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(checkoutInformationPage.page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('should return to cart page when clicking Cancel on checkout step one', async ({ checkoutInformationPage, cartPage }) => {
    await checkoutInformationPage.cancel();
    await expect(cartPage.page).toHaveURL(/.*cart.html/);
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('should return to inventory page when clicking Cancel on checkout step two', async ({ checkoutInformationPage, checkoutOverviewPage, inventoryPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);

    await checkoutOverviewPage.cancelCheckout();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
