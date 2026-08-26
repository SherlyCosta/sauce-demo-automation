import { test, expect } from '../../fixtures/page.fixture';

test.describe('About Link Tests', () => {
  test('should verify About link target in burger menu', async ({ inventoryPage, burgerMenu }) => {
    await inventoryPage.navigate();
    await burgerMenu.openMenu();
    
    const aboutLink = burgerMenu.page.locator('[data-test="about-sidebar-link"]');
    await expect(aboutLink).toBeVisible();
    const href = await aboutLink.getAttribute('href');
    expect(href).toContain('saucelabs.com');
  });
});
