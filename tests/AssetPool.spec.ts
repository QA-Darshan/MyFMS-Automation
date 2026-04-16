import { login } from './login';
import { test, expect } from '@playwright/test';
import { generateAlphaString } from './testdata';


const DEFAULT_WAIT_MS = 15_000;
const POLL_MS = 250;

test('test', async ({ page }) => {
  const groupName = generateAlphaString(10);
  const updatedgrupname = generateAlphaString(10);
  await login(page);
  await page.waitForTimeout(8000);

  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'inventory_2 Asset Pools' }).click();
//  await expect(page.getByRole('row', { name: 'Description AA-00-13 27-01-' })).toBeVisible();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add asset pool groups' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
  await page.locator('div').filter({ hasText: 'General User group rights' }).nth(3).click();
  await page.getByRole('button', { name: 'Save' }).nth(1).click();
  await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await expect(page.getByRole('complementary', { name: `Edit group - ${groupName}` })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedgrupname);
  await page.getByRole('button', { name: 'Save' }).nth(1).click();
  await expect(page.getByRole('listitem', { name: updatedgrupname })).toBeVisible();

  await page.getByLabel(updatedgrupname).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Delete', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await page.getByRole('button', { name: 'add Assign asset' }).click();
  await expect(page.getByRole('complementary', { name: 'Assign Asset' })).toBeVisible();

  await page.getByText('Select asset').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByRole('option', { name: 'Description' }).nth(3).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('row', { name: 'Description AA-00-07 16-04-' })).toBeVisible();
  await page.getByRole('button', { name: 'delete' }).nth(1).click();
  await expect(page.getByRole('dialog', { name: 'Confirm unassign' })).toBeVisible();
  await page.getByRole('button', { name: 'Unassign' }).click();
});