import { test, Page, expect } from '@playwright/test';
import { login } from './login';
import { generatePOIGroupData, generatePOIData } from './testdata'
import { formatCoords } from './testdata';

function formatPolygon(coords: { lat: number; lng: number }[]) {
  const closed = [...coords, coords[0]];

  return closed
    .map(c => `${c.lat};${c.lng}`)
    .join('|');
}

test('POI Management', async ({ page }) => {

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
  await expect(page.getByTestId('sidebar-parent-menu-admin')).toBeVisible();
  await page.getByTestId('sidebar-parent-menu-admin').click();

  await page.getByTestId('sidebar-admin-child-menu-pois').click();

  await page.getByTestId('poi-group-list-add-button-1').click();

  await page.getByTestId('poi-group-create-title-input').click();
  await page.getByTestId('poi-group-create-title-input').fill(Addpoigroup.title);
  await page.getByTestId('poi-group-create-description-textarea').click();
  await page.getByTestId('poi-group-create-description-textarea').fill(Addpoigroup.description);
  await page.getByTestId('poi-group-create-third-party-id-input').click();
  await page.getByTestId('poi-group-create-third-party-id-input').fill(Addpoigroup.thirdPartyId);
  await page.getByTestId('poi-group-create-color-picker-input').click();

  await page.getByRole('textbox', { name: 'Hex' }).click();
  await page.getByRole('textbox', { name: 'Hex' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Hex' }).fill('#E53935');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByTestId('poi-group-create-save-button').click();
  await page.waitForTimeout(2000);

  const AddPOIGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const AddPOIGroupmessage = (await AddPOIGroup.textContent())?.replace(/\s+/g, ' ').trim();


  //Edit POI Group

  const group = page.getByRole('option', { name: Addpoigroup.title });
  await expect(group).toBeVisible();
  await group.locator('button').click();

  await group.locator('[data-testid^="poi-group-list-edit-menuitem"]').click();

  await page.getByTestId('poi-group-edit-title-input').click();
  await page.getByTestId('poi-group-edit-title-input').press('ControlOrMeta+a');
  await page.getByTestId('poi-group-edit-title-input').fill(Updategroup.title);
  await page.getByTestId('poi-group-edit-description-textarea').click();
  await page.getByTestId('poi-group-edit-description-textarea').press('ControlOrMeta+a');
  await page.getByTestId('poi-group-edit-description-textarea').fill(Updategroup.description);
  await page.getByTestId('poi-group-edit-third-party-id-input').click();
  await page.getByTestId('poi-group-edit-third-party-id-input').press('ControlOrMeta+a');
  await page.getByTestId('poi-group-edit-third-party-id-input').fill(Updategroup.thirdPartyId);
  await page.getByTestId('poi-group-edit-save-button').click();
  await page.waitForTimeout(2000);

  const EditPOIGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const EditPOIGroupmessage = (await EditPOIGroup.textContent())?.replace(/\s+/g, ' ').trim();

  //Add POI
  await page.getByText(Updategroup.title).click();

  await page.getByTestId('poi-header-add-button').click();

  await page.getByTestId('poi-create-name-input').click();
  await page.getByTestId('poi-create-name-input').fill(addpoi.name);
  await page.getByTestId('poi-create-address-input').click();
  await page.getByTestId('poi-create-address-input').fill(addpoi.address);
  await page.getByTestId('poi-create-third-party-id-input').click();
  await page.getByTestId('poi-create-third-party-id-input').fill(addpoi.thirdPartyId);
  await page.getByTestId('poi-create-center-latitude-input').locator('input').first().fill(addpoi.latitude);
  await page.getByTestId('poi-create-center-longitude-input').locator('input').first().fill(addpoi.longitude);
  await page.getByTestId('poi-create-save-button').click();
  await page.waitForTimeout(2000);

  const AddPOI = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const AddPOImessage = (await AddPOI.textContent())?.replace(/\s+/g, ' ').trim();

  // Edit POI
  await page.getByTestId('poi-header-search-input').click();
  await page.getByTestId('poi-header-search-input').fill(addpoi.name);

  await page.getByText(addpoi.name).click();

  await page.getByTestId('poi-edit-name-input').click();
  await page.getByTestId('poi-edit-name-input').press('ControlOrMeta+a');
  await page.getByTestId('poi-edit-name-input').fill(Updatepoi.name);
  await page.getByTestId('poi-edit-address-input').click();
  await page.getByTestId('poi-edit-address-input').press('ControlOrMeta+a');
  await page.getByTestId('poi-edit-address-input').fill(Updatepoi.address);
  await page.getByTestId('poi-edit-third-party-id-input').click();
  await page.getByTestId('poi-edit-third-party-id-input').press('ControlOrMeta+a');
  await page.getByTestId('poi-edit-third-party-id-input').fill(Updatepoi.thirdPartyId);
  const polygonRadio = page.getByTestId('poi-edit-shape-polygon-radio-button').locator('xpath=ancestor::*[@role="radio"]');
  await polygonRadio.click();
  await expect(polygonRadio).toHaveAttribute('aria-checked', 'true');
  await page.getByTestId('poi-edit-coordinates-textarea').click();
  await page.waitForTimeout(2000);
  await page.getByTestId('poi-edit-coordinates-textarea').fill(formatted);
  await page.getByTestId('poi-edit-coordinates-textarea').press('Tab');
  await page.waitForTimeout(2000);

  await page.getByTestId('poi-edit-save-button').click();
  await page.waitForTimeout(2000);

  const EditPOI = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
  const EditPOImessage = (await EditPOI.textContent())?.replace(/\s+/g, ' ').trim();

  //Delete POI Group with Replacement
  const deletegroup = page.getByRole('option', { name: Updategroup.title });
  await deletegroup.locator('button').click();

  await deletegroup.locator('[data-testid^="poi-group-list-delete-menuitem"]').click();
  
  await page.getByTestId('poi-group-delete-replacement-dropdown').click();
  await page.locator('span').filter({ hasText: /^Algemeen$/ }).click();

  await page.getByTestId('poi-group-delete-confirm-button').click();
  await page.waitForTimeout(2000);

  const DeletePOIGroup = page.locator('[role="alert"], .alert, .rz-notification').first(); // ensure single element
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
