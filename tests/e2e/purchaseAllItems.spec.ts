import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('E2E Flow 3: Purchase All Items', () => {
  test.slow(); // Marks test as slow and triples the timeout limit

  test('should add all products to cart and complete checkout', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.navigate();

    // Add all 6 products
    await inventoryPage.addAllItemsToCart();
    expect(await inventoryPage.getCartBadgeCount()).toBe(6);

    // Navigate to Cart
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(6);

    // Proceed to Checkout
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();

    // Verify Overview & Finish
    expect(await checkoutOverviewPage.getItemCount()).toBe(6);
    await checkoutOverviewPage.finishCheckout();

    // Verify Confirmation
    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');
  });
});
