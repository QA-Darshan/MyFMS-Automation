import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { generateRFIDData } from './testdata';

test('RFID Management', async ({ page }) => {
  const testdata = generateRFIDData()
  const updatedtestdata = generateRFIDData()
  await login(page);
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'build Admin' }).click();

  await page.getByRole('link', { name: 'credit_card RFID\'s' }).click();

  //Add RFID Group
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('dialog', { name: 'Add RFID group' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(testdata.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(testdata.description);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const AddRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddRFIDGroup).toBeVisible();
  const AddRfidMessage = (await AddRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Edit RFID Group
  await page.getByLabel(testdata.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'edit Edit' }).click();
  await expect(page.getByRole('dialog', { name: testdata.title })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedtestdata.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(updatedtestdata.description);
  await page.getByRole('button', { name: 'Save' }).click();

  const EditRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditRFIDGroup).toBeVisible();
  const EditRFIDmessage = (await EditRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Add RFID
  await page.getByRole('heading', { name: updatedtestdata.title }).click();

  await page.getByRole('button', { name: 'add Add RFID' }).click();
  await page.getByRole('textbox', { name: 'Identification code' }).click();
  await page.getByRole('textbox', { name: 'Identification code' }).fill(testdata.Identificationcode);
  await page.getByRole('textbox', { name: 'Alias' }).click();
  await page.getByRole('textbox', { name: 'Alias' }).fill(testdata.Alias);
  await page.getByRole('button', { name: 'image' }).click();
  await expect(page.getByRole('dialog', { name: 'Select User' })).toBeVisible();

  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').click();
  await page.getByRole('dialog', { name: 'Select User' }).getByPlaceholder('Search...').fill('Darshan');
  await page.waitForTimeout(2000);
  await page.getByRole('checkbox', { name: 'Select item' }).nth(2).click();
  await expect(page.getByRole('row', { name: 'Select item check Darshan' })).toBeVisible();

  await page.getByLabel('Select User').getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(testdata.ThirdpartyID);
  await page.getByRole('button', { name: 'Save' }).click();

  const AddRFID = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddRFID).toBeVisible();
  const AddRFIDmessage = (await AddRFID.textContent())?.replace(/\s+/g, ' ').trim();

  //Edit RFID
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(testdata.Identificationcode);
  await page.getByText(testdata.Identificationcode).click();
  await expect(page.getByRole('dialog', { name: 'Edit RFID' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Identification code' }).click();
  await page.getByRole('textbox', { name: 'Identification code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Identification code' }).fill(updatedtestdata.Identificationcode);
  await page.getByPlaceholder('Enter alias').click();
  await page.getByPlaceholder('Enter alias').press('ControlOrMeta+a');
  await page.getByPlaceholder('Enter alias').fill(updatedtestdata.Alias);
  await page.getByPlaceholder('Enter Third-party ID').click();
  await page.getByPlaceholder('Enter Third-party ID').press('ControlOrMeta+a');
  await page.getByPlaceholder('Enter Third-party ID').fill(updatedtestdata.ThirdpartyID);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const EditRFID = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditRFID).toBeVisible();
  const EditRFIDsuccess = (await EditRFID.textContent())?.replace(/\s+/g, ' ').trim();
    
  // Delete RFID
  // await page.getByRole('textbox', { name: 'Search...' }).click();
  // await page.getByRole('textbox', { name: 'Search...' }).fill(updatedtestdata.Identificationcode);
  // await page.getByRole('button', { name: 'delete' }).click();
  // await page.getByRole('button', { name: 'Delete', exact: true }).click();

  //Delete RFID Group with Replacement
  
  await page.getByLabel(updatedtestdata.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'delete Delete' }).click();
  await page.getByText('Replace with').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  const DeleteRFIDGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteRFIDGroup).toBeVisible();
  const DeleteRFIDGroupmesage = (await DeleteRFIDGroup.textContent())?.replace(/\s+/g, ' ').trim();

  console.table([
  {
    Action: 'Add RFID Group',
    Title: testdata.title,
    Status: 'Passed',
    Message: AddRfidMessage
  },
  {
    Action: 'Edit RFID Group',
    Title: updatedtestdata.title,
    Status: 'Passed',
    Message: EditRFIDmessage,
  },
  {
    Action: 'Add RFID',
    IdentificationcCode: testdata.Identificationcode,
    Alias: testdata.Alias,
    ThirdpartyID: testdata.ThirdpartyID,
    Status: 'Passed',
    Message: AddRFIDmessage,
  },
  {
    Action: 'Edit RFID',
    IdentificationcCode: updatedtestdata.Identificationcode,
    Alias: updatedtestdata.Alias,
    ThirdpartyID: updatedtestdata.ThirdpartyID,
    Status: 'Passed',
    Message: EditRFIDsuccess,  
  },
  {
    Action: 'Delete RFID Group',
    Title: updatedtestdata.title,
    Status: 'Passed',
    Message: DeleteRFIDGroupmesage,  
  }  
]);
});