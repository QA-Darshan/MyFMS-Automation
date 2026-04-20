import { login } from './login';
import { test, expect } from '@playwright/test';
import {generateAddress, generateUserName, buildTestDataTable, buildTestDataTable1} from './testdata';

test('test', async ({ page }) => {
  const user = generateUserName();
  const user1 = generateUserName();
  const address = generateAddress();
  const address1 = generateAddress();

  const testData = {
  'Client Name': user.firstName, 'Email': user.email, 'Billing Code': user.billingcode, 'Phone': user.phoneNumber, 'First Name': user.firstName, 'Middle Name': user.middleName, 'Last Name': user.lastName, 'Street': address.street, 'Postal Code': address.Postalcode, 'City': address.city, 'Country': address.country || 'India', };

  console.log('--- ADD CLIENT DATA ---');
  const testDataTable = buildTestDataTable(testData);
  console.log(testDataTable);

  const editClientData = {
  'Client Name': user1.firstName,
  'Email': user1.email,
  'Billing Code': user1.billingcode,
  'Phone': user1.phoneNumber,
  'Street': address1.street,
  'Postal Code': address1.Postalcode,
  'City': address1.city,
  'Country': address1.country || 'India',
};

console.log('--- EDIT CLIENT DATA ---');
const testDataTable1 = buildTestDataTable(testData);
console.log(buildTestDataTable(editClientData));

  await login(page);  
  await page.getByRole('link', { name: 'manage_accounts Clients' }).click();
//  await expect(page.getByRole('row', { name: 'A test client image Client 1212121212112 121212 Brazil Basic No 0 circle New' })).toBeVisible();

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
  await page.getByRole('textbox', { name: 'Enter number' }).first().fill(String(address.number));
  await page.getByRole('textbox', { name: 'Postal code' }).first().click();
  await page.getByRole('textbox', { name: 'Postal code' }).first().fill(address.Postalcode);
  await page.getByRole('textbox', { name: 'City' }).first().click();  
  await page.getByRole('textbox', { name: 'City' }).first().fill(address.city);
  await page.getByText('Netherlands').first().click();
  await page.getByRole('textbox', { name: 'Search' }).fill(address.country);
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(user.firstName);
  await page.getByText(user.firstName).click();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(user1.firstName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Mail address' }).fill(user1.email);
  await page.getByRole('textbox', { name: 'Billing Code' }).click();
  await page.getByRole('textbox', { name: 'Billing code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Billing code' }).fill(user1.billingcode);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(user1.phoneNumber);
  await page.locator('input[name="VisitAddress.Street"]').click();
  await page.locator('input[name="VisitAddress.Street"]').press('ControlOrMeta+a');
  await page.locator('input[name="VisitAddress.Street"]').fill(address1.street);
  await page.getByRole('textbox', { name: 'Enter number' }).first().click();
  await page.getByRole('textbox', { name: 'Enter number' }).first().press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter number' }).first().fill(String(address1.number));
  await page.getByRole('textbox', { name: 'Postal code' }).first().click();
  await page.getByRole('textbox', { name: 'Postal code' }).first().press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Postal code' }).first().fill(address1.Postalcode);
  await page.getByRole('textbox', { name: 'City' }).first().click();
  await page.getByRole('textbox', { name: 'City' }).first().press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'City' }).first().fill(address1.city);
  await page.getByText('India').first().click();
  await page.getByRole('textbox', { name: 'Search' }).fill(address.country);
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(user1.firstName);
  await page.getByText(user1.firstName).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Impersonate' }).click();
  await expect(page.getByRole('complementary', { name: 'Impersonate' })).toBeVisible();
});