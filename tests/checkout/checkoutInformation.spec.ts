import { test, expect } from '../../fixtures/page.fixture';
import { CHECKOUT_DATA } from '../../data/checkoutData';
import { PRODUCTS } from '../../data/products';

test.describe('Checkout Information Form Input Tests', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutInformationPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(checkoutInformationPage.page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('should accept valid customer information and proceed to overview', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
  });

  test('should accept long text inputs for checkout fields', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.LONG_VALUES.firstName,
      CHECKOUT_DATA.LONG_VALUES.lastName,
      CHECKOUT_DATA.LONG_VALUES.postalCode
    );
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('should accept numeric inputs for names and zip code', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.NUMERIC_VALUES.firstName,
      CHECKOUT_DATA.NUMERIC_VALUES.lastName,
      CHECKOUT_DATA.NUMERIC_VALUES.postalCode
    );
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('should accept alphanumeric inputs', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.ALPHANUMERIC_VALUES.firstName,
      CHECKOUT_DATA.ALPHANUMERIC_VALUES.lastName,
      CHECKOUT_DATA.ALPHANUMERIC_VALUES.postalCode
    );
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('should accept special characters in checkout fields', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    await checkoutInformationPage.fillInformation(
      CHECKOUT_DATA.SPECIAL_CHARACTERS.firstName,
      CHECKOUT_DATA.SPECIAL_CHARACTERS.lastName,
      CHECKOUT_DATA.SPECIAL_CHARACTERS.postalCode
    );
    await checkoutInformationPage.continue();

    await expect(checkoutOverviewPage.page).toHaveURL(/.*checkout-step-two.html/);
  });
});
