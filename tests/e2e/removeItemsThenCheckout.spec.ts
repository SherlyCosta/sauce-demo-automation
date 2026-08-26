import { test, expect } from '../../fixtures/page.fixture';
import { PRODUCTS } from '../../data/products';
import { CustomAssertions } from '../../utils/assertions';

test.describe('E2E Flow 4: Remove Every Product and Attempt Checkout', () => {
  test('should prevent checkout and order placement after removing every product from cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.navigate();

    // 1. Add products to cart
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // 2. Navigate to cart and remove every product
    await inventoryPage.goToCart();
    await cartPage.removeAllItems();
    expect(await cartPage.getItemCount()).toBe(0);

    // Business Rule 8: Cart badge must disappear when cart becomes empty
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    // 3. Attempt checkout with empty cart
    await cartPage.proceedToCheckout();
    const currentUrl = await cartPage.getURL();
    const isCheckoutBlocked = currentUrl.includes('cart.html') && !currentUrl.includes('checkout-step-one.html');

    // Business Rule 1 & 9 QA Defect Report
    CustomAssertions.assertBusinessRule(isCheckoutBlocked, {
      bugTitle: 'Order Placement Allowed After Cart Cleared',
      module: 'E2E / Checkout Module',
      severity: 'Critical',
      expectedResult: 'After removing all items from cart, proceeding to checkout must be blocked and user kept on /cart.html.',
      actualResult: `Application permitted user to proceed to checkout after clearing cart: ${currentUrl}`,
      recommendation: 'Re-validate cart count on checkout button action and prevent navigation if cart item count is zero.',
    });
  });
});
