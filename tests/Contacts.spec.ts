import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import {generateUserName, generateAddress} from './testdata';

test('Contact Management', async ({ page }) => {
  const testdata = generateUserName()
  const updatedtestdata = generateUserName()
  const addressdata = generateAddress()
  const updatedaddressdata = generateAddress()
  await login(page)
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'build Admin' }).click();

  await page.getByRole('link', { name: 'contacts Contacts' }).click();
  await page.getByRole('button', { name: 'add Add Contact' }).click();

  await page.getByRole('button', { name: 'image' }).click();
  await expect(page.getByRole('dialog', { name: 'Select User' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').click();
  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').fill('Darshan');
  await page.waitForTimeout(3000);  
  await page.getByRole('checkbox', { name: 'Select item' }).nth(2).click();

  await page.getByLabel('Select User').getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(testdata.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).fill(testdata.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill(testdata.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).fill(testdata.email);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(testdata.phoneNumber);
  await page.getByRole('textbox', { name: 'Function' }).click();
  await page.getByRole('textbox', { name: 'Function' }).fill(testdata.function);
  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).fill(addressdata.number.toString());
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill(testdata.comment);
  await page.getByRole('checkbox', { name: 'Include Address' }).first().click();
  await expect(page.getByRole('checkbox', { name: 'Include Address check' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Street' }).click();
  await page.getByRole('textbox', { name: 'Street' }).fill(addressdata.street);
  await page.locator('#Number').first().click();
  await page.getByRole('textbox', { name: 'Enter number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter number' }).fill(addressdata.number.toString());
  await page.getByRole('textbox', { name: 'Postal code' }).click();
  await page.getByRole('textbox', { name: 'Postal code' }).fill('382330');
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).fill('Ahmedabad');
  await page.getByText('Netherlands').first().click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('ind');
  await page.getByText('India', { exact: true }).click();
  await page.waitForTimeout(3000)
  await page.getByRole('button', { name: 'Save' }).click();

  const AddContact = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddContact).toBeVisible();
  const AddContactMessage = (await AddContact.textContent())?.replace(/\s+/g, ' ').trim();

  //Edit Contact

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(testdata.email);
  await page.getByText(testdata.firstName).click();
  await expect(page.getByRole('dialog', { name: 'Edit Contact' })).toBeVisible();

  await page.getByRole('button', { name: 'image' }).click();
  await expect(page.getByRole('dialog', { name: 'Select User' })).toBeVisible();

  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').click();
  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').fill('meet');
  await expect(page.getByRole('row', { name: 'Select item Meet Suthar meet.' })).toBeVisible();

  await page.getByRole('checkbox', { name: 'Select item' }).first().click();
  await expect(page.getByRole('row', { name: 'Select item check Meet Suthar' })).toBeVisible();

  await page.getByLabel('Select User').getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'First name' }).fill(updatedtestdata.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Middle name' }).fill(updatedtestdata.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Last name' }).fill(updatedtestdata.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Mail address' }).fill(updatedtestdata.email);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(updatedtestdata.phoneNumber);
  await page.getByRole('textbox', { name: 'Function' }).click();
  await page.getByRole('textbox', { name: 'Function' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Function' }).fill(updatedtestdata.function);
  await page.getByRole('textbox', { name: 'Code', exact: true }).click();
  await page.getByRole('textbox', { name: 'Code', exact: true }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Code', exact: true }).fill(updatedaddressdata.number.toString());
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Comment' }).fill(updatedtestdata.comment);
  await page.getByRole('textbox', { name: 'Street' }).click();
  await page.getByRole('textbox', { name: 'Street' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Street' }).fill(updatedaddressdata.street);
  await page.getByRole('textbox', { name: 'Enter number' }).click();
  await page.getByRole('textbox', { name: 'Enter number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter number' }).fill(updatedaddressdata.number.toString());
  await page.getByRole('textbox', { name: 'Postal code' }).click();
  await page.getByRole('textbox', { name: 'Postal code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Postal code' }).fill('382330');
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'City' }).fill('Ahmedabad');
  await page.getByRole('button', { name: 'Save' }).click();

  const EditContact = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditContact).toBeVisible();
  const EditContactMessage = (await EditContact.textContent())?.replace(/\s+/g, ' ').trim();

  //Delete Contact
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(updatedtestdata.firstName);

  await page.getByRole('button', { name: 'delete' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  const DeleteContact = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteContact).toBeVisible();
  const DeleteContactMessage = (await DeleteContact.textContent())?.replace(/\s+/g, ' ').trim();


    console.table([
  {
    Action: 'Add Contact',
    Title: testdata.firstName,
    Status: 'Passed',
    Message: AddContactMessage
  },
  {
    Action: 'Edit Contact',
    Title: updatedtestdata.firstName,
    Status: 'Passed',
    Message: EditContactMessage
  },
  {
    Action: 'Delete Contact',
    Title: updatedtestdata.firstName,
    Status: 'Passed',
    Message: DeleteContactMessage
  },
  ]);
  });