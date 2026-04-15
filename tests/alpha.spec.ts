// import { login } from './login';
// import { test, expect} from '@playwright/test';
// import {generateUserName} from './testdata';
// import {generateAddress} from './testdata';

// test('Add Contact', async ({ page }) => {
//   const user = generateUserName();
//   const address = generateAddress();
//   const user1 = generateUserName();
//   const address1 = generateAddress();
//   await login(page);  
//   await page.waitForTimeout(12000);
//   await page.getByText('Admin').click();
//   await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

//   await page.getByRole('link', { name: 'contacts Contacts' }).click();
// //  await expect(page.getByRole('row', { name: 'Allan c Cristian 98202200' })).toBeVisible();

//   await page.getByRole('button', { name: 'add Add Contact' }).click();
//   await expect(page.getByRole('complementary', { name: 'Add Contact' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'First name' }).click();
//   await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
//   await page.getByRole('textbox', { name: 'Middle name' }).click();
//   await page.getByRole('textbox', { name: 'Middle name' }).fill(user.middleName);
//   await page.getByRole('textbox', { name: 'Last name' }).click();
//   await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
//   await page.getByRole('textbox', { name: 'Mail address' }).click();
//   await page.getByRole('textbox', { name: 'Mail address' }).fill(user.email);
//   await page.getByRole('textbox', { name: 'Mail address' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Telephone number' }).fill(user.phoneNumber);
//   await page.getByRole('textbox', { name: 'Function' }).click();
//   await page.getByRole('textbox', { name: 'Function' }).fill('QA');
//   await page.getByRole('textbox', { name: 'Code' }).click();
//   await page.getByRole('textbox', { name: 'Code' }).fill(address.number.toString());
//   await page.getByRole('textbox', { name: 'Comment' }).click();
//   await page.getByRole('textbox', { name: 'Comment' }).fill('Test');
//   await page.locator('.rz-chkbox-box').click();
//   await expect(page.getByRole('textbox', { name: 'Enter number' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'Street' }).click();
//   await page.getByRole('textbox', { name: 'Street' }).fill(address.street);
//   await page.getByRole('textbox', { name: 'Enter number' }).click();
//   await page.getByRole('textbox', { name: 'Enter number' }).fill(address.number.toString());
//   await page.getByRole('textbox', { name: 'Postal code' }).click();
//   await page.getByRole('textbox', { name: 'Postal code' }).fill(address.postalCode);
//   await page.getByRole('textbox', { name: 'City' }).click();
//   await page.getByRole('textbox', { name: 'City' }).fill(address.city);
//   await page.getByText('Netherlands').first().click();
//   await page.getByRole('textbox', { name: 'Search', exact: true }).click();
//   await page.getByRole('textbox', { name: 'Search', exact: true }).fill('india');
//   await page.getByRole('option', { name: 'India', exact: true }).click();
//   await page.getByRole('button', { name: 'Save' }).click();
//   console.log({email: user.email, message: 'Contact Created Successfully'});

//   //Search
//   await page.getByRole('textbox', { name: 'Search...' }).click();
//   await page.getByRole('textbox', { name: 'Search...' }).fill(user.email);

//   //Edit Contact
//   await page.getByText(user.firstName).click();
//   await expect(page.getByRole('complementary', { name: 'Edit Contact' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'First name' }).click();
//   await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
//   await page.getByRole('textbox', { name: 'First name' }).fill(user1.firstName);
//   await page.getByRole('textbox', { name: 'Middle name' }).click();
//   await page.getByRole('textbox', { name: 'Middle name' }).press('ControlOrMeta+a');
//   await page.getByRole('textbox', { name: 'Middle name' }).fill(user1.middleName);
//   await page.getByRole('textbox', { name: 'Last name' }).click();
//   await page.getByRole('textbox', { name: 'Last name' }).fill(user1.lastName);
//   await page.getByRole('textbox', { name: 'Mail address' }).click();
//   await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
//   await page.getByRole('textbox', { name: 'Mail address' }).fill(user1.email);
//   await page.getByRole('textbox', { name: 'Mail address' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Telephone number' }).fill(user1.phoneNumber);
//   await page.getByRole('textbox', { name: 'Function' }).click();
//   await page.getByRole('textbox', { name: 'Function' }).fill('QA1');
//   await page.locator('//input[@id="Code"]').fill(address1.number.toString());
//   await page.getByRole('textbox', { name: 'Comment' }).click();
//   await page.getByRole('textbox', { name: 'Comment' }).fill('Test');
//   await expect(page.getByRole('textbox', { name: 'Enter number' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'Street' }).click();
//   await page.getByRole('textbox', { name: 'Street' }).fill(address1.street);
//   await page.getByRole('textbox', { name: 'Enter number' }).click();
//   await page.getByRole('textbox', { name: 'Enter number' }).fill(address1.number.toString());
//   await page.getByRole('textbox', { name: 'Postal code' }).click();
//   await page.getByRole('textbox', { name: 'Postal code' }).fill(address1.postalCode);
//   await page.getByRole('textbox', { name: 'City' }).click();
//   await page.getByRole('textbox', { name: 'City' }).fill(address1.city);
//   await page.getByText('Netherlands').first().click();
//   await page.getByRole('textbox', { name: 'Search', exact: true }).click();
//   await page.getByRole('textbox', { name: 'Search', exact: true }).fill('india');
//   await page.getByRole('option', { name: 'India', exact: true }).click();
//   await page.getByRole('button', { name: 'Save' }).click();
//   console.log({email: user1.email, message: 'Contact Updated Successfully'});

//   //Delete Contact
//   await page.getByRole('textbox', { name: 'Search...' }).click();
//   await page.getByRole('textbox', { name: 'Search...' }).fill(user1.email);
//   const row = page.getByRole('row', { name: user1.email });
//   await expect(row).toBeVisible();  
//   await row.getByRole('button', { name: 'delete' }).click();
//   await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
//   await page.getByRole('button', { name: 'Delete', exact: true }).click();
//   console.log({email: user1.email, message: 'Contact Deleted Successfully'})



// import { login } from './login';
// import { test, expect } from '@playwright/test';
// import {generateUserName} from './testdata';
// import {generateAddress} from './testdata';

// test('Add User', async ({ page }) => {
//   const user = generateUserName();
//   const user1 = generateUserName();
//   const address = generateAddress();

//   await login(page);  
//   await page.waitForTimeout(18000);
//   await page.getByText('Admin').click();
//   await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

//   await page.getByRole('link', { name: 'account_circle Users' }).click();

//   await page.getByRole('button', { name: 'add Add user' }).click(); 
//   await expect(page.getByRole('complementary', { name: 'Add user' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'First name' }).click();
//   await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
//   await page.getByRole('textbox', { name: 'Middle name' }).click();
//   await page.getByRole('textbox', { name: 'Middle name' }).fill(user.middleName);
//   await page.getByRole('textbox', { name: 'Last name' }).click();
//   await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
//   await page.getByRole('textbox', { name: 'Mail address' }).click();
//   await page.getByRole('textbox', { name: 'Mail address' }).fill(user.email);
//   await page.getByRole('textbox', { name: 'Employee number' }).click();
//   await page.getByRole('textbox', { name: 'Employee number' }).fill(user.employeeNumber);
//   await page.getByRole('textbox', { name: 'Telephone number' }).click();
//   await page.getByRole('textbox', { name: 'Telephone number' }).fill(user.phoneNumber);

//   await page.getByRole('textbox', { name: 'Street' }).fill(address.street);
//   await page.getByRole('textbox', { name: 'Enter number' }).click();
//   await page.getByRole('textbox', { name: 'Enter number' }).fill(address.number.toString());
//   await page.getByRole('textbox', { name: 'Postal code' }).click();
//   await page.getByRole('textbox', { name: 'Postal code' }).fill(address.postalCode);
//   await page.getByRole('textbox', { name: 'City' }).click();
//   await page.getByRole('textbox', { name: 'City' }).fill(address.city);
//   await page.getByText('Netherlands').first().click();
//   await page.getByRole('textbox', { name: 'Search', exact: true }).fill('ind');
//   await page.getByRole('option', { name: 'India', exact: true }).click();
//   await page.getByRole('button', { name: 'Save' }).click();
//   await page.getByText('Select role').click();
//   await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

//   await page.getByRole('option', { name: 'Standard user' }).click();
//   await page.waitForTimeout(2000);
//   await page.getByRole('button', { name: 'Save' }).click();
//   console.log({email: user.email, message: 'User Created Successfully' });
//   await page.getByRole('textbox', { name: 'Search...' }).click();
//   await page.getByRole('textbox', { name: 'Search...' }).fill(user.email);

//   await page.getByText(user.email).click();
//   await expect(page.getByRole('complementary', { name: 'Edit user' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'First name' }).click();
//   await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
//   await page.getByRole('textbox', { name: 'First name' }).fill(user1.firstName);
//   await page.getByRole('textbox', { name: 'Mail address' }).click();
//   await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
//   await page.getByRole('textbox', { name: 'Mail address' }).fill(user1.email);
//   await page.getByRole('textbox', { name: 'Employee number' }).click();
//   await page.getByRole('textbox', { name: 'Employee number' }).fill(user1.employeeNumber);
//   await page.getByRole('textbox', { name: 'Telephone number' }).click();
//   await page.getByRole('textbox', { name: 'Telephone number' }).fill(user1.phoneNumber);
//   await page.getByRole('button', { name: 'Save' }).click();
//   await page.waitForTimeout(5000);
//   console.log({email: user1.email, message: 'User Edited Successfully'});

//   await page.getByRole('textbox', { name: 'Search...' }).click();
//   await page.getByRole('textbox', { name: 'Search...' }).fill(user1.email);

//   await page.getByRole('button', { name: 'delete' }).click();
//   await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

//   await page.getByRole('button', { name: 'Delete', exact: true }).click();
//   console.log({email: user1.email, message: 'User Deleted Successfully' });
//   });