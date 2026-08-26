import { test, expect } from '../../fixtures/page.fixture';
import { USERS } from '../../data/users';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('@smoke Critical Business Flows Suite', () => {
  test('@smoke Critical Flow 1: Single Product Checkout Flow', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    
    // Critical Flow: Just checking if buying 1 item works from start to finish!
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);

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

  test('@smoke Critical Flow 2: Multi-Item Purchase Flow', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {

    // Critical Flow: Just checking if buying 2 items works from start to finish!
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);
    await cartPage.proceedToCheckout();

    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();

    expect(await checkoutOverviewPage.getItemCount()).toBe(2);
    await checkoutOverviewPage.finishCheckout();

    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');
  });
});
