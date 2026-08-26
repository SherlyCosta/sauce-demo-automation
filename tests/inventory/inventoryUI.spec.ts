import { test, expect } from '../../fixtures/page.fixture';

test.describe('Inventory UI Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should load inventory page and verify header elements', async ({ inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });

  test('should render correct number of product cards', async ({ inventoryPage }) => {
    const itemCount = await inventoryPage.getItemCount();
    expect(itemCount).toBe(6);
  });

  test('should verify product card elements (title, description, price, image)', async ({ inventoryPage }) => {
    const names = await inventoryPage.getAllProductNames();
    const prices = await inventoryPage.getAllProductPrices();
    
    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);

    for (const name of names) {
      expect(name.length).toBeGreaterThan(0);
    }

    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('should verify all product images are displayed and loaded', async ({ inventoryPage }) => {
    const images = inventoryPage.page.locator('.inventory_item_img img');
    const imageCount = await images.count();
    expect(imageCount).toBe(6);

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src?.length).toBeGreaterThan(0);
    }
  });
});
