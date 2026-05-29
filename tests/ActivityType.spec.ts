import { login } from './login';
import { test, expect } from '@playwright/test';
import {generateActivityTypeData} from './testdata'

test('Activity Type Management', async ({ page }) => {
  const Data = generateActivityTypeData()
  const updatedData = generateActivityTypeData()
  await login(page)
  await page.waitForTimeout(10000);  
  await page.getByRole('button', { name: 'build Admin' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit_road Journeys' })).toBeVisible();

  await page.getByRole('link', { name: 'history Activity Type' }).click();
  await page.getByRole('button', { name: 'add Add Activity Type' }).click();
  await expect(page.getByRole('dialog', { name: 'Add Activity Type' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(Data.name);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(Data.description);

  //Color Picker
  await page.getByRole('button', { name: 'Toggle' }).nth(4).click();
  await expect(page.getByRole('dialog', { name: 'Color picker' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Hex' }).click();
  await page.getByRole('textbox', { name: 'Hex' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Hex' }).fill('#E53935');
  await page.getByRole('button', { name: 'OK' }).click();

  //File Upload
  await page
  .getByRole('dialog', { name: 'Add Activity Type' })
  .locator('input[type="file"]')
  .setInputFiles('analysis.png');

  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  const AddActivitytype = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddActivitytype).toBeVisible();
  const AddActivitytypemessage = (await AddActivitytype.textContent())?.replace(/\s+/g, ' ').trim();
  await page.waitForTimeout(5000);

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(Data.name);
  await page.getByText(Data.name, { exact: true }).click();

  //Edit Activity Type
  await page.getByText(Data.name, { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Edit Activity type' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(updatedData.name);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(updatedData.description);
  await page.getByText('Is journey required', { exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Display inactive Activity Type Is journey required check' })).toBeVisible();

  await page.getByRole('button', { name: 'Toggle' }).nth(4).click();
  await expect(page.getByRole('dialog', { name: 'Color picker' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Hex' }).click();
  await page.getByRole('textbox', { name: 'Hex' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Hex' }).fill('##FFFF00');
  await page.getByRole('button', { name: 'OK' }).click();

    //File Upload
  const editDialog = page.getByRole('dialog', { name: 'Edit Activity Type' });

// Upload file FIRST
  await editDialog.locator('input[type="file"]').setInputFiles([]); // clear old file (important)
  await editDialog.locator('input[type="file"]').setInputFiles('hybrid.png');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  const EditActivitytype = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditActivitytype).toBeVisible();
  const EditActivitytypemessage = (await EditActivitytype.textContent())?.replace(/\s+/g, ' ').trim();

  await page.waitForTimeout(5000);

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(updatedData.name);
  await page.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();

  const DeleteActivitytype = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteActivitytype).toBeVisible();
  const DeleteActivitytypemessage = (await DeleteActivitytype.textContent())?.replace(/\s+/g, ' ').trim();

  await page.waitForTimeout(2000);
  
   console.table([
  {
    Action: 'Add Activity Type',
    Title: Data.name,
    Status: 'Passed',
    Message: AddActivitytypemessage
  },
  {
    Action: 'Edit Activity Type',
    Title: updatedData.name,
    Status: 'Passed',
    Message: EditActivitytypemessage
  },
  {
    Action: 'Delete Activity Type',
    Title: updatedData.name,
    Status: 'Passed',
    Message: DeleteActivitytypemessage
  }
])
});