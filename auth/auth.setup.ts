import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../data/users';
import { CONSTANTS } from '../data/constants';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  
  await expect(page).toHaveURL(/.*inventory.html/);
  await page.context().storageState({ path: CONSTANTS.AUTH_FILE });
});
