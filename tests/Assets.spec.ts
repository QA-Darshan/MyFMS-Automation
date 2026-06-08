import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import {  } from './testdata';

test.describe.serial('@regression Assets', () => {
  test.beforeEach(async ({ page }) => {
  await login(page);
  await page.waitForTimeout(10000);
  
  })
})