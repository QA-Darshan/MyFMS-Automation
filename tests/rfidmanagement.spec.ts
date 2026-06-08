import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { generateRFIDData } from './testdata';

test.describe.serial('RFID Management', () => {
  test.beforeEach(async ({ page }) => {
  await login(page);
  await page.waitForTimeout(10000);
  await expect(page.getByTestId('sidebar-parent-menu-admin')).toBeVisible();
  await page.getByTestId('sidebar-parent-menu-admin').click();

  await page.getByTestId("sidebar-admin-child-menu-rfid's").click();
  })

  const testdata = generateRFIDData()
  const updatedtestdata = generateRFIDData()
  
  test('Add RFID Group', async ({ page }) => {
  await page.getByTestId('rfid-group-list-add-button-1').click();  
  await page.getByTestId('rfid-group-create-title-input').click();
  await page.getByTestId('rfid-group-create-title-input').fill(testdata.title);
  await page.getByTestId('rfid-group-create-description-textarea').click();
  await page.getByTestId('rfid-group-create-description-textarea').fill(testdata.description);
  await page.getByTestId('rfid-group-create-save-button').click();
  await page.waitForTimeout(2000);

  const AddRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const AddRfidMessage = (await AddRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();
  });

  test('Edit RFID Group', async ({ page}) => {
  const group = page.getByRole('option', { name: testdata.title });
  await expect(group).toBeVisible();
  await group.locator('button').click();

  await group.locator('[data-testid^="rfid-group-list-edit-menuitem"]').click();

  await page.getByTestId('rfid-group-edit-title-input').click();
  await page.getByTestId('rfid-group-edit-title-input').press('ControlOrMeta+a');
  await page.getByTestId('rfid-group-edit-title-input').fill(updatedtestdata.title);
  await page.getByTestId('rfid-group-edit-description-textarea').click();
  await page.getByTestId('rfid-group-edit-description-textarea').press('ControlOrMeta+a');
  await page.getByTestId('rfid-group-edit-description-textarea').fill(updatedtestdata.description);
  await page.getByTestId('rfid-group-edit-save-button').click();
  await page.waitForTimeout(2000);

  const EditRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const EditRFIDmessage = (await EditRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();
  });

  test('Add RFID', async ({ page }) => {
  await page.getByRole('heading', { name: updatedtestdata.title }).click();

  await page.getByTestId('rfid-header-add-button').click();
  await page.getByTestId('rfid-create-identification-code-input').click();
  await page.getByTestId('rfid-create-identification-code-input').fill(testdata.Identificationcode);
  await page.getByTestId('rfid-create-alias-input').click();
  await page.getByTestId('rfid-create-alias-input').fill(testdata.Alias);
  await page.getByTestId('rfid-user-picker-open-button').click();

  await page.getByTestId('rfid-user-lookup-search-input').click();
  await page.getByTestId('rfid-user-lookup-search-input').fill('Darshan');
  await page.waitForTimeout(2000);
  await page.getByTestId('user-lookup-grid-row-checkbox-1').click();
  await page.getByTestId('rfid-user-lookup-save-button').click();
  await page.getByTestId('rfid-create-third-party-id-input').click();
  await page.getByTestId('rfid-create-third-party-id-input').fill(testdata.ThirdpartyID);
  await page.getByTestId('rfid-create-save-button').click();
  await page.waitForTimeout(2000);

  const AddRFID = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  await expect(AddRFID).toBeVisible();
  const AddRFIDmessage = (await AddRFID.textContent())?.replace(/\s+/g, ' ').trim();
  });

  test('Edit RFID', async ({ page }) => {
  await page.getByTestId('rfid-header-search-input').click();
  await page.getByTestId('rfid-header-search-input').fill(testdata.Identificationcode);
  await page.getByText(testdata.Identificationcode).click();

  await page.getByTestId('rfid-edit-identification-code-input').click();
  await page.getByTestId('rfid-edit-identification-code-input').press('ControlOrMeta+a');
  await page.getByTestId('rfid-edit-identification-code-input').fill(updatedtestdata.Identificationcode);
  await page.getByTestId('rfid-edit-alias-input').click();
  await page.getByTestId('rfid-edit-alias-input').press('ControlOrMeta+a');
  await page.getByTestId('rfid-edit-alias-input').fill(updatedtestdata.Alias);
  await page.getByTestId('rfid-edit-third-party-id-input').click();
  await page.getByTestId('rfid-edit-third-party-id-input').press('ControlOrMeta+a');
  await page.getByTestId('rfid-edit-third-party-id-input').fill(updatedtestdata.ThirdpartyID);
  await page.getByTestId('rfid-edit-save-button').click();
  await page.waitForTimeout(2000);

  const EditRFID = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const EditRFIDsuccess = (await EditRFID.textContent())?.replace(/\s+/g, ' ').trim();
  });

  test('Delete RFID Group with Replacement', async ({ page }) => {
  const deletegroup = page.getByRole('option', { name: updatedtestdata.title });
  await deletegroup.locator('button').click();

  await deletegroup.locator('[data-testid^="rfid-group-list-delete-menuitem"]').click();
  
  await page.getByTestId('rfid-group-delete-replacement-dropdown').click();
  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();

  await page.getByTestId('rfid-group-delete-confirm-button').click();

  const DeleteRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const DeleteRFIDGroupmesage = (await DeleteRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();
  })
})

//   console.table([
//   {
//     Action: 'Add RFID Group',
//     Title: testdata.title,
//     Status: 'Passed',
//     Message: AddRfidMessage
//   },
//   {
//     Action: 'Edit RFID Group',
//     Title: updatedtestdata.title,
//     Status: 'Passed',
//     Message: EditRFIDmessage,
//   },
//   {
//     Action: 'Add RFID',
//     IdentificationcCode: testdata.Identificationcode,
//     Alias: testdata.Alias,
//     ThirdpartyID: testdata.ThirdpartyID,
//     Status: 'Passed',
//     Message: AddRFIDmessage,
//   },
//   {
//     Action: 'Edit RFID',
//     IdentificationcCode: updatedtestdata.Identificationcode,
//     Alias: updatedtestdata.Alias,
//     ThirdpartyID: updatedtestdata.ThirdpartyID,
//     Status: 'Passed',
//     Message: EditRFIDsuccess,  
//   },
//   {
//     Action: 'Delete RFID Group',
//     Title: updatedtestdata.title,
//     Status: 'Passed',
//     Message: DeleteRFIDGroupmesage,  
//   }  
// ]);
// });