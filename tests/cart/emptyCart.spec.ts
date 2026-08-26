import { test, expect } from '../../fixtures/page.fixture';
import { CustomAssertions } from '../../utils/assertions';

test.describe('Empty Cart Business Rules Enforcement', () => {
  test('should display empty cart correctly with no items or badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.navigate();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('should prevent user from proceeding to checkout when cart is empty', async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(0);

    // Attempt checkout with empty cart
    await cartPage.proceedToCheckout();

    const currentUrl = await cartPage.getURL();
    const isNavigationBlocked = currentUrl.includes('cart.html') && !currentUrl.includes('checkout-step-one.html');

    // Business Rule 1 & 2 QA Defect Report
    CustomAssertions.assertBusinessRule(isNavigationBlocked, {
      bugTitle: 'Empty Cart Checkout Proceed Vulnerability',
      module: 'Cart Module',
      severity: 'High',
      expectedResult: 'User must remain on /cart.html and be blocked from navigating to checkout when cart is empty.',
      actualResult: `User was allowed to navigate to checkout step one: ${currentUrl}`,
      recommendation: 'Disable Checkout button when cart item count is 0 or display an inline validation banner.',
    });
  });

  test('should prevent direct URL navigation to Checkout Information page when cart is empty', async ({ checkoutInformationPage, cartPage }) => {
    // Attempt direct URL access to checkout step one without adding products
    await checkoutInformationPage.navigateTo('/checkout-step-one.html');
    const currentUrl = await cartPage.getURL();
    const isAccessBlocked = currentUrl.includes('cart.html') || currentUrl.includes('inventory.html');

    // Business Rule 3 QA Defect Report
    CustomAssertions.assertBusinessRule(isAccessBlocked, {
      bugTitle: 'Unrestricted Direct Access to Checkout Information Page With Empty Cart',
      module: 'Checkout Module',
      severity: 'High',
      expectedResult: 'Direct access to /checkout-step-one.html with an empty cart must be redirected to /cart.html.',
      actualResult: `Application permitted direct access to checkout page: ${currentUrl}`,
      recommendation: 'Implement route guard middleware checking cart item session count before rendering checkout step one.',
    });
  });

  test('should prevent direct URL navigation to Checkout Complete page when no products are purchased', async ({ checkoutCompletePage, inventoryPage }) => {
    // Attempt direct URL access to checkout complete page without purchasing products
    await checkoutCompletePage.navigateTo('/checkout-complete.html');
    const currentUrl = await inventoryPage.getURL();
    const isAccessBlocked = !currentUrl.includes('checkout-complete.html');

    // Business Rule 7 QA Defect Report
    CustomAssertions.assertBusinessRule(isAccessBlocked, {
      bugTitle: 'Unverified Access to Thank You / Order Complete Page Without Purchase',
      module: 'Checkout Module',
      severity: 'Critical',
      expectedResult: 'Order Complete page (/checkout-complete.html) must never be accessible without a valid completed transaction.',
      actualResult: `Application rendered Order Complete page directly: ${currentUrl}`,
      recommendation: 'Require a valid completed order transaction ID in session before granting access to /checkout-complete.html.',
    });
  });
});
