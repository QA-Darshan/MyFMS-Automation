import { expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export type LoginOptions = {
  url?: string;
  username?: string;
  password?: string;
  successSelector?: string;
};

export async function login(page: Page, options: LoginOptions = {}): Promise<void> {
  const {
    url = process.env.LOGIN_URL,
    username = process.env.LOGIN_USERNAME,
    password = process.env.LOGIN_PASSWORD,
    successSelector,
  } = options;

  if (!url) {
    throw new Error('Login URL is missing. Set LOGIN_URL or pass options.url.');
  }
  if (!username) {
    throw new Error('Login username is missing. Set LOGIN_USERNAME or pass options.username.');
  }
  if (!password) {
    throw new Error('Login password is missing. Set LOGIN_PASSWORD or pass options.password.');
  }

  await page.goto(url);
  const usernameInput = page
    .locator('input[name="username"], input[type="email"], input[placeholder*="email" i]')
    .first();
  await expect(usernameInput).toBeVisible({ timeout: 10000 });
  await usernameInput.fill(username);

  const nextButton = page.getByRole('button', { name: /^next$/i }).first();
  if (await nextButton.isVisible().catch(() => false)) {
    await nextButton.click();
  }

  const passwordInput = page
    .locator('input[name="password"], input[type="password"], input[placeholder*="password" i]')
    .first();
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  await passwordInput.fill(password);

  const loginButton = page
    .locator('button:has-text("Login"), button:has-text("Sign in"), button[type="submit"]')
    .first();
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  await loginButton.click();

  if (successSelector) {
    await expect(page.locator(successSelector)).toBeVisible();
  }
}