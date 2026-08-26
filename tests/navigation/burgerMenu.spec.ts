import { test, expect } from '../../fixtures/page.fixture';
import { CONSTANTS } from '../../data/constants';

test.describe('Burger Menu Interactions', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('should open and close the burger menu sidebar', async ({ burgerMenu }) => {
    await burgerMenu.openMenu();
    await expect(burgerMenu.page.locator('.bm-menu-wrap')).toBeVisible();

    await burgerMenu.closeMenu();
    await expect(burgerMenu.page.locator('.bm-menu-wrap')).toBeHidden();
  });

  test('should navigate to all items inventory page from burger menu', async ({ burgerMenu, inventoryPage }) => {
    await burgerMenu.clickAllItems();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });

  test('should log out via burger menu link', async ({ burgerMenu, loginPage }) => {
    await burgerMenu.logout();
    await expect(loginPage.page).toHaveURL(CONSTANTS.BASE_URL + '/');
  });
});
