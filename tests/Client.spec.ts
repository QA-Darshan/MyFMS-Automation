import { login } from './login';
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.getByRole('link', { name: 'manage_accounts Clients' }).click();
  await expect(page.getByRole('row', { name: 'A test client image Client 1212121212112 121212 Brazil Basic No 0 circle New' })).toBeVisible();

  await page.getByRole('button', { name: 'add Add Clients' }).click();
  await expect(page.getByRole('heading', { name: 'Add Client' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Test');
  await page.getByRole('textbox', { name: 'Mail address' }).first().click();
  await page.getByRole('textbox', { name: 'Mail address' }).first().fill('test655@yopmail.com');
  await page.getByRole('textbox', { name: 'Mail address' }).first().press('Tab');
  await page.getByRole('textbox', { name: 'Billing Code' }).click();
  await page.getByRole('textbox', { name: 'Billing Code' }).fill('BILLING245');
  await page.getByRole('textbox', { name: 'Telephone number' }).first().click();
  await page.getByRole('textbox', { name: 'Telephone number' }).first().fill('123456789');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).fill('B');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Mail address' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Mail address' }).nth(1).fill('Test887978@yopmail.com');
  await page.locator('input[name="VisitAddress.Street"]').click();
  await page.locator('input[name="VisitAddress.Street"]').fill('Haridarshan cross road');
  await page.getByRole('textbox', { name: 'Enter number' }).first().click();
  await page.getByRole('textbox', { name: 'Enter number' }).first().fill('01');
  await page.getByRole('textbox', { name: 'Postal code' }).first().click();
  await page.getByRole('textbox', { name: 'Postal code' }).first().fill('382330');
  await page.locator('#lksoVLbOkk').getByRole('textbox', { name: 'City' }).click();
  await page.locator('#lksoVLbOkk').getByRole('textbox', { name: 'City' }).fill('Ahmedabad');
  await page.getByText('Netherlands').first().click();
  await page.getByRole('textbox', { name: 'Search' }).fill('india');
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('row', { name: 'A test client image Client 1212121212112 121212 Brazil Basic Yes 2 circle Active' })).toBeVisible();
});