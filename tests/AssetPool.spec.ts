import { test, expect } from '@playwright/test';
import {generateassetpooldata} from './testdata'
import { login } from './login';

test('Asset Pool and Car Sharing', async ({ page }) => {
  const data = generateassetpooldata();
  const data1 = generateassetpooldata();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin', { exact: true }).click();

  await page.getByRole('link', { name: 'inventory_2 Asset Pools' }).click();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('button', { name: 'Save' }).nth(1).click();

  const AddAssetPoolGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddAssetPoolGroup).toBeVisible();
  const AddAssetPoolGroupmessage = (await AddAssetPoolGroup.textContent())?.replace(/\s+/g, ' ').trim();
  await page.waitForTimeout(5000)

  await page.getByRole('heading', { name: data.title }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();

  await page.getByLabel(data.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: data.title })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(data1.title);
  await page.getByRole('tab', { name: 'User group rights' }).click();
  await expect(page.getByRole('tabpanel', { name: 'User group rights' })).toBeVisible();

  await page.getByRole('button', { name: 'Root' }).click();
  await page.getByRole('checkbox', { name: 'Select item' }).nth(2).click();
  await page.getByRole('button', { name: 'Save' }).click();

  const EditAssetPoolGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditAssetPoolGroup).toBeVisible();
  const EditAssetPoolGroupmessage = (await EditAssetPoolGroup.textContent())?.replace(/\s+/g, ' ').trim();

  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'add Assign asset' }).click();
  await expect(page.getByRole('dialog', { name: 'Assign Asset' })).toBeVisible();

  await page.getByText('Select asset').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByText('Laptop Frank | XG-008-SS').click();  
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();

  const AssignAssetPool = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AssignAssetPool).toBeVisible();
  const AssignAssetPoolmessage = (await AssignAssetPool.textContent())?.replace(/\s+/g, ' ').trim();
  
  await page.getByRole('link', { name: 'car_rental Car sharing' }).nth(1).click();
  await page.getByRole('button', { name: 'add Add Reservation' }).click();
//  await expect(page.getByRole('complementary', { name: 'Add Reservation' })).toBeVisible();

  await page.getByRole('button', { name: 'Search assets' }).click();

  await page.getByTitle('Select User').click();
  await expect(page.getByRole('dialog', { name: 'Select User' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill('Darshan');
  await page.waitForTimeout(2000);
//  await expect(page.getByRole('row', { name: 'Select item Darshan B' })).toBeVisible();

  await page.locator('.rz-chkbox-box').first().click();
// /  await expect(page.getByRole('row', { name: 'Select item check Darshan B' })).toBeVisible();

  await page.getByLabel('Select User').getByRole('button', { name: 'Save' }).click();
  await page.getByText('XG-008-SS').click();  
  await page.getByRole('button', { name: 'Save' }).click();
  
  const AddReservation = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddReservation).toBeVisible();
  const AddReservationmessage = (await AddReservation.textContent())?.replace(/\s+/g, ' ').trim();
  await page.waitForTimeout(3000);

  await page.locator('.notranslate.rz-dropdown-trigger-icon').first().click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByText(data1.title).click();
  
  await page.getByText('XG-008-SS').click();
  await page.getByRole('button', { name: 'XG-008-SS' }).click();
  await expect(page.getByRole('tooltip', { name: 'XG-008-SS delete person' })).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).click();
  const confirmDialog = page.getByRole('dialog', { name: 'Confirm deletion' });

  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByRole('button', { name: 'Delete' }).click();

  const DeleteReservation = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteReservation).toBeVisible();
  const DeleteReservationmessage = (await DeleteReservation.textContent())?.replace(/\s+/g, ' ').trim();

  await page.getByRole('link', { name: 'inventory_2 Asset Pools' }).click();
  await page.getByRole('button', { name: 'delete' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Confirm unassign' })).toBeVisible();

  await page.getByRole('button', { name: 'Unassign' }).click();

  const DeleteAssetPool = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteAssetPool).toBeVisible();
  const DeleteAssetPoolmessge = (await DeleteAssetPool.textContent())?.replace(/\s+/g, ' ').trim();
  await page.waitForTimeout(3000);

  await page.getByLabel(data1.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'delete Delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  const DeleteAssetPoolGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeleteAssetPoolGroup).toBeVisible();
  const DeleteAssetPoolGroupmessage = (await DeleteAssetPoolGroup.textContent())?.replace(/\s+/g, ' ').trim();

  console.table([
  {
    Action: 'Add Asset Pool Group',
    Title: data.title,
    Status: 'Passed',
    Message: AddAssetPoolGroupmessage
  },
    {
    Action: 'Edit Asset Pool Group',
    Title: data1.title,
    Status: 'Passed',
    Message: EditAssetPoolGroupmessage
  },
  {
    Action: 'Assign Asset',
    Title: data1.title,
    Status: 'Passed',
    Message: AssignAssetPoolmessage
  },
  {
    Action: 'Add Reservation',
    Status: 'Passed',
    Message: AddReservationmessage
  },
    {
    Action: 'Delete Reservation',
    Status: 'Passed',
    Message: DeleteReservationmessage
  },
  {
    Action: 'Delete Asset Pool',
    Status: 'Passed',
    Message: DeleteAssetPoolmessge
  },
    {
    Action: 'Delete Asser Pool Group',
    Status: 'Passed',
    Message: DeleteAssetPoolGroupmessage
  },
])
  });