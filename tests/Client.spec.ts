import { login } from './login';
import { test, expect } from '@playwright/test';
import {generateAddress, generateUserName, buildTestDataTable} from './testdata';

test('test', async ({ page }) => {
  const user = generateUserName();
  const address = generateAddress();

  const testData = {
  'Client Name': user.firstName,
  'Email': user.email,
  'Billing Code': user.billingcode,
  'Phone': user.phoneNumber,
  'First Name': user.firstName,
  'Middle Name': user.middleName,
  'Last Name': user.lastName,
  'Street': address.street,
  'Postal Code': address.postalCode,
  'City': address.city,
  'Country': address.country || 'India',
};

const testDataTable = buildTestDataTable(testData);
console.log(testDataTable);

  await login(page);  
  await page.getByRole('link', { name: 'manage_accounts Clients' }).click();
  await expect(page.getByRole('row', { name: 'A test client image Client 1212121212112 121212 Brazil Basic No 0 circle New' })).toBeVisible();

  await page.getByRole('button', { name: 'add Add Clients' }).click();
  await expect(page.getByRole('heading', { name: 'Add Client' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(user.firstName);
  await page.getByRole('textbox', { name: 'Mail address' }).first().click();
  await page.getByRole('textbox', { name: 'Mail address' }).first().fill(user.email);
  await page.getByRole('textbox', { name: 'Mail address' }).first().press('Tab');
  await page.getByRole('textbox', { name: 'Billing Code' }).click();
  await page.getByRole('textbox', { name: 'Billing Code' }).fill(user.billingcode);
  await page.getByRole('textbox', { name: 'Telephone number' }).first().click();
  await page.getByRole('textbox', { name: 'Telephone number' }).first().fill(user.phoneNumber);
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).fill(user.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Mail address' }).nth(1).fill(user.email);
  await page.locator('input[name="VisitAddress.Street"]').click();
  await page.locator('input[name="VisitAddress.Street"]').fill(address.street);
  await page.getByRole('textbox', { name: 'Enter number' }).first().click();
  await page.getByRole('textbox', { name: 'Enter number' }).first().fill('01');
  await page.getByRole('textbox', { name: 'Postal code' }).first().click();
  await page.getByRole('textbox', { name: 'Postal code' }).first().fill(address.postalCode);
  await page.getByRole('textbox', { name: 'City' }).first().click();  
  await page.getByRole('textbox', { name: 'City' }).first().fill(address.city);
  await page.getByText('Netherlands').first().click();
  await page.getByRole('textbox', { name: 'Search' }).fill(address.country);
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
});