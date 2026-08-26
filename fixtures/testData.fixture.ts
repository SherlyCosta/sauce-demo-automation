import { test as baseTest } from './base.fixture';
import { USERS } from '../data/users';
import { PRODUCTS } from '../data/products';
import { CHECKOUT_DATA } from '../data/checkoutData';

type TestData = {
  usersData: typeof USERS;
  productsData: typeof PRODUCTS;
  checkoutTestData: typeof CHECKOUT_DATA;
};

export const testDataFixture = baseTest.extend<TestData>({
  usersData: async ({}, use) => {
    await use(USERS);
  },
  productsData: async ({}, use) => {
    await use(PRODUCTS);
  },
  checkoutTestData: async ({}, use) => {
    await use(CHECKOUT_DATA);
  },
});
