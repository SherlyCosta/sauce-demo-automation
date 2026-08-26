import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('E2E Flow 2: Dynamic Multi-Item Purchase', () => {
  test.slow(); // Marks test as slow and triples the timeout limit

  test('should execute full dynamic flow: Add 5 -> Remove 3 -> Continue Shopping -> Add 1 -> Checkout -> Finish', async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.navigate();

    // 1. Add five products
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BOLT_TSHIRT.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.FLEECE_JACKET.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.ONESIE.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(5);

    // 2. Remove three products from inventory
    await inventoryPage.removeItemByName(PRODUCTS.BIKE_LIGHT.name);
    await inventoryPage.removeItemByName(PRODUCTS.BOLT_TSHIRT.name);
    await inventoryPage.removeItemByName(PRODUCTS.FLEECE_JACKET.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // 3. Open Cart & Continue Shopping
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);
    await cartPage.continueShopping();

    // 4. Add one product (Red T-Shirt)
    await inventoryPage.addItemToCartByName(PRODUCTS.RED_TSHIRT.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);

    // 5. Checkout
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(3);
    await cartPage.proceedToCheckout();

    // 6. Customer Information & Finish
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();
    await checkoutOverviewPage.finishCheckout();

    // 7. Verify Thank You
    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');
  });
});
