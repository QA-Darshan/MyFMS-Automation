import { login } from './login';
import { test, expect } from '@playwright/test';
import {generateAddress, generateUserName} from './testdata';

test('Users Management', async ({ page }) => {
  const reportTable: any[] = [];
  const testdata = generateAddress()
  const updatedtestdata = generateAddress()
  const Userdata = generateUserName();
  const Updateduserdata = generateUserName()
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'build Admin' }).click();

  await page.getByRole('link', { name: 'account_circle Users' }).click();

  //Add User Group
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(testdata.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(testdata.description);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('option', { name: testdata.title })).toBeVisible();

  const AddUserGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const addusergroupmessage = (await AddUserGroup.textContent())  ?.replace(/\s+/g, ' ').trim();

  //Edit User Group
  await page.getByLabel(testdata.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'edit Edit' }).click();
  await expect(page.getByRole('dialog', { name: testdata.title })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedtestdata.title);
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(updatedtestdata.description);
  await page.getByRole('button', { name: 'Save' }).click();

  const EditUserGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const editusergroupmessage = (await EditUserGroup.textContent())  ?.replace(/\s+/g, ' ').trim();

  await page.getByRole('heading', { name: updatedtestdata.title }).click();

  //Add User
  await page.getByRole('button', { name: 'add Add user' }).click();

  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(Userdata.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).fill(Userdata.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill(Userdata.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).fill(Userdata.email);
  await page.getByRole('textbox', { name: 'Employee number' }).click();
  await page.getByRole('textbox', { name: 'Employee number' }).fill(Userdata.employeeNumber);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(Userdata.phoneNumber);
  await page.getByRole('textbox', { name: 'Street' }).click();
  await page.getByRole('textbox', { name: 'Street' }).fill(testdata.street);
  await page.getByRole('textbox', { name: 'Street' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter number' }).click();
  await page.getByRole('textbox', { name: 'Enter number' }).fill(testdata.number.toString());
  await page.getByRole('textbox', { name: 'Postal code' }).click();
  await page.getByRole('textbox', { name: 'Postal code' }).fill(testdata.Postalcode);
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).fill(testdata.city);
  
  await page.getByText('Select role').click();
  // await page.waitForTimeout(2000);
  await page.getByLabel('Administrator', { exact: true }).getByText('Administrator').click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);
  
  const AddUser = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const AddUsermessage = (await AddUser.textContent())  ?.replace(/\s+/g, ' ').trim();

  //Edit User

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(Userdata.firstName);
 
  await page.getByText(Userdata.firstName).click();

  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'First name' }).fill(Updateduserdata.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Middle name' }).fill(Updateduserdata.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Last name' }).fill(Updateduserdata.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Mail address' }).fill(Updateduserdata.email);
  await page.getByRole('textbox', { name: 'Employee number' }).click();
  await page.getByRole('textbox', { name: 'Employee number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Employee number' }).fill(Updateduserdata.employeeNumber);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(Updateduserdata.phoneNumber);
  await page.getByRole('button', { name: 'Save' }).click();

  const EditUser = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const message1 = (await EditUser.textContent()) ?.replace(/\s+/g, ' ').trim();

  //Delete User
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(Updateduserdata.firstName);
  
  await page.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  
  const DeletetUser = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const DeletetUsermessage = (await DeletetUser.textContent()) ?.replace(/\s+/g, ' ').trim();

  //Reactivate User
  await page.getByRole('checkbox').first().click();
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(Updateduserdata.firstName);
  await page.getByText(Updateduserdata.email).click();

  await page.getByRole('button', { name: 'Reactivate user' }).click();
  await page.waitForTimeout(3000);

  const ReactivatetUser = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  const ReactivateUsermessage = (await ReactivatetUser.textContent()) ?.replace(/\s+/g, ' ').trim();


  //Delete User Group with Replacement
  await page.getByLabel(updatedtestdata.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'delete Delete' }).click();
  await page.getByText('Replace with').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  const DeleteUserGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteUserGroup).toBeVisible();
  const Deletegroupmessage = (await DeleteUserGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Report Table
    reportTable.push({
    Type: 'Add User Grpup',
    Title: testdata.title,
    Message: addusergroupmessage
    });

    reportTable.push({
    Type: 'Edit User Grpup',
    Title: updatedtestdata.title,
    Message: editusergroupmessage
    });
  
  reportTable.push({
    Type: 'Add User',
    FirstName: Userdata.firstName,
    MiddleName: Userdata.middleName,
    LastName: Userdata.lastName,
    Message: AddUsermessage
  });

  reportTable.push({
    Type: 'Update User',
    FirstName: Updateduserdata.firstName,
    MiddleName: Updateduserdata.middleName,
    LastName: Updateduserdata.lastName,
    Message: message1
  });

  reportTable.push({
    Type: 'Delete User',
    FirstName: Updateduserdata.firstName,
    MiddleName: Updateduserdata.middleName,
    LastName: Updateduserdata.lastName,
    Message: DeletetUsermessage
  });

  reportTable.push({
    Type: 'Reactivated User',
    FirstName: Updateduserdata.firstName,
    MiddleName: Updateduserdata.middleName,
    LastName: Updateduserdata.lastName,
    Message: ReactivateUsermessage
  });

    reportTable.push({
    Type: 'Delete User Group',
    Title: updatedtestdata.title,
    Message: Deletegroupmessage
  });

  console.table(reportTable);
});