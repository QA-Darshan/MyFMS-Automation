import { test, expect } from '@playwright/test';
import { login } from './login';
import {generatePOIGroupData, generatePOIData } from './testdata'

test('test', async ({ page }) => {
 const poi = generatePOIGroupData();
 const poi1 = generatePOIGroupData();
 const poi11 = generatePOIData();
 const Updatepoi = generatePOIData();
 await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'my_location POI\'s' }).click();
  await expect(page.getByRole('row', { name: 'A POI Circle 50.00 m Yes' })).toBeVisible();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add POI Group' })).toBeVisible();

  await page.getByText('Select cost center Select').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByText('cc0005').click();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(poi.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(poi.description);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(poi.thirdPartyId);
  await page.getByRole('button', { name: 'expand_more' }).click();
  await expect(page.getByRole('button', { name: 'notifications' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Hex' }).click();
  await page.getByRole('textbox', { name: 'Hex' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Hex' }).fill('#E53935');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
    console.table([
  {
    Title: poi.title,
    Description: poi.description,
    ThirdPartyID: poi.thirdPartyId
  }
]); 
  await page.waitForTimeout(5000);

  //Edit POI Group
  
  await page.getByLabel(poi.title).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
//  await expect(page.getByRole('complementary', { name: 'Edit POI Group - Strosin -' })).toBeVisible();

  await page.getByText('cc0005 Select cost center').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByText('cc00311123').click();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(poi1.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(poi1.description);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(poi1.thirdPartyId);
  await page.getByRole('button', { name: 'Save' }).click();
  console.table([
  {
    Title: poi1.title,
    Description: poi1.description,
    ThirdPartyID: poi1.thirdPartyId
  }
]); 
await page.waitForTimeout(5000);

  //Add POI
  await page.getByText(poi1.title).click();
//  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();

  await page.getByRole('button', { name: 'add Add POI' }).click();
  await expect(page.getByRole('complementary', { name: 'Add POI' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(poi11.name);
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).fill(poi11.address);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(poi11.thirdPartyId);
  await page.getByRole('textbox', { name: 'Lattitude' }).click();
  await page.getByRole('textbox', { name: 'Lattitude' }).fill(poi11.latitude);
  await page.getByRole('textbox', { name: 'Longitude' }).click();
  await page.getByRole('textbox', { name: 'Longitude' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Longitude' }).fill(poi11.longitude);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);
  console.table([
  {
    Name: poi11.name,
    Address: poi11.address,
    ThirdPartyID: poi11.thirdPartyId,
    Lattitude: poi11.latitude,
    Longitude: poi11.longitude
  }
]);

  // Edit POI
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(poi11.name);
//  await expect(page.getByRole('row', { name: poi11.name })).toBeVisible();

  await page.getByText(poi11.name).click();
  await expect(page.getByRole('complementary', { name: 'Edit POI' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.locator('.rz-data-grid-data').press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(Updatepoi.name);
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Address' }).fill(Updatepoi.address);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(Updatepoi.thirdPartyId);
  await page.getByRole('button', { name: 'refresh' }).click();
//  await expect(page.getByRole('textbox', { name: 'Radius' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Lattitude' }).click();
  await page.getByRole('textbox', { name: 'Lattitude' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Lattitude' }).fill(Updatepoi.latitude);
  await page.getByRole('textbox', { name: 'Longitude' }).click();
  await page.getByRole('textbox', { name: 'Longitude' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Longitude' }).fill(Updatepoi.longitude);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);

    console.table([
  {
    Name: Updatepoi.name,
    Address: Updatepoi.address,
    ThirdPartyID: Updatepoi.thirdPartyId,
    Lattitude: Updatepoi.latitude,
    Longitude: Updatepoi.longitude
  }
]);
})