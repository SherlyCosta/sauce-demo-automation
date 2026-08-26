import { test, expect } from '../../fixtures/page.fixture';
import { CONSTANTS } from '../../data/constants';

test.describe('Logout Functionality', () => {
  test('should log out successfully via burger menu and prevent accessing protected pages', async ({ inventoryPage, burgerMenu, loginPage }) => {
    // Navigate to authenticated inventory page
    await inventoryPage.navigate();
    await expect(inventoryPage.title).toHaveText('Products');

    // Perform logout action via Burger Menu
    await burgerMenu.logout();

    // Verify redirection to Login Page
    await expect(loginPage.page).toHaveURL(CONSTANTS.BASE_URL + '/');
    expect(await loginPage.isErrorMessageVisible()).toBeFalsy();

    // Attempt direct navigation to protected inventory page after logout
    await inventoryPage.navigate();
    
    // Verify user is redirected back to login page with error message
    await expect(loginPage.page).toHaveURL(CONSTANTS.BASE_URL + '/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("You can only access '/inventory.html' when you are logged in.");
  });
});
