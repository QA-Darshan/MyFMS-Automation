import { login } from './login';
import { expect, test } from '@playwright/test';

test.describe.serial('Reports flow', () => {

  //Add Report
  test('Add Reports', async ({ page }) => 
    {
    await login(page);
    await page.waitForTimeout(8000); 
    await page.getByRole('link', { name: 'description Reports' }).click();
    await page.getByRole('button', { name: 'add Add Report' }).click();
    await expect(page.getByRole('complementary', { name: 'Add Report' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Enter Favorite Report Name' }).click();
    await page.getByRole('textbox', { name: 'Enter Favorite Report Name' }).fill('Test');
    await page.getByRole('button', { name: 'Create' }).click();
    console.log('Report Added Successfully');
    await page.waitForTimeout(3000);
    await page.getByTitle('Pdf Preview').click();
    await page.waitForTimeout(3000);
    await expect(page.getByRole('dialog', { name: 'Pdf Preview' })).toBeVisible();
    await page.getByRole('button', { name: 'close' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTitle('Pdf', { exact: true }).click();
    const download = await downloadPromise;
    const download1Promise = page.waitForEvent('download');
    await page.getByTitle('Csv').click();
    const download1 = await download1Promise;

    //Favorite Report
    await expect(page.getByRole('row', { name: 'info star_border General -' })).toBeVisible();

    await page.getByRole('button', { name: 'star_border' }).click();
    await expect(page.getByRole('dialog', { name: 'Add to favorites' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Enter Favorite Report Name' }).click();
    await page.getByRole('textbox', { name: 'Enter Favorite Report Name' }).fill('Test');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('row', { name: 'info star General - Assets 30' })).toBeVisible();
    await page.getByRole('tab', { name: 'Favorite Reports' }).click();
    console.log('Report Added to Favorite Successfully');
  });
})