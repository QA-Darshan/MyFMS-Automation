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
  await page.getByTestId('sidebar-parent-menu-admin').click();

  await page.getByTestId('sidebar-admin-child-menu-users').click();

  //Add User Group
  await page.getByTestId('user-group-list-add-button-1').click();

  await page.getByTestId('user-group-create-title-input').click();
  await page.getByTestId('user-group-create-title-input').fill(testdata.title);
  await page.getByTestId('user-group-create-description-textarea').click();
  await page.getByTestId('user-group-create-description-textarea').fill(testdata.description);
  await page.getByTestId('user-group-create-save-button').click();
  await expect(page.getByRole('option', { name: testdata.title })).toBeVisible();

  const AddUserGroup = page.locator('[role="alert"], .alert, .rz-notification').first();
  const addusergroupmessage = (await AddUserGroup.textContent())  ?.replace(/\s+/g, ' ').trim();

  //Edit User Group
  const group = page.getByRole('option', { name: testdata.title });
  await expect(group).toBeVisible();
  await group.locator('button').click();

  await group
  .locator('[data-testid^="user-group-list-edit-menuitem"]')
  .click();

  await page.getByTestId('user-group-edit-title-input').click();
  await page.getByTestId('user-group-edit-title-input').press('ControlOrMeta+a');
  await page.getByTestId('user-group-edit-title-input').fill(updatedtestdata.title);
  await page.getByTestId('user-group-edit-description-textarea').click();
  await page.getByTestId('user-group-edit-description-textarea').press('ControlOrMeta+a');
  await page.getByTestId('user-group-edit-description-textarea').fill(updatedtestdata.description);
  await page.getByTestId('user-group-edit-save-button').click();
  await page.waitForTimeout(3000);

  const EditUserGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const editusergroupmessage = (await EditUserGroup.textContent())  ?.replace(/\s+/g, ' ').trim();

  await page.getByRole('heading', { name: updatedtestdata.title }).click();

  //Add User
  await page.getByTestId('user-header-add-button').click();
  await page.getByTestId('user-create-firstname-input').fill(Userdata.firstName);
  await page.getByTestId('user-create-middlename-input').fill(Userdata.middleName);
  await page.getByTestId('user-create-lastname-input').fill(Userdata.lastName);
  await page.getByTestId('user-create-email-input').fill(Userdata.email);
  await page.getByTestId('user-create-employee-number-input').fill(Userdata.employeeNumber)
  await page.getByTestId('user-create-telephone-input').fill(Userdata.phoneNumber);
  await page.getByTestId('user-create-street-input').fill(testdata.street);
  await page.getByTestId('user-create-number-input').locator('input').fill(testdata.number.toString());
  await page.getByTestId('user-create-postalcode-input').fill(testdata.Postalcode);
  await page.getByTestId('user-create-city-input').click();
  await page.getByTestId('user-create-city-input').fill(testdata.city);
  
await page.getByTestId('user-create-role-dropdown').click();

await page
  .locator('#RoleId-list li[role="option"]')
  .nth(0)
  .click();

  await page.waitForTimeout(3000);
  
  await page.getByTestId('user-create-save-button').click();
  await page.waitForTimeout(3000);
  
  const AddUser = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const AddUsermessage = (await AddUser.textContent())  ?.replace(/\s+/g, ' ').trim();

  //Edit User

  await page.getByTestId('user-header-search-input').click();
  await page.getByTestId('user-header-search-input').fill(Userdata.firstName);
 
  await page.getByText(Userdata.firstName).click();

  await page.getByTestId('user-edit-firstname-input').click();
  await page.getByTestId('user-edit-firstname-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-firstname-input').fill(Updateduserdata.firstName);
  await page.getByTestId('user-edit-middlename-input').click();
  await page.getByTestId('user-edit-middlename-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-middlename-input').fill(Updateduserdata.middleName);  
  await page.getByTestId('user-edit-lastname-input').click();
  await page.getByTestId('user-edit-lastname-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-lastname-input').fill(Updateduserdata.lastName);
  await page.getByTestId('user-edit-email-input').click();
  await page.getByTestId('user-edit-email-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-email-input').fill(Updateduserdata.email);
  await page.getByTestId('user-edit-employee-number-input').click();
  await page.getByTestId('user-edit-employee-number-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-employee-number-input').fill(Updateduserdata.employeeNumber);
  await page.getByTestId('user-edit-telephone-input').click();
  await page.getByTestId('user-edit-telephone-input').press('ControlOrMeta+a');
  await page.getByTestId('user-edit-telephone-input').fill(Updateduserdata.phoneNumber);
  await page.getByTestId('user-edit-save-button').click();
  await page.waitForTimeout(3000);

  const EditUser = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const message1 = (await EditUser.textContent()) ?.replace(/\s+/g, ' ').trim();

  //Delete User
  await page.getByTestId('user-header-search-input').click();
  await page.getByTestId('user-header-search-input').fill(Updateduserdata.firstName);
  
  await page.getByTestId('user-grid-delete-button-1').click();
  // await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.waitForTimeout(3000);
  
  const DeletetUser = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const DeletetUsermessage = (await DeletetUser.textContent()) ?.replace(/\s+/g, ' ').trim();

  //Reactivate User
  await page.getByTestId('user-header-inactive-checkbox').click();
  await page.getByTestId('user-header-search-input').click();
  await page.getByTestId('user-header-search-input').fill(Updateduserdata.firstName);
  await page.getByText(Updateduserdata.email).click();

  await page.getByTestId('user-edit-reactivate-button').click();
  await page.waitForTimeout(3000);

  const ReactivatetUser = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const ReactivateUsermessage = (await ReactivatetUser.textContent()) ?.replace(/\s+/g, ' ').trim();


  //Delete User Group with Replacement
  
  const deletegroup = page.getByRole('option', { name: updatedtestdata.title });
  await expect(deletegroup).toBeVisible();
  await deletegroup.locator('button').click();

  await deletegroup
  .locator('[data-testid^="user-group-list-delete-menuitem"]').click();
  
  await page.getByTestId('user-group-delete-replacement-dropdown').click();
  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();
  await expect(page.getByTestId('user-group-delete-replacement-dropdown')).toBeVisible();

  await page.getByTestId('user-group-delete-confirm-button').click()

  const DeleteUserGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  await expect(DeleteUserGroup).toBeVisible();
  const Deletegroupmessage = (await DeleteUserGroup.textContent())?.replace(/\s+/g, ' ').trim();

  // Report Table
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