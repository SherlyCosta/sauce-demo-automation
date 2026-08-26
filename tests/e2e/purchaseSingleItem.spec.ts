import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('E2E Flow 1: Purchase Single Item', () => {
  test.slow(); // Marks test as slow and triples the timeout limit

  test('should complete purchase flow for a single item', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    // 1. Authenticated inventory load
    await inventoryPage.navigate();

    // 2. Add 1 item & Go to Cart
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.goToCart();

    // 3. Cart Checkout
    await cartPage.proceedToCheckout();

    // 4. Fill Checkout Information
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();

    // 5. Finish Overview
    await checkoutOverviewPage.finishCheckout();

    // 6. Verify Confirmation
    const completeHeader = await checkoutCompletePage.getCompleteHeader();
    expect(completeHeader).toBe('Thank you for your order!');
  });
});
