import { test, expect } from '@playwright/test';
import { login } from './login';
import { generateFormData } from './testdata'

test('Email Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);
  await page.getByRole('textbox', { name: 'Add email recipients' }).click();
  await page.getByRole('textbox', { name: 'Add email recipients' }).fill(data.email);
  await page.getByRole('button', { name: 'add', exact: true }).click();
  await expect(page.getByRole('button', { name: 'close', exact: true })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Subject' }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).fill(data.subject);
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data.message);
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  //Search Action
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);
  await page.waitForTimeout(5000);
//  await expect(page.getByRole('row', { name: 'my test test Email Yes 17-04-' })).toBeVisible();

  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByRole('textbox', { name: 'Add email recipients' }).click();
  await page.getByRole('textbox', { name: 'Add email recipients' }).fill(data1.email);
  await page.getByRole('button', { name: 'add', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter Subject' }).fill(data1.subject);
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data1.message);
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  //Delete Email Action
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data1.description);
  await page.waitForTimeout(5000);
  await page.getByRole('row', { name: data1.description }).getByRole('button').click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
});