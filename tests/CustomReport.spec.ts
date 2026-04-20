import { test, expect } from '@playwright/test';
import { login } from './login';
import { generateFormData } from './testdata'

test('test', async ({ page }) => {
await login(page);
 const data = generateFormData();
 const data1 = generateFormData();
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'insert_drive_file Custom' }).click();
  await expect(page.getByRole('row', { name: 'all Data 1 22 Yes delete' })).toBeVisible();

  await page.getByRole('button', { name: 'add Add Custom reports' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Custom Report' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('tabpanel', { name: 'Events' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter title' }).click();
  await page.getByRole('textbox', { name: 'Enter title' }).fill(data1.title);
  await page.getByText('Select Start Event').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('listbox').getByText('Location Reply').click();

  await page.getByText('Select Stop Event').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('listbox').getByText('Historical Reply').click();
  await page.getByRole('button', { name: 'Save' }).click();
});