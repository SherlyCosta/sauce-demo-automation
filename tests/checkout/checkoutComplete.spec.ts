import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';
import { PRODUCTS } from '../../data/products';

test.describe('Checkout Complete Tests', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
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
    await expect(checkoutCompletePage.page).toHaveURL(/.*checkout-complete.html/);
  });

  test('should display order completion header and confirmation text', async ({ checkoutCompletePage }) => {
    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');

    const text = await checkoutCompletePage.getCompleteText();
    expect(text).toContain('Your order has been dispatched');
  });

  test('should display Pony Express dispatch image', async ({ checkoutCompletePage }) => {
    const ponyImage = checkoutCompletePage.page.locator('.pony_express');
    await expect(ponyImage).toBeVisible();
    const src = await ponyImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('should navigate back to inventory page when Back Home button is clicked', async ({ checkoutCompletePage, inventoryPage }) => {
    await checkoutCompletePage.backHome();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
