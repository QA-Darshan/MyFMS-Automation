import { login } from './login';
import { test, expect } from '@playwright/test';
import { generateAlphaString } from './testdata';


test('Add User Group', async ({ page }) => {
  const groupName = generateAlphaString(10);
  const updatedgroupName = generateAlphaString(10);
  await login(page);  
  await page.waitForTimeout(18000);
  await page.getByText('Admin', { exact: true }).click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'account_circle Users' }).click();
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add user group' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Description');
  await page.getByRole('button', { name: 'Save' }).click();
  console.log({groupName: groupName, message: 'User Group Created Successfully' });
  await expect(page.getByRole('listitem', { name: groupName})).toBeVisible();
  await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
  await page.locator('div').filter({ hasText: new RegExp(`^${groupName}$`) }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();

  await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await expect(page.getByRole('complementary', { name: `Edit group - ${groupName}` })).toBeVisible();
  
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedgroupName);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill('Updated Description');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('listitem', { name: updatedgroupName })).toBeVisible();
  console.log({updatedName: updatedgroupName, message: 'User Group Edited Successfully' });

  await page.getByLabel(updatedgroupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Delete', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();  
  console.log({updatedgroupName, message: 'User Group Deleted Successfully'});
});