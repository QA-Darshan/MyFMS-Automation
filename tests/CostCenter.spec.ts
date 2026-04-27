import { test, expect, Page } from '@playwright/test';
import { login } from './login';
import { generateCostCenterData } from './testdata';
import { table } from 'node:console';


test('test', async ({ page }) => {
  const data = generateCostCenterData();
  const edit = generateCostCenterData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin', { exact: true }).click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'account_tree Cost Centers' }).click();
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Cost Center Group' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description' }).fill(data.description);
  await page.getByRole('button', { name: 'Save' }).click();
  const addGroupSuccessMessage = await expectSuccessMessage(page, 'add user group', /success|saved|created/i);
  console.table([
  {
    Title: data.title,
    Description: data.description,
  }
]); 

  //Edit Group
  await expect(page.getByRole('listitem', { name: data.title})).toBeVisible();

  await page.getByLabel(data.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('edit Edit').click();
  await expect(page.getByRole('complementary', { name: 'Edit Cost Center Group -' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(edit.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(edit.description);
  await page.getByRole('button', { name: 'Save' }).click();
  console.table([
  {
    Title: edit.title,
    Description: edit.description,
  }
]); 

  await page.getByRole('heading', { name: edit.title }).click();

  //Add Cost Center
  await page.getByRole('button', { name: 'add Add Cost Centers' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Cost Centers' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).fill(data.code);
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(data.name);
  await page.getByRole('button', { name: 'Save' }).click();
  console.table([
  {
    Code: data.code,
    Description: data.name,
  }
]); 

  //Search
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.code);
  await page.getByText(data.code).click();

  //Edit Cost Center
  await expect(page.getByRole('complementary', { name: 'Edit Cost Center' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Code' }).fill(edit.code);
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(edit.name);
  await page.getByRole('button', { name: 'Save' }).click();
  const EditSuccess = await expect(page.getByText('Cost center is updated successfully.')).toBeVisible();
  console.log(EditSuccess);
      console.table([
  {
    Code: edit.code,
    Description: edit.name,
  }
]); 
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search...' }).fill(edit.code);
  await page.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.locator('.rz-chkbox-box').click();
  await page.waitForTimeout(5000);

  //Delete Cost Center Group with Replacement
  await page.getByLabel(edit.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Delete', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Delete the selected cost' })).toBeVisible();

  await page.getByText('Replace With').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('option', { name: 'Algemeen' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Delete', exact: true}).click();
  await page.waitForTimeout(15000)
});

function expectSuccessMessage(page: Page, arg1: string, arg2: RegExp) {
  throw new Error('Function not implemented.');
}
