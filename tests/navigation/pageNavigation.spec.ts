import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('Sequential Page Navigation Chain', () => {
  test('should navigate seamlessly through the entire purchase workflow chain', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    // 1. Inventory -> Cart
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.goToCart();
    await expect(cartPage.page).toHaveURL(/.*cart.html/);

    // 2. Cart -> Continue Shopping -> Inventory
    await cartPage.continueShopping();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);

    // 3. Inventory -> Cart -> Checkout
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(checkoutInformationPage.page).toHaveURL(/.*checkout-step-one.html/);

    // 4. Checkout -> Overview
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);

    // 5. Overview -> Finish
    await checkoutOverviewPage.finishCheckout();
    await expect(checkoutCompletePage.page).toHaveURL(/.*checkout-complete.html/);

    // 6. Finish -> Back Home
    await checkoutCompletePage.backHome();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });
});
