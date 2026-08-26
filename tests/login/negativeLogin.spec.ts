import { test, expect } from '../../fixtures/page.fixture';
import { USERS } from '../../data/users';

test.describe('Negative Login Scenarios', () => {
  // Use unauthenticated browser context
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should show error for invalid username', async ({ loginPage }) => {
    await loginPage.login('invalid_username', USERS.STANDARD.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('should show error for invalid password', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, 'invalid_password');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('should show error for invalid username and password', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'invalid_pass');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Sorry, this user has been locked out.');
  });

  test('should show validation error when username is empty', async ({ loginPage }) => {
    await loginPage.enterPassword(USERS.STANDARD.password);
    await loginPage.clickLogin();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('should show validation error when password is empty', async ({ loginPage }) => {
    await loginPage.enterUsername(USERS.STANDARD.username);
    await loginPage.clickLogin();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });

  test('should show validation error when both username and password are empty', async ({ loginPage }) => {
    await loginPage.clickLogin();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('should show error when username has leading/trailing spaces', async ({ loginPage }) => {
    await loginPage.login(` ${USERS.STANDARD.username} `, USERS.STANDARD.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('should show error when password has leading/trailing spaces', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, ` ${USERS.STANDARD.password} `);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });
});
