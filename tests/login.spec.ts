import { test } from '@playwright/test';
import { login } from './login';

test('login with environment credentials', async ({ page }) => {
  await login(page);
});
