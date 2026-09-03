import { defineConfig, devices } from '@playwright/test';
import { CONSTANTS } from './data/constants';
import { ENVIRONMENTS } from './data/environments';


const selectedEnvironment = process.env.TEST_ENV || 'Staging';

const environmentConfig =
  ENVIRONMENTS[selectedEnvironment as keyof typeof ENVIRONMENTS];

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: environmentConfig.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    launchOptions: {
      slowMo: 1000,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: CONSTANTS.AUTH_FILE,
      },
    },
    // {
    //   name: 'firefox',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: CONSTANTS.AUTH_FILE,
    //   },
    // },
    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: CONSTANTS.AUTH_FILE,
    //   },
    // },
  ],
});
