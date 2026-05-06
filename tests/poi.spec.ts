import { test, Page, expect } from '@playwright/test';
import { login } from './login';
import {generatePOIGroupData, generatePOIData } from './testdata'
import { formatCoords } from './testdata';

export async function enterPolygonCoordinates(page: Page, coords: { lat: number; lng: number }[]) {
    for (let i = 0; i < coords.length; i++) {
        await page.locator(`input[name="lat-${i}"]`).fill(coords[i].lat.toString());
        await page.locator(`input[name="lng-${i}"]`).fill(coords[i].lng.toString());

        if (i < coords.length - 1) {
            await page.getByRole('button', { name: 'Add Point' }).click();
            await page.locator(`input[name="lat-${i+1}"]`).waitFor();
        }
    }
}

test('test', async ({ page }) => {

const coords = [
    { lat: 52.67, lng: 6.46 },
    { lat: 52.64, lng: 6.60 },
    { lat: 52.59, lng: 6.49 }
];

 const formatted = formatCoords(coords);

 const Addpoigroup = generatePOIGroupData();
 const Updategroup = generatePOIGroupData();
 const addpoi = generatePOIData();
 const Updatepoi = generatePOIData();
 await login(page);
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'build Admin' }).click();

  await page.getByRole('link', { name: 'my_location POI\'s' }).click();

  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(Addpoigroup.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(Addpoigroup.description);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(Addpoigroup.thirdPartyId);
  await page.getByLabel('Toggle').click();
  await expect(page.getByRole('dialog', { name: 'Color picker' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Hex' }).click();
  await page.getByRole('textbox', { name: 'Hex' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Hex' }).fill('#E53935');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  const AddPOIGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddPOIGroup).toBeVisible();
  const AddPOIGroupmessage = (await AddPOIGroup.textContent())?.replace(/\s+/g, ' ').trim();

  
  //Edit POI Group

  await page.getByLabel(Addpoigroup.title).getByRole('button', { name: 'more_vert' }).click();
  await expect(page.getByRole('menuitem', { name: 'edit Edit' })).toBeVisible();

  await page.getByRole('button', { name: 'edit Edit' }).click();
  await expect(page.getByRole('dialog', { name: Addpoigroup.title })).toBeVisible();

  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(Updategroup.title);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill(Updategroup.description);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(Updategroup.thirdPartyId);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  const EditPOIGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditPOIGroup).toBeVisible();
  const EditPOIGroupmessage = (await EditPOIGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Add POI
  await page.getByText(Updategroup.title).click();

  await page.getByRole('button', { name: 'add Add POI' }).click();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(addpoi.name);
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).fill(addpoi.address);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(addpoi.thirdPartyId);
  await page.getByRole('textbox', { name: 'Lattitude' }).click();
  await page.getByRole('textbox', { name: 'Lattitude' }).fill(addpoi.latitude);
  await page.getByRole('textbox', { name: 'Longitude' }).click();
  await page.getByRole('textbox', { name: 'Longitude' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Longitude' }).fill(addpoi.longitude);
  await page.getByRole('button', { name: 'Save' }).click();

  
  const AddPOI = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(AddPOI).toBeVisible();
  const AddPOImessage = (await AddPOI.textContent())?.replace(/\s+/g, ' ').trim();
  
  await page.waitForTimeout(5000);


  // Edit POI
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(addpoi.name);

  await page.getByText(addpoi.name).click();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.locator('.rz-data-grid-data').press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Name' }).fill(Updatepoi.name);
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Address' }).fill(Updatepoi.address);
  await page.getByRole('textbox', { name: 'Third-party ID' }).click();
  await page.getByRole('textbox', { name: 'Address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Third-party ID' }).fill(Updatepoi.thirdPartyId);
  // await page.waitForTimeout(2000)
  await page.getByText('Polygon').click();
  await page.getByRole('textbox', { name: 'Coordinates' }).click();
  await page.getByRole('textbox', { name: 'Coordinates' }).fill(formatted);
  await page.getByRole('textbox', { name: 'Coordinates' }).press('Tab');
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Save' }).click();

  const EditPOI = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(EditPOI).toBeVisible();
  const EditPOImessage = (await EditPOI.textContent())?.replace(/\s+/g, ' ').trim();

  //Delete POI Group with Replacement
  await page.getByLabel(Updategroup.title).getByRole('button', { name: 'more_vert' }).click();

  await page.getByRole('button', { name: 'delete Delete' }).click();

  await page.getByText('Replace With').click();

  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  const DeletePOIGroup = page.locator('[role="alert"], .alert, .rz-notification').filter({ hasText: /successfully|created|updated|deleted/i }).first(); // ensure single element
  await expect(DeletePOIGroup).toBeVisible();
  const DeletePOIGroupmessage = (await DeletePOIGroup.textContent())?.replace(/\s+/g, ' ').trim();

  console.table([
  {
    Action: 'Add POI Group',
    Title: Addpoigroup.title,
    Status: 'Passed',
    Message: AddPOIGroupmessage
  },
  {
    Action: 'Edit POI Group',
    Title: Updategroup.title,
    Status: 'Passed',
    Message: EditPOIGroupmessage,
  },
  {
    Action: 'Add POI',
    Title: addpoi.name,
    Status: 'Passed',
    Message: AddPOImessage
  },
  {
    Action: 'Edit POI',
    Title: Updatepoi.name,
    Status: 'Passed',
    Message: EditPOImessage
  },
  {
    Action: 'Delete POI Group',
    Title: Updatepoi.name,
    Status: 'Passed',
    Message: DeletePOIGroupmessage
  }
]);

  //Delete POI
  // await page.getByRole('textbox', { name: 'Search...' }).click();
  // await page.getByRole('textbox', { name: 'Search...' }).press('ControlOrMeta+a');
  // await page.getByRole('textbox', { name: 'Search...' }).fill(Updatepoi.name);
  // await page.getByRole('button', { name: 'delete' }).click();
  // await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  // await page.getByRole('button', { name: 'Delete', exact: true }).click();
})