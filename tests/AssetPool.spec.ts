import { test, expect } from '@playwright/test';
import {generateassetpooldata} from './testdata'
import { login } from './login';

test('test', async ({ page }) => {
  const data = generateassetpooldata();
  const data1 = generateassetpooldata();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin', { exact: true }).click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'inventory_2 Asset Pools' }).click();
  await expect(page.getByRole('row', { name: 'Description AA-00-13 27-01-' })).toBeVisible();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add asset pool groups' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('button', { name: 'Save' }).nth(1).click();
  await page.waitForTimeout(5000)

  await page.getByRole('heading', { name: data.title }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();

  await page.getByLabel(data.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
//  await expect(page.getByRole('complementary', { name: 'Edit group - somniculosus' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(data1.title);
  await page.getByRole('tab', { name: 'User group rights' }).click();
  await expect(page.getByRole('tabpanel', { name: 'User group rights' })).toBeVisible();

  await page.locator('.rz-tree-toggler').first().click();
  await page.locator('#WVqMud7Up0 > .rz-chkbox-box').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'add Assign asset' }).click();
//  await expect(page.getByRole('complementary', { name: 'Assign Asset' })).toBeVisible();

  await page.getByText('Select asset').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByText('Description | AA-00-06').click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();
  
  await page.getByRole('link', { name: 'car_rental Car sharing' }).nth(1).click();
  await page.getByRole('button', { name: 'add Add Reservation' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Reservation' })).toBeVisible();

  await page.getByRole('button', { name: 'Search assets' }).click();
  await expect(page.getByRole('listitem', { name: 'MyFms.Portal.Presentation.' })).toBeVisible();

  await page.getByTitle('Select User').click();
  await expect(page.getByRole('dialog', { name: 'Select User' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill('Darshan');
  await expect(page.getByRole('row', { name: 'Select item Darshan B' })).toBeVisible();

  await page.locator('.rz-chkbox-box').first().click();
  await expect(page.getByRole('row', { name: 'Select item check Darshan B' })).toBeVisible();

  await page.getByLabel('Select User').getByRole('button', { name: 'Save' }).click();
  await page.getByText('AA-00-').click();
  await page.getByRole('button', { name: 'Save' }).click();
  });