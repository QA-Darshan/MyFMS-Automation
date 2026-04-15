import { login } from './login';
import { test, expect } from '@playwright/test';

test('Add User', async ({ page }) => {
  const groupName = `Testrfid${Date.now()}`;
  const updatedName = `Updatedrfid${Date.now()}`;

  await login(page);  
  await page.waitForTimeout(8000); 
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'credit_card RFID\'s' }).click();
//  await expect(page.getByRole('row', { name: '111 Standard circle Active' })).toBeVisible();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add RFID group' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
  await page.getByRole('button', { name: 'Save' }).click();
  console.log({groupName: groupName, message: 'RFID Group Created Successfully' });
  await expect(page.getByRole('listitem', { name: groupName })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await expect(page.getByRole('complementary', { name: `Edit RFID group - ${groupName}` })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedName);
  await page.getByRole('button', { name: 'Save' }).click();
  console.log({updatedName: updatedName, message: 'RFID Group Edited Successfully' });
  await expect(page.getByRole('listitem', { name: updatedName  })).toBeVisible();

  await page.getByLabel(updatedName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByLabel(updatedName).getByText('delete', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  console.log({message: 'RFID Group Deleted Successfully' });
});