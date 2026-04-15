import { login } from './login';
import { test, expect } from '@playwright/test';
import {generateRFIDData} from './testdata';

test('Add RFID', async ({ page }) => {
const rfid = generateRFIDData();
const rfid1 = generateRFIDData();

  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

   await page.getByRole('link', { name: 'credit_card RFID\'s' }).click();
//  await expect(page.getByRole('row', { name: '111 Standard circle Active' })).toBeVisible();

  await page.getByRole('button', { name: 'add Add RFID' }).click();
  await expect(page.getByRole('complementary', { name: 'Add RFID' })).toBeVisible();

//  await page.getByText('Algemeen').nth(5).click();
//  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

//  await page.locator('#popup-GroupId').getByText('Test Darshan').click();
  await page.getByRole('textbox', { name: 'Identification code' }).click();
  await page.getByRole('textbox', { name: 'Identification code' }).fill(rfid.generateRFID);
  await page.getByPlaceholder('Enter alias').click();
  await page.getByPlaceholder('Enter alias').fill(rfid.generateAlias);
  await page.getByPlaceholder('Enter Third-party ID').click();
  await page.getByPlaceholder('Enter Third-party ID').fill(rfid.generateThirdpartyID);
  await page.getByRole('button', { name: 'Save' }).click();
  console.log({rfid, message: 'RFID Created Successfully'});   

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(rfid.generateRFID);

  await expect(page.getByRole('row', { name: rfid.generateRFID })).toBeVisible();

  await page.getByText(rfid.generateRFID).click();
  await expect(page.getByRole('complementary', { name: 'Edit RFID' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Identification code' }).click();
  await page.getByRole('textbox', { name: 'Identification code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Identification code' }).fill(rfid1.generateRFID);
  await page.getByPlaceholder('Enter alias').click();
  await page.getByPlaceholder('Enter alias').press('ControlOrMeta+a');
  await page.getByPlaceholder('Enter alias').fill(rfid1.generateAlias);
  await page.getByPlaceholder('Enter alias').press('ControlOrMeta+a');
  await page.getByPlaceholder('Enter Third-party ID').click();
  await page.getByPlaceholder('Enter Third-party ID').press('ControlOrMeta+a');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Enter Third-party ID').fill(rfid1.generateThirdpartyID);
  await page.getByRole('button', { name: 'Save' }).click();
  console.log({rfid1, message: 'RFID Edited Successfully'});

  //Delete the created RFID
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(rfid1.generateRFID);
  await page.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();
  await page.locator('div').filter({ hasText: 'RFID deleted RFID is deleted'}).nth(3).click();
  console.log({rfid1: rfid1.generateRFID, message: 'RFID Deleted Successfully'});
})