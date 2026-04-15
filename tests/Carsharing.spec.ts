import { login } from './login';
import { test, expect } from '@playwright/test';

test('Carsharing', async ({ page }) => {
  await login(page);
  await page.waitForTimeout(8000); 
  await page.getByRole('link', { name: 'car_rental Car sharing' }).first().click();
  await page.getByRole('button', { name: 'add Add Reservation' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Reservation' })).toBeVisible();
  await page.getByRole('button', { name: 'Search assets' }).click();
  await page.getByText('AA-00-13').click();
  await page.getByRole('button', { name: 'Save' }).click();
  console.log('Carsharing Reservation Created Successfully');

  await page.getByTitle('List view').click();
  await expect(page.getByRole('row', { name: 'Select item Description AA-00' })).toBeVisible();

  await page.getByRole('button', { name: 'delete', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
})