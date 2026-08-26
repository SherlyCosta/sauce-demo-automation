import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';
import { PRODUCTS } from '../../data/products';
import { CustomAssertions } from '../../utils/assertions';

test.describe('Checkout Overview Tests', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInformationPage, checkoutOverviewPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('should verify items and quantities on checkout overview', async ({ checkoutOverviewPage }) => {
    const itemCount = await checkoutOverviewPage.getItemCount();
    expect(itemCount).toBe(2);

    const itemNames = await checkoutOverviewPage.getItemNames();
    expect(itemNames).toContain(PRODUCTS.BACKPACK.name);
    expect(itemNames).toContain(PRODUCTS.BIKE_LIGHT.name);
  });

  test('should verify subtotal, tax, and total price calculation accuracy', async ({ checkoutOverviewPage }) => {
    const expectedSubtotal = PRODUCTS.BACKPACK.price + PRODUCTS.BIKE_LIGHT.price; // 29.99 + 9.99 = 39.98
    const actualSubtotal = await checkoutOverviewPage.getSubtotal();
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

    const actualTax = await checkoutOverviewPage.getTax();
    expect(actualTax).toBeGreaterThan(0);

    const expectedTotal = Number((actualSubtotal + actualTax).toFixed(2));
    const actualTotal = await checkoutOverviewPage.getTotal();
    expect(actualTotal).toBe(expectedTotal);
  });

  test('should enforce that Checkout Overview never displays a $0 subtotal, tax, or total', async ({ checkoutOverviewPage }) => {
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();
    const isValidPriceOrder = subtotal > 0 && tax > 0 && total > 0;

    // Business Rule 5 QA Defect Report
    CustomAssertions.assertBusinessRule(isValidPriceOrder, {
      bugTitle: 'Zero-Dollar Order Placement Vulnerability',
      module: 'Checkout Module',
      severity: 'Critical',
      expectedResult: 'Checkout Overview must never display or process an order with Subtotal = $0, Tax = $0, Total = $0.',
      actualResult: `Order pricing calculated as Subtotal: $${subtotal}, Tax: $${tax}, Total: $${total}`,
      recommendation: 'Reject overview rendering and order completion if cart item value is $0.',
    });
  });

  test('should finish checkout and navigate to completion page', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
    await checkoutOverviewPage.finishCheckout();
    await expect(checkoutCompletePage.page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutCompletePage.title).toHaveText('Checkout: Complete!');
  });
});
