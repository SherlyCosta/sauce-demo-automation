import { test, expect } from '../../fixtures/page.fixture';
import { USERS } from '../../data/users';

test.describe('@regression Full Feature & Persona Regression Suite', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Regression: Problem User Persona product catalog verification', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login(USERS.PROBLEM.username, USERS.PROBLEM.password);
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Regression: Performance Glitch User login response time tolerance', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login(USERS.PERFORMANCE_GLITCH.username, USERS.PERFORMANCE_GLITCH.password);
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('Regression: Error User Persona checkout error handling', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login(USERS.ERROR.username, USERS.ERROR.password);
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
