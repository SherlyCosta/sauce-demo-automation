import { test, expect } from '../../fixtures/page.fixture';
import { USERS } from '../../data/users';

test.describe('Positive Login Scenarios', () => {
  // Use unauthenticated context for login page tests
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should log in successfully with valid credentials and navigate to inventory', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
