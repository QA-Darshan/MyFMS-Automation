import { test, expect, Page } from '@playwright/test';
import { login } from './login';
import { generateCostCenterData } from './testdata';


test('test', async ({ page }) => {
  const data = generateCostCenterData();
  const edit = generateCostCenterData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin', { exact: true }).click();

  await page.getByRole('link', { name: 'account_tree Cost Centers' }).click();
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description' }).fill(data.description);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const AddCostCenterGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddCostCenterGroup).toBeVisible();
  const Addcostcentergroupmessage = (await AddCostCenterGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Edit Group
  await page.getByLabel(data.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByRole('button', { name: 'edit Edit' }).click();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(edit.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(edit.description);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const EditCostCenterGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditCostCenterGroup).toBeVisible();
  const Editcostcentergroupmessage = (await EditCostCenterGroup.textContent())?.replace(/\s+/g, ' ').trim();

  await page.getByRole('heading', { name: edit.title }).click();

  //Add Cost Center
  await page.getByRole('button', { name: 'add Add Cost Centers' }).click();

  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).fill(data.code);
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(data.name);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const AddCostCenter = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddCostCenter).toBeVisible();
  const Addcostcentermessage = (await AddCostCenter.textContent())?.replace(/\s+/g, ' ').trim();


  //Search
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.code);
  await page.getByText(data.code).click();

  //Edit Cost Center
  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Code' }).fill(edit.code);
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(edit.name);
  await page.getByRole('button', { name: 'Save' }).click();      
  await page.waitForTimeout(2000);

  const EditCostCenter = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditCostCenter).toBeVisible();
  const Editostcentermessage = (await EditCostCenter.textContent())?.replace(/\s+/g, ' ').trim();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search...' }).fill(edit.code);
  await page.getByRole('button', { name: 'delete' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.locator('.rz-chkbox-box').click();
  await page.waitForTimeout(3000);

  //Delete Cost Center Group with Replacement
  await page.getByLabel(edit.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Delete', { exact: true }).click();

  await page.getByText('Replace With').click();

  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Delete', exact: true}).click();
    
  const DeleteCostCenterGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteCostCenterGroup).toBeVisible();
  const DeleteCostCenterGroupmessage = (await DeleteCostCenterGroup.textContent())?.replace(/\s+/g, ' ').trim();

  await page.waitForTimeout(5000)

   console.table([
  {
    Action: 'Add Cost Center Group',
    Title: data.title,
    Status: 'Passed',
    Message: Addcostcentergroupmessage
  },
  {
    Action: 'Edit Cost Center Group',
    Title: edit.title,
    Status: 'Passed',
    Message: Editcostcentergroupmessage,
  },
    {
    Action: 'Add Cost Center',
    Title: data.name,
    Status: 'Passed',
    Message: Addcostcentermessage,
  },
  {
    Action: 'Edit Cost Center',
    Title: edit.name,
    Status: 'Passed',
    Message: Editostcentermessage,    
  },
   {
    Action: 'Delete Cost Center Group',
    Title: edit.name,
    Status: 'Passed',
    Message: DeleteCostCenterGroupmessage,    
  }  
]);
});