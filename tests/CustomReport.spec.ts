import { test, expect } from '@playwright/test';
import { login } from './login';
import { generateFormData } from './testdata'

test('test', async ({ page }) => {
await login(page);
 const data = generateFormData();
 const data1 = generateFormData();
 const editcreport = generateFormData();

  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'insert_drive_file Custom' }).click();

  await page.getByRole('button', { name: 'add Add Custom reports' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Custom Report' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(data.title);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('tabpanel', { name: 'Events' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter title' }).click();
  await page.getByRole('textbox', { name: 'Enter title' }).fill(data1.title);
  await page.getByText('Select Start Event').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('listbox').getByText('Location Reply').click();

  await page.getByText('Select Stop Event').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('listbox').getByText('Historical Reply').click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
    console.table([
  {
    Title: data.title,
    EventTitle: data1.title
  }
]);

  await page.waitForTimeout(5000);
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.title);
  await page.getByText(data.title).click();
//  await expect(page.getByRole('complementary', { name: 'Edit Custom Report' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(editcreport.title);
  await page.getByRole('button', { name: 'Save' }).click();
    console.table([
  {
    EditTitle: editcreport.title,
  }
])

  await page.getByRole('link', { name: 'description Reports' }).click();
  await page.getByRole('button', { name: 'add Add Report' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Report' })).toBeVisible();
  await page.waitForTimeout(5000);

  await page.getByText('General General Assets Users').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByRole('option', { name: 'Assets' }).click();
  await page.getByText('Assets - Journeys Assets - Journeys Assets - Journeys with topspeed Assets -').click();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();

  await page.getByText(editcreport.title).click();
  await page.getByText('Select Assets').click();
  await page.waitForTimeout(5000)
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
  await page.waitForTimeout(5000)
  await page.locator('.rz-multiselect-header > .rz-chkbox > .rz-chkbox-box').click();
  await expect(page.getByTitle('Remove `1`1`1`1 | BB-00-')).toBeVisible();

  await page.getByText('Category * Assets Report *').click();
  await expect(page.getByRole('option', { name: 'Day' })).toBeVisible();

  await page.getByRole('option', { name: 'Year' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
});