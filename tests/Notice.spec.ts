import { test, expect } from '@playwright/test';
import { login } from './login';

test('test', async ({ page }) => {
  await login(page);
  await page.waitForTimeout(12000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'add_alert Notices' }).click();
  await page.getByRole('button', { name: 'add Add Notice' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Notice' })).toBeVisible();
  
  const dutchSection = page.locator('div').filter({ hasText: 'Dutch' });
  await dutchSection.getByRole('textbox', { name: 'Enter title' }).click();
  await dutchSection.getByRole('textbox', { name: 'Enter title' }).fill('Test');
  await dutchSection.getByRole('textbox', { name: 'Enter message' }).click();
  await dutchSection.getByRole('textbox', { name: 'Enter message' }).fill('Test');
  await page.getByRole('button', { name: 'keyboard_arrow_down' }).nth(1).click();

  await page.locator("//div[@id='PmrxdYd3Ak']//input[@id='Headline']").fill('Test1');;
//   await page.getByRole('textbox', { name: 'Enter title' }).fill('Test');
//   await page.getByRole('textbox', { name: 'Enter message' }).first().click();
//   await page.getByRole('textbox', { name: 'Enter message' }).first().fill('Test');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
});