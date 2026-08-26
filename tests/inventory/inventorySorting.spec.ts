import { test, expect } from '../../fixtures/page.fixture';
import { CommonMethods } from '../../utils/commonMethods';

test.describe('Inventory Sorting Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should sort products by Name A-Z by default', async ({ inventoryPage }) => {
    const names = await inventoryPage.getAllProductNames();
    expect(CommonMethods.isSortedAscending(names)).toBeTruthy();
  });

  test('should sort products by Name Z-A when selected', async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption('za');
    const names = await inventoryPage.getAllProductNames();
    expect(CommonMethods.isSortedDescending(names)).toBeTruthy();
  });

  test('should sort products by Price Low-High when selected', async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    expect(CommonMethods.isNumericSortedLowToHigh(prices)).toBeTruthy();
  });

  test('should sort products by Price High-Low when selected', async ({ inventoryPage }) => {
    await inventoryPage.selectSortOption('hilo');
    const prices = await inventoryPage.getAllProductPrices();
    expect(CommonMethods.isNumericSortedHighToLow(prices)).toBeTruthy();
  });
});
