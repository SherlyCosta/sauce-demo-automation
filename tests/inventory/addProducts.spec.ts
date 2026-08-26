import { test, expect } from '../../fixtures/page.fixture';

test.describe('Add Products to Cart Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should add one product to cart and verify button state change', async ({ inventoryPage }) => {
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addItemToCartByName(productName);
    
    // Verify cart badge count is 1
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Verify button text changed to Remove
    const removeButton = inventoryPage.page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText('Remove');
  });

  test('should add multiple products to cart and update cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('should add all products to cart and update cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addAllItemsToCart();
    const totalItems = await inventoryPage.getItemCount();
    expect(await inventoryPage.getCartBadgeCount()).toBe(totalItems);
  });
});
