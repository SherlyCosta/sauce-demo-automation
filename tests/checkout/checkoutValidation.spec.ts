import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';
import { PRODUCTS } from '../../data/products';

test.describe('Checkout Information Validation Errors', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('should show validation error when all checkout fields are empty', async ({ checkoutInformationPage }) => {
    await checkoutInformationPage.continue();
    const error = await checkoutInformationPage.getErrorMessage();
    expect(error).toContain('Error: First Name is required');
  });

  test('should show validation error when First Name is empty', async ({ checkoutInformationPage }) => {
    await checkoutInformationPage.enterLastName(CHECKOUT_DATA.VALID.lastName);
    await checkoutInformationPage.enterPostalCode(CHECKOUT_DATA.VALID.postalCode);
    await checkoutInformationPage.continue();

    const error = await checkoutInformationPage.getErrorMessage();
    expect(error).toContain('Error: First Name is required');
  });

  test('should show validation error when Last Name is empty', async ({ checkoutInformationPage }) => {
    await checkoutInformationPage.enterFirstName(CHECKOUT_DATA.VALID.firstName);
    await checkoutInformationPage.enterPostalCode(CHECKOUT_DATA.VALID.postalCode);
    await checkoutInformationPage.continue();

    const error = await checkoutInformationPage.getErrorMessage();
    expect(error).toContain('Error: Last Name is required');
  });

  test('should show validation error when Postal Code is empty', async ({ checkoutInformationPage }) => {
    await checkoutInformationPage.enterFirstName(CHECKOUT_DATA.VALID.firstName);
    await checkoutInformationPage.enterLastName(CHECKOUT_DATA.VALID.lastName);
    await checkoutInformationPage.continue();

    const error = await checkoutInformationPage.getErrorMessage();
    expect(error).toContain('Error: Postal Code is required');
  });
});
