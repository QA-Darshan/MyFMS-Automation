import { login } from './login';
import { test, expect } from '@playwright/test';
import { generateAlphaString } from './testdata';


const DEFAULT_WAIT_MS = 15_000;
const POLL_MS = 250;

test('test', async ({ page }) => {
  const groupName = generateAlphaString(10);
  await login(page);
  await page.waitForTimeout(8000);

  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'inventory_2 Asset Pools' }).click();
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add asset pool groups' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
  await page.locator('//*[@id="2hGBOTQHRU"]/span/span').click();

  await page.getByRole('button', { name: 'add Assign asset' }).click();
  await expect(page.getByRole('complementary', { name: 'Assign Asset' })).toBeVisible();

  await page.getByText('Select asset').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByRole('option', { name: 'Description' }).nth(2).click();
  await page.getByRole('button', { name: 'Save' }).click();
})

