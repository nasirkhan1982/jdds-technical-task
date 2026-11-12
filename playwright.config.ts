import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { testEnvironment } from './src/config/test-environment';

const bddTestDir = defineBddConfig({
  features: 'tests/ui/features/**/*.feature',
  steps: 'tests/ui/**/*.steps.ts',
  outputDir: 'tests/ui/generated',
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 30_000,
  },
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'ui',
      testMatch: 'ui/**/*.ui.spec.ts',
      timeout: 120_000,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: testEnvironment.ui.baseUrl,
      },
    },
    {
      name: 'ui-bdd',
      testDir: bddTestDir,
      testMatch: '**/*.spec.js',
      timeout: 120_000,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: testEnvironment.ui.baseUrl,
      },
    },
    {
      name: 'api',
      testMatch: 'api/**/*.api.spec.ts',
      use: {
        baseURL: testEnvironment.api.baseUrl,
      },
    },
  ],
});
