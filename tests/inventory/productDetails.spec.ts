import { test, expect } from '../../fixtures/page.fixture';

test.describe('Product Details Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should open product details page and verify item attributes', async ({ inventoryPage, productDetailsPage }) => {
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.clickProductByName(productName);

    await expect(productDetailsPage.page).toHaveURL(/.*inventory-item.html/);
    const detailName = await productDetailsPage.getProductName();
    expect(detailName).toBe(productName);

    const price = await productDetailsPage.getProductPrice();
    expect(price).toBeGreaterThan(0);

    const description = await productDetailsPage.getProductDescription();
    expect(description.length).toBeGreaterThan(0);
  });

  test('should navigate back to inventory page via Back to Products button', async ({ inventoryPage, productDetailsPage }) => {
    await inventoryPage.clickProductByName('Sauce Labs Bike Light');
    await productDetailsPage.backToProducts();

    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
