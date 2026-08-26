import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BurgerMenu extends BasePage {
  private readonly menuButton: Locator;
  private readonly closeButton: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
    await this.waitForElementVisible(this.closeButton);
  }

  async closeMenu(): Promise<void> {
    await this.click(this.closeButton);
  }

  async clickAllItems(): Promise<void> {
    await this.openMenu();
    await this.click(this.allItemsLink);
  }

  async clickAbout(): Promise<void> {
    await this.openMenu();
    await this.click(this.aboutLink);
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.click(this.logoutLink);
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.click(this.resetAppStateLink);
  }
}
