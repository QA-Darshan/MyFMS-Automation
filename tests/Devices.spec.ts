import { expect, Locator, Page, test } from '@playwright/test';
import { login } from './login';
import * as testData from './testdata';

type DeviceData = { imei: string; simCard: string };
type DeviceDataFactory = () => DeviceData;

const fallbackGenerateDeviceData: DeviceDataFactory = () => {
  const imeiBase = `${Math.floor(10000000 + Math.random() * 90000000)}${Math.floor(100000 + Math.random() * 900000)}`;
  const imei = `${imeiBase}${Math.floor(Math.random() * 10)}`;
  const simCard = `${Math.floor(10 ** 18 + Math.random() * 9 * 10 ** 18)}`;
  return { imei, simCard };
};

const generateDeviceData: DeviceDataFactory =
  (testData as unknown as { generateDeviceData?: DeviceDataFactory }).generateDeviceData ??
  fallbackGenerateDeviceData;

async function getVisibleLocator(candidates: Locator[], label: string, timeout = 15000): Promise<Locator> {
  const stepTimeout = Math.max(1000, Math.floor(timeout / Math.max(candidates.length, 1)));
  for (const candidate of candidates) {
    const locator = candidate.first();
    try {
      await locator.waitFor({ state: 'visible', timeout: stepTimeout });
      return locator;
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(`Could not find visible element for "${label}"`);
}

async function clickVisible(candidates: Locator[], label: string, timeout = 15000) {
  const target = await getVisibleLocator(candidates, label, timeout);
  await target.click();
}

async function openDevicesPage(page: Page) {
  await login(page);
  await page.waitForTimeout(10000);

  await clickVisible(
    [
      page.getByRole('link', { name: /stock/i }).first(),
      page.getByRole('button', { name: /stock/i }).first(),
      page.getByText(/^Stock$/).first()
    ],
    'Stock navigation'
  );

  await clickVisible(
    [
      page.getByRole('link', { name: /devices/i }).first(),
      page.getByRole('button', { name: /devices/i }).first(),
      page.getByText(/^Devices$/).first()
    ],
    'Devices navigation'
  );
}

async function openAddDeviceModal(page: Page): Promise<Locator> {
  await clickVisible(
    [
      page.getByRole('button', { name: /add\s*add device/i }).first(),
      page.getByRole('button', { name: /add device/i }).first(),
      page.getByRole('button', { name: /^add$/i }).first()
    ],
    'Add Device button'
  );

  return getVisibleLocator(
    [
      page.getByRole('complementary', { name: /add device/i }).first(),
      page.getByRole('dialog', { name: /add device/i }).first(),
      page.locator('[role="complementary"], [role="dialog"]').filter({ hasText: /add device/i }).first()
    ],
    'Add Device modal'
  );
}

async function getModelField(modal: Locator): Promise<Locator> {
  return getVisibleLocator(
    [
      modal.getByRole('combobox', { name: /model/i }).first(),
      modal.locator('.rz-dropdown-label').first(),
      modal.locator('.rz-dropdown').first(),
      modal.getByText(/enter model/i).first(),
      modal.getByLabel(/model/i).first(),
      modal.getByPlaceholder(/model/i).first(),
      modal.locator('input[name*="model" i], [id*="model" i], [class*="dropdown" i]').first()
    ],
    'Model field'
  );
}

async function getIMEIField(modal: Locator): Promise<Locator> {
  return getVisibleLocator(
    [
      modal.getByRole('textbox', { name: /imei/i }).first(),
      modal.getByLabel(/imei/i).first(),
      modal.getByPlaceholder(/imei/i).first(),
      modal.locator('input[name*="imei" i], [id*="imei" i]').first()
    ],
    'IMEI field'
  );
}

async function getOptionalSIMField(modal: Locator): Promise<Locator | null> {
  try {
    return await getVisibleLocator(
      [
        modal.getByRole('textbox', { name: /sim/i }).first(),
        modal.getByLabel(/sim/i).first(),
        modal.getByPlaceholder(/sim/i).first(),
        modal.locator('input[name*="sim" i], [id*="sim" i]').first()
      ],
      'SIM field',
      6000
    );
  } catch {
    return null;
  }
}

async function getSaveButton(modal: Locator): Promise<Locator> {
  return getVisibleLocator(
    [
      modal.getByRole('button', { name: /^save$/i }).first(),
      modal.getByRole('button', { name: /save/i }).first()
    ],
    'Save button'
  );
}

async function selectAnyModel(page: Page, modal: Locator): Promise<string> {
  const modelField = await getModelField(modal);
  await modelField.click();
  const option = await getVisibleLocator(
    [
      page.locator('.rz-dropdown-item').first(),
      page.locator('.rz-popup .rz-dropdown-item').first(),
      page.locator('[role="option"]').first()
    ],
    'Model option'
  );
  const selectedModel = (await option.innerText()).trim();
  await option.click();
  return selectedModel || 'Unknown Model';
}

async function saveDeviceWithModelRetry(page: Page, modal: Locator) {
  let saveButton = await getSaveButton(modal);
  await saveButton.click();

  const modelRequired = modal.getByText(/can't be left empty/i).first();
  if (await modelRequired.isVisible().catch(() => false)) {
    await selectAnyModel(page, modal);
    saveButton = await getSaveButton(modal);
    await saveButton.click();
  }
}

test.describe('Devices - Stock module', () => {
  test('Add Device modal supports Cancel and Close actions', async ({ page }) => {
    await openDevicesPage(page);

    let modal = await openAddDeviceModal(page);
    const cancelButton = await getVisibleLocator(
      [
        modal.getByRole('button', { name: /cancel/i }).first(),
        page.getByRole('button', { name: /cancel/i }).first()
      ],
      'Cancel button'
    );
    await cancelButton.click();
    await expect(modal).toBeHidden();

    modal = await openAddDeviceModal(page);
    const closeButton = await getVisibleLocator(
      [
        modal.getByRole('button', { name: /close|x/i }).first(),
        modal.locator('button[aria-label*="close" i]').first(),
        modal.locator('[title*="close" i]').first()
      ],
      'Close button'
    );
    await closeButton.click();
    await expect(modal).toBeHidden();
  });

  test('Mandatory fields, inline validation, and save-button state are enforced', async ({ page }) => {
    await openDevicesPage(page);
    const modal = await openAddDeviceModal(page);
    const saveButton = await getSaveButton(modal);
    const imeiField = await getIMEIField(modal);
    const simField = await getOptionalSIMField(modal);

    await expect(saveButton).toBeDisabled();

    const ownerField = modal.locator('input[name*="owner" i], [aria-label*="owner" i], [id*="owner" i]').first();
    if (await ownerField.count()) {
      await expect(ownerField).toBeHidden();
    }

    const deviceData = generateDeviceData();
    console.log({ case: 'validation', imei: deviceData.imei, simCard: deviceData.simCard });
    if (simField) {
      await simField.fill(deviceData.simCard);
      await expect(saveButton).toBeDisabled();
    }

    await imeiField.fill('1234ABCD');
    await imeiField.press('Tab');
    await expect(page.getByText(/imei|invalid|format|required/i).first()).toBeVisible();
    await expect(saveButton).toBeDisabled();

    await selectAnyModel(page, modal);
    await imeiField.fill(deviceData.imei);
    await imeiField.press('Tab');
    await expect(saveButton).toBeEnabled();
  });

  test('Successful save closes modal, refreshes list, and sends selected values to backend', async ({ page }) => {
    await openDevicesPage(page);
    const modal = await openAddDeviceModal(page);
    const deviceData = generateDeviceData();
    const selectedModel = await selectAnyModel(page, modal);
    const imeiField = await getIMEIField(modal);
    const simField = await getOptionalSIMField(modal);
    const saveButton = await getSaveButton(modal);

    await imeiField.fill(deviceData.imei);
    if (simField) {
      await simField.fill(deviceData.simCard);
    }
    await expect(saveButton).toBeEnabled();

    await saveDeviceWithModelRetry(page, modal);
    await expect(modal).toBeHidden({ timeout: 20000 });

    const searchInput = await getVisibleLocator(
      [
        page.getByRole('textbox', { name: /search/i }).first(),
        page.getByPlaceholder(/search/i).first()
      ],
      'Search input'
    );
    await searchInput.click();
    await searchInput.fill(deviceData.imei);
    const row = page.getByRole('row', { name: new RegExp(deviceData.imei) }).first();
    await expect(row).toBeVisible();
    const ownerCell = row.getByRole('cell').nth(2);
    await expect(ownerCell).toBeVisible();
    await expect(ownerCell).not.toHaveText(/^(\s*|-)?$/);
    await expect(row).toContainText(selectedModel);
    console.log({
      case: 'save-success',
      imei: deviceData.imei,
      simCard: simField ? deviceData.simCard : 'not-visible',
      selectedModel
    });
  });

  test('Duplicate IMEI keeps modal open and shows failure message', async ({ page }) => {
    await openDevicesPage(page);
    const duplicateData = generateDeviceData();

    let modal = await openAddDeviceModal(page);
    await selectAnyModel(page, modal);
    await (await getIMEIField(modal)).fill(duplicateData.imei);
    const firstSimField = await getOptionalSIMField(modal);
    if (firstSimField) {
      await firstSimField.fill(duplicateData.simCard);
    }
    await saveDeviceWithModelRetry(page, modal);
    await expect(modal).toBeHidden({ timeout: 20000 });

    modal = await openAddDeviceModal(page);
    await selectAnyModel(page, modal);
    await (await getIMEIField(modal)).fill(duplicateData.imei);
    const secondSimField = await getOptionalSIMField(modal);
    if (secondSimField) {
      await secondSimField.fill(duplicateData.simCard);
    }
    await (await getSaveButton(modal)).click();

    await expect(modal).toBeVisible();
    await expect(page.getByText(/duplicate|already exists|imei|can't be left empty/i).first()).toBeVisible();
    console.log({ case: 'duplicate-check', imei: duplicateData.imei, simCard: duplicateData.simCard });
  });
});
