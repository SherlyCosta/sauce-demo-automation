import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('Complete End-to-End Purchase Flow', () => {
  test.slow(); // Marks test as slow and triples the timeout limit

  test('should execute full end-to-end user checkout journey successfully', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.FLEECE_JACKET.name);

    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.finishCheckout();
    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');
  });
});
