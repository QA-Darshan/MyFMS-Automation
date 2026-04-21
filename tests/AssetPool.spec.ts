import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { generateAlphaString } from './testdata';

const DEFAULT_WAIT_MS = 15_000;
const POLL_MS = 250;
const MAX_ASSET_ASSIGN_RETRIES = 5;

type AssignmentResult = {
  assetLabel: string;
  assetSearchValue: string;
  successMessage: string;
  attempts: number;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function columnWidth(header: string, values: string[]): number {
  const longest = values.reduce((max, value) => Math.max(max, value.length), header.length);
  return Math.max(header.length, longest);
}

function toCell(value: unknown, width: number): string {
  const raw = String(value ?? '');
  const normalized = raw.replace(/\s+/g, ' ').trim();
  const trimmed = normalized.length > width ? `${normalized.slice(0, Math.max(0, width - 3))}...` : normalized;
  return trimmed.padEnd(width, ' ');
}

function buildFixedTable(title: string, headers: string[], rows: string[][], widths: number[]): string {
  const border = `+${widths.map((width) => '-'.repeat(width + 2)).join('+')}+`;
  const header = `| ${headers.map((heading, index) => toCell(heading, widths[index])).join(' | ')} |`;
  const lines = ['', title, border, header, border];

  for (const row of rows) {
    lines.push(`| ${row.map((value, index) => toCell(value, widths[index])).join(' | ')} |`);
  }

  lines.push(border);
  return lines.join('\n');
}

function buildGeneratedDataTable(initialGroupName: string, updatedGroupName: string): string {
  return buildFixedTable(
    'Generated Asset Pool Data',
    ['Field', 'Value'],
    [
      ['Initial Group', initialGroupName],
      ['Updated Group', updatedGroupName],
      ['Max Asset Retry Attempts', String(MAX_ASSET_ASSIGN_RETRIES)],
      ['Target User Right', 'Nexuslink'],
    ],
    [24, 40],
  );
}

function buildSummaryTable(rows: string[][]): string {
  const actionWidth = columnWidth('Action', rows.map((row) => row[0]));
  const valueWidth = columnWidth('Value', rows.map((row) => row[1]));
  const statusWidth = columnWidth('Status', rows.map((row) => row[2]));
  const messageWidth = columnWidth('Message', rows.map((row) => row[3]));

  return buildFixedTable(
    'Asset Pool End-to-End Summary',
    ['Action', 'Value', 'Status', 'Message'],
    rows,
    [actionWidth, valueWidth, statusWidth, messageWidth],
  );
}

function extractAssetSearchValue(assetLabel: string): string {
  const normalized = normalizeText(assetLabel);
  const codeMatch = normalized.match(/\b[A-Z]{1,3}-\d{2}-\d{2}\b/);
  if (codeMatch) {
    return codeMatch[0];
  }

  const alphanumericToken = normalized.match(/\b[A-Z0-9]{5,}\b/i);
  if (alphanumericToken) {
    return alphanumericToken[0];
  }

  return normalized;
}

async function firstVisible(locator: Locator): Promise<Locator | null> {
  const count = await locator.count();
  for (let index = 0; index < count; index++) {
    const item = locator.nth(index);
    if (await item.isVisible().catch(() => false)) {
      return item;
    }
  }
  return null;
}

async function waitForFirstVisible(candidates: Locator[], timeoutMs = DEFAULT_WAIT_MS): Promise<Locator | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    for (const candidate of candidates) {
      const visible = await firstVisible(candidate);
      if (visible) {
        return visible;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  return null;
}

async function clickFirstVisible(actionName: string, candidates: Locator[], timeoutMs = DEFAULT_WAIT_MS): Promise<Locator> {
  const target = await waitForFirstVisible(candidates, timeoutMs);
  if (!target) {
    throw new Error(`Could not find clickable element for: ${actionName}`);
  }
  await target.click();
  return target;
}

async function fillFirstVisible(fieldName: string, candidates: Locator[], value: string): Promise<void> {
  const target = await waitForFirstVisible(candidates);
  if (!target) {
    throw new Error(`Could not find input field for: ${fieldName}`);
  }
  await target.click();
  await target.press('ControlOrMeta+a').catch(() => {});
  await target.fill(value);
}

async function isChecked(control: Locator): Promise<boolean | null> {
  try {
    return await control.isChecked();
  } catch {
    try {
      return await control.evaluate((element) => {
        if (element instanceof HTMLInputElement) {
          return element.checked;
        }
        const ariaChecked = element.getAttribute('aria-checked');
        if (ariaChecked !== null) {
          return ariaChecked === 'true';
        }
        return /checked|selected|active/i.test(element.className || '');
      });
    } catch {
      return null;
    }
  }
}

async function expectMessage(page: Page, actionName: string, pattern: RegExp, timeoutMs = DEFAULT_WAIT_MS): Promise<string> {
  const toast = await waitForFirstVisible([
    page.getByRole('alert').filter({ hasText: pattern }),
    page.locator('[role="status"]').filter({ hasText: pattern }),
    page
      .locator('.MuiSnackbar-root, .notistack-Snackbar, .Toastify__toast, .rz-notification, .rz-growl-item-wrapper, .rz-growl-message, .rz-message')
      .filter({ hasText: pattern }),
    page.getByText(pattern),
  ], timeoutMs);

  if (!toast) {
    throw new Error(`Expected message not shown after: ${actionName}`);
  }

  return normalizeText(await toast.textContent()) || 'Notification visible';
}

async function maybeReadMessage(page: Page, pattern: RegExp, timeoutMs = 4_000): Promise<string | null> {
  const toast = await waitForFirstVisible([
    page.getByRole('alert').filter({ hasText: pattern }),
    page.locator('[role="status"]').filter({ hasText: pattern }),
    page
      .locator('.MuiSnackbar-root, .notistack-Snackbar, .Toastify__toast, .rz-notification, .rz-growl-item-wrapper, .rz-growl-message, .rz-message')
      .filter({ hasText: pattern }),
    page.getByText(pattern),
  ], timeoutMs);

  if (!toast) {
    return null;
  }

  return normalizeText(await toast.textContent()) || 'Notification visible';
}

async function recoverFromServerErrorIfPresent(page: Page): Promise<void> {
  const serverErrorHeading = page.getByRole('heading', { name: /internal server error/i });
  const isServerErrorVisible = await serverErrorHeading.isVisible().catch(() => false);
  if (!isServerErrorVisible) {
    return;
  }

  console.log('MyFMS returned an Internal Server Error page. Attempting recovery.');
  const goToMyFmsLink = await waitForFirstVisible([
    page.getByRole('link', { name: /go to myfms/i }),
    page.getByText(/go to myfms/i),
  ], 5_000);

  if (goToMyFmsLink) {
    await goToMyFmsLink.click();
    return;
  }

  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function openAdminMenu(page: Page): Promise<void> {
  await recoverFromServerErrorIfPresent(page);
  await waitForFirstVisible([
    page.getByRole('button', { name: /search assets/i }),
    page.getByRole('link', { name: /assets/i }),
    page.getByText(/\bassets\b/i),
    page.getByText('Admin'),
  ], 20_000);

  await clickFirstVisible('Admin menu', [
    page.getByRole('listitem', { name: /admin/i }),
    page.getByText(/^Admin$/i),
    page.getByText('Admin'),
  ], 10_000);
}

async function openAssetPoolsPage(page: Page): Promise<void> {
  await recoverFromServerErrorIfPresent(page);
  const assetPoolsLink = await waitForFirstVisible([
    page.locator('a[href*="/admin/assetspool"]').first(),
    page.getByRole('link', { name: /asset pools/i }),
    page.getByRole('link', { name: /inventory_2 Asset Pools/i }),
    page.getByText(/asset pools/i),
  ], 10_000);

  if (assetPoolsLink) {
    await assetPoolsLink.click();
  } else {
    const origin = new URL(page.url()).origin;
    const candidatePaths = [
      '/admin/assetspool',
      '/admin/assetpools',
      '/admin/assetpool',
      '/admin/asset-pools',
      '/admin/assetpoolgroups',
      '/admin/assetpoolgroup',
    ];

    let opened = false;
    for (const path of candidatePaths) {
      await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
      await recoverFromServerErrorIfPresent(page);

      const pageReady = await waitForFirstVisible([
        page.getByRole('button', { name: /assign asset/i }),
        page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: /^add$/i }),
        page.getByText(/asset pool/i),
      ], 6_000);

      if (pageReady) {
        opened = true;
        break;
      }
    }

    if (!opened) {
      throw new Error('Could not open Asset Pools page after clicking Admin.');
    }
  }

  await expect(
    await waitForFirstVisible([
      page.getByRole('button', { name: /assign asset/i }),
      page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: /^add$/i }),
      page.getByText(/asset pool/i),
    ], 20_000),
  ).not.toBeNull();
}

async function openCarSharingPage(page: Page): Promise<void> {
  await recoverFromServerErrorIfPresent(page);
  const carSharingLink = await waitForFirstVisible([
    page.getByRole('link', { name: /car sharing/i }).first(),
    page.getByText(/car sharing/i).first(),
  ], 8_000);

  if (!carSharingLink) {
    await clickFirstVisible('Assets menu', [
      page.getByRole('link', { name: /^assets$/i }),
      page.getByRole('button', { name: /^assets$/i }),
      page.getByText(/^Assets$/i),
    ], 8_000);
  }

  await clickFirstVisible('Car Sharing menu', [
    page.getByRole('link', { name: /car sharing/i }).first(),
    page.getByText(/car sharing/i).first(),
  ], 10_000);

  await expect(page.getByRole('button', { name: /add reservation/i })).toBeVisible({ timeout: 20_000 });
}

function getAssetPoolGroupItem(page: Page, groupName: string): Locator {
  return page.locator('li', {
    has: page.getByText(new RegExp(`^${escapeRegex(groupName)}$`, 'i')),
  }).first();
}

async function selectAssetPoolGroup(page: Page, groupName: string): Promise<void> {
  await clickFirstVisible(`Asset Pool group ${groupName}`, [
    page.getByRole('listitem', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')),
    page.getByText(groupName, { exact: true }),
    getAssetPoolGroupItem(page, groupName),
  ], 10_000);
}

async function openGroupActions(page: Page, groupName: string): Promise<void> {
  const groupItem = getAssetPoolGroupItem(page, groupName);
  await expect(groupItem).toBeVisible({ timeout: 20_000 });

  await clickFirstVisible(`Action menu for group ${groupName}`, [
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')).getByRole('button', { name: /more_vert|more/i }),
    groupItem.getByRole('button', { name: /more_vert|more|menu|action/i }),
    groupItem.locator('button[aria-label*="more" i], button[title*="more" i]'),
  ], 10_000);
}

async function openGroupEditPanel(page: Page, groupName: string): Promise<Locator> {
  await openGroupActions(page, groupName);
  await clickFirstVisible(`Edit group ${groupName}`, [
    page.getByRole('menuitem', { name: /^edit$/i }),
    page.getByRole('listitem', { name: /^edit$/i }),
    page.getByText(/^Edit$/),
  ], 8_000);

  const panel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /edit group|edit asset pool/i }),
    page.getByRole('dialog', { name: /edit group|edit asset pool/i }),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('textbox', { name: /title/i }) })
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .first(),
  ], 20_000);

  if (!panel) {
    throw new Error(`Could not open edit panel for asset pool group: ${groupName}`);
  }

  return panel;
}

async function createAssetPoolGroup(page: Page, groupName: string): Promise<string> {
  await expect(
    await waitForFirstVisible([
      page.getByRole('button', { name: /assign asset/i }),
      page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: /^add$/i }),
      page.getByText(/asset pool/i),
    ], 20_000),
  ).not.toBeNull();

  await clickFirstVisible('Add Asset Pool Group', [
    page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: /^add$/i }),
    page.getByLabel(/root/i).getByRole('button', { name: /^add$/i }),
    page.locator('li:has-text("Root") button:has-text("add")'),
  ], 10_000);

  const panel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /add asset pool groups/i }),
    page.getByRole('dialog', { name: /add asset pool groups/i }),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('textbox', { name: /title/i }) })
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .first(),
  ], 20_000);

  if (!panel) {
    throw new Error('Could not open Add Asset Pool Group panel.');
  }

  await fillFirstVisible('Asset Pool Group Title', [
    panel.getByRole('textbox', { name: /^title$/i }),
    panel.getByRole('textbox', { name: /title|name/i }),
  ], groupName);
  await panel.getByRole('textbox', { name: /^title$/i }).press('Tab').catch(() => {});

  const saveButton = await waitForFirstVisible([
    panel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ], 8_000);
  if (!saveButton) {
    throw new Error('Save button not available in Add Asset Pool Group panel.');
  }

  await saveButton.click({ force: true });
  await page.waitForTimeout(1000);

  const panelStillVisible = await panel.isVisible().catch(() => false);
  if (panelStillVisible) {
    await saveButton.click({ force: true }).catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
  }

  const message = await maybeReadMessage(page, /success|saved|created/i, 8_000);
  const createdGroup = await waitForFirstVisible([
    page.getByRole('listitem', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')),
    page.getByText(groupName, { exact: true }),
    getAssetPoolGroupItem(page, groupName),
  ], 20_000);

  if (!createdGroup) {
    await expect
      .poll(async () => !(await panel.isVisible().catch(() => false)), { timeout: 10_000 })
      .toBeTruthy()
      .catch(() => {});
  }

  const createdGroupAfterClose = createdGroup ?? await waitForFirstVisible([
    page.getByRole('listitem', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')),
    page.getByText(groupName, { exact: true }),
    getAssetPoolGroupItem(page, groupName),
  ], 10_000);

  if (!createdGroupAfterClose) {
    throw new Error(`Created Asset Pool Group not visible after save: ${groupName}`);
  }

  return message ?? `Asset Pool Group created: ${groupName}`;
}

async function editGroup(page: Page, currentName: string, updatedName: string): Promise<string> {
  const panel = await openGroupEditPanel(page, currentName);

  await fillFirstVisible('Edited Asset Pool Group Title', [
    panel.getByRole('textbox', { name: /^title$/i }),
    panel.getByRole('textbox', { name: /title|name/i }),
  ], updatedName);

  await clickFirstVisible('Save edited asset pool group', [
    panel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ], 8_000);

  const message = await expectMessage(page, 'edit asset pool group', /success|saved|updated/i);
  await expect(page.getByRole('listitem', { name: updatedName })).toBeVisible({ timeout: 20_000 });
  return message;
}

async function openAssetAssignmentPanel(page: Page): Promise<Locator> {
  await clickFirstVisible('Assign asset button', [
    page.getByRole('button', { name: /assign asset/i }),
    page.getByText(/assign asset/i),
  ], 10_000);

  const panel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /assign asset/i }),
    page.getByRole('dialog', { name: /assign asset/i }),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .first(),
  ], 20_000);

  if (!panel) {
    throw new Error('Could not open Assign Asset panel.');
  }

  return panel;
}

async function closePanelIfVisible(page: Page, panel: Locator): Promise<void> {
  const stillVisible = await panel.isVisible().catch(() => false);
  if (!stillVisible) {
    return;
  }

  const closeButton = await waitForFirstVisible([
    panel.getByRole('button', { name: /close|cancel/i }),
    panel.locator('button[aria-label*="close" i], button[title*="close" i]').first(),
  ], 2_000);

  if (closeButton) {
    await closeButton.click().catch(() => {});
    return;
  }

  await page.keyboard.press('Escape').catch(() => {});
}

async function openAssetDropdown(panel: Locator): Promise<void> {
  const dropdown = await waitForFirstVisible([
    panel.getByRole('combobox'),
    panel.locator('.rz-dropdown, [aria-haspopup="listbox"]').first(),
    panel.locator('.rz-dropdown-trigger, .rz-dropdown-label, .rz-dropdown-trigger-icon').first(),
  ], 8_000);

  if (!dropdown) {
    throw new Error('Could not find asset dropdown in Assign Asset panel.');
  }

  await dropdown.click({ force: true }).catch(async () => {
    await dropdown.locator('.rz-dropdown-trigger, .rz-dropdown-trigger-icon').first().click({ force: true });
  });
}

async function selectNextAvailableAsset(page: Page, triedAssets: Set<string>): Promise<string | null> {
  const options = [
    page.getByRole('option'),
    page.locator('[role="listbox"] [role="option"]'),
    page.locator('.rz-dropdown-items .rz-dropdown-item, .MuiAutocomplete-option'),
  ];

  for (const locator of options) {
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      const option = locator.nth(index);
      const visible = await option.isVisible().catch(() => false);
      if (!visible) {
        continue;
      }

      const optionText = normalizeText(await option.textContent());
      if (!optionText || /no data|no records|loading/i.test(optionText)) {
        continue;
      }
      if (triedAssets.has(optionText)) {
        continue;
      }

      triedAssets.add(optionText);
      await option.click();
      return optionText;
    }
  }

  return null;
}

async function assignAssetWithRetry(page: Page, maxAttempts = MAX_ASSET_ASSIGN_RETRIES): Promise<AssignmentResult> {
  const triedAssets = new Set<string>();
  const duplicatePattern = /already assigned|duplicate|already exists|error|failed/i;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const panel = await openAssetAssignmentPanel(page);
    await openAssetDropdown(panel);

    const selectedAsset = await selectNextAvailableAsset(page, triedAssets);
    if (!selectedAsset) {
      await closePanelIfVisible(page, panel);
      throw new Error(`No untried assets available after ${attempt - 1} attempt(s).`);
    }

    console.log(`Assign asset attempt ${attempt}/${maxAttempts}: ${selectedAsset}`);

    await clickFirstVisible('Save assigned asset', [
      panel.getByRole('button', { name: /^save$/i }),
      page.getByRole('button', { name: /^save$/i }),
    ], 8_000);

    const duplicateMessage = await maybeReadMessage(page, duplicatePattern, 4_000);
    if (duplicateMessage) {
      console.log(`Assign asset attempt ${attempt} failed: ${duplicateMessage}`);
      await closePanelIfVisible(page, panel);
      continue;
    }

    const successMessage = await maybeReadMessage(page, /success|saved|assigned/i, 6_000);
    const assetRow = await waitForFirstVisible([
      page.getByRole('row', { name: new RegExp(escapeRegex(selectedAsset), 'i') }),
      page.locator('tr', { hasText: new RegExp(escapeRegex(selectedAsset), 'i') }),
      page.getByText(new RegExp(escapeRegex(selectedAsset), 'i')),
    ], 10_000);

    if (successMessage || assetRow) {
      return {
        assetLabel: selectedAsset,
        assetSearchValue: extractAssetSearchValue(selectedAsset),
        successMessage: successMessage ?? `Asset assigned successfully: ${selectedAsset}`,
        attempts: attempt,
      };
    }

    console.log(`Assign asset attempt ${attempt} did not confirm success; retrying with another asset.`);
    await closePanelIfVisible(page, panel);
  }

  throw new Error(`Unable to assign an asset after ${maxAttempts} attempts.`);
}

async function ensureUserRightChecked(page: Page, container: Locator, labelText: string): Promise<void> {
  const row = await waitForFirstVisible([
    container.locator('[role="treeitem"], li, div, label').filter({ hasText: new RegExp(`^${escapeRegex(labelText)}$`, 'i') }).first(),
    container.getByText(new RegExp(`^${escapeRegex(labelText)}$`, 'i')),
  ], 10_000);

  if (!row) {
    throw new Error(`Could not find user right row: ${labelText}`);
  }

  const checkbox = await waitForFirstVisible([
    row.locator('input[type="checkbox"], [role="checkbox"], .rz-chkbox-box, .MuiCheckbox-root').first(),
    container.locator(`label:has-text("${labelText}")`).locator('input[type="checkbox"], [role="checkbox"], .rz-chkbox-box, .MuiCheckbox-root').first(),
  ], 3_000);

  if (!checkbox) {
    throw new Error(`Could not find checkbox for user right: ${labelText}`);
  }

  const currentState = await isChecked(checkbox);
  if (currentState === true) {
    return;
  }

  await checkbox.click({ force: true });
}

async function updateUserRights(page: Page, groupName: string): Promise<string> {
  const panel = await openGroupEditPanel(page, groupName);

  await clickFirstVisible('User Group Rights tab', [
    panel.getByRole('tab', { name: /user group rights/i }),
    panel.getByText(/user group rights/i),
  ], 8_000);

  const rightsArea = await waitForFirstVisible([
    panel.locator('[role="tabpanel"]').filter({ hasText: /root|nexuslink|user group rights/i }).first(),
    panel.locator('div').filter({ hasText: /root|nexuslink|user group rights/i }).first(),
  ], 10_000);

  if (!rightsArea) {
    throw new Error('Could not find User Group Rights area.');
  }

  const nexuslinkVisible = await rightsArea.getByText(/^Nexuslink$/i).isVisible().catch(() => false);
  if (!nexuslinkVisible) {
    const rootRow = await waitForFirstVisible([
      rightsArea.getByText(/^Root$/i),
      panel.getByText(/^Root$/i),
    ], 8_000);

    if (!rootRow) {
      throw new Error('Could not find Root node in User Group Rights.');
    }

    const expandControl = await waitForFirstVisible([
      rootRow.locator('button[aria-label*="expand" i], button[title*="expand" i], button').first(),
      rootRow.locator('svg, .material-icons').first(),
    ], 2_000);

    if (expandControl) {
      await expandControl.click({ force: true }).catch(() => {});
    } else {
      await rootRow.click().catch(() => {});
    }
  }

  await ensureUserRightChecked(page, panel, 'Nexuslink');

  await clickFirstVisible('Save user rights', [
    panel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ], 8_000);

  return expectMessage(page, 'update user rights', /success|saved|updated/i);
}

async function createReservation(page: Page, asset: AssignmentResult): Promise<string> {
  await openCarSharingPage(page);

  await clickFirstVisible('Add Reservation button', [
    page.getByRole('button', { name: /add reservation/i }),
    page.getByText(/add reservation/i),
  ], 10_000);

  const panel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /add reservation/i }),
    page.getByRole('dialog', { name: /add reservation/i }),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('button', { name: /search assets/i }) })
      .first(),
  ], 20_000);

  if (!panel) {
    throw new Error('Could not open Add Reservation panel.');
  }

  await clickFirstVisible('Search Assets button', [
    panel.getByRole('button', { name: /search assets/i }),
    page.getByRole('button', { name: /search assets/i }),
  ], 8_000);

  const assetPicker = await waitForFirstVisible([
    page.getByRole('dialog').filter({ hasText: /search assets|select asset|assets/i }).first(),
    page.getByRole('complementary').filter({ hasText: /search assets|select asset|assets/i }).first(),
  ], 15_000);

  if (assetPicker) {
    const searchInput = await waitForFirstVisible([
      assetPicker.getByRole('textbox', { name: /search/i }),
      assetPicker.getByPlaceholder(/search/i),
      assetPicker.locator('input[type="text"]').first(),
    ], 3_000);

    if (searchInput) {
      await searchInput.click();
      await searchInput.press('ControlOrMeta+a').catch(() => {});
      await searchInput.fill(asset.assetSearchValue);
    }
  }

  await clickFirstVisible(`Assigned asset ${asset.assetSearchValue}`, [
    page.getByText(new RegExp(escapeRegex(asset.assetLabel), 'i')).first(),
    page.getByText(new RegExp(escapeRegex(asset.assetSearchValue), 'i')).first(),
    page.getByRole('row', { name: new RegExp(escapeRegex(asset.assetSearchValue), 'i') }).first(),
    page.locator('tr', { hasText: new RegExp(escapeRegex(asset.assetSearchValue), 'i') }).first(),
  ], 15_000);

  await clickFirstVisible('Save reservation', [
    panel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ], 10_000);

  const successMessage = await expectMessage(page, 'create reservation', /success|saved|created/i, 10_000);

  const listViewButton = await waitForFirstVisible([
    page.getByTitle(/list view/i),
    page.getByRole('button', { name: /list view/i }),
  ], 3_000);
  if (listViewButton) {
    await listViewButton.click().catch(() => {});
  }

  await expect(
    await waitForFirstVisible([
      page.getByRole('row', { name: new RegExp(escapeRegex(asset.assetSearchValue), 'i') }),
      page.locator('tr', { hasText: new RegExp(escapeRegex(asset.assetSearchValue), 'i') }),
      page.getByText(new RegExp(escapeRegex(asset.assetSearchValue), 'i')),
    ], 20_000),
  ).not.toBeNull();

  return successMessage;
}

async function deleteReservationIfPresent(page: Page, assetSearchValue: string): Promise<void> {
  await openCarSharingPage(page);

  const listViewButton = await waitForFirstVisible([
    page.getByTitle(/list view/i),
    page.getByRole('button', { name: /list view/i }),
  ], 3_000);
  if (listViewButton) {
    await listViewButton.click().catch(() => {});
  }

  const reservationRow = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(assetSearchValue), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(assetSearchValue), 'i') }),
  ], 8_000);

  if (!reservationRow) {
    return;
  }

  await clickFirstVisible(`Delete reservation for ${assetSearchValue}`, [
    reservationRow.getByRole('button', { name: /^delete$/i }),
    reservationRow.getByRole('button', { name: /delete/i }),
    page.getByRole('button', { name: /^delete$/i }).first(),
  ], 8_000);

  const dialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm deletion|delete/i }),
    page.locator('[role="dialog"]:has-text("delete")'),
  ], 8_000);

  if (!dialog) {
    return;
  }

  await clickFirstVisible('Confirm reservation delete', [
    dialog.getByRole('button', { name: /^delete$/i }),
    page.getByRole('button', { name: /^delete$/i }),
  ], 8_000);

  await maybeReadMessage(page, /success|deleted|removed/i, 5_000);
}

async function unassignAssetIfPresent(page: Page, groupName: string, assetLabel: string): Promise<void> {
  await openAdminMenu(page);
  await openAssetPoolsPage(page);
  await selectAssetPoolGroup(page, groupName);

  const assetRow = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(assetLabel), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(assetLabel), 'i') }),
    page.getByText(new RegExp(escapeRegex(assetLabel), 'i')),
  ], 8_000);

  if (!assetRow) {
    return;
  }

  await clickFirstVisible(`Unassign asset ${assetLabel}`, [
    page.getByRole('button', { name: /^delete$/i }),
    page.getByRole('button', { name: /delete/i }),
    assetRow.getByRole('button', { name: /delete|unassign/i }),
  ], 8_000);

  const dialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm unassign|confirm deletion|unassign/i }),
    page.locator('[role="dialog"]:has-text("Unassign"), [role="dialog"]:has-text("delete")').first(),
  ], 8_000);

  if (!dialog) {
    return;
  }

  await clickFirstVisible('Confirm asset unassign', [
    dialog.getByRole('button', { name: /unassign|delete/i }),
    page.getByRole('button', { name: /unassign|delete/i }),
  ], 8_000);

  await maybeReadMessage(page, /success|deleted|removed|unassigned/i, 5_000);
}

async function deleteAssetPoolGroupIfPresent(page: Page, groupName: string): Promise<void> {
  await openAdminMenu(page);
  await openAssetPoolsPage(page);

  const groupItemVisible = await getAssetPoolGroupItem(page, groupName).isVisible().catch(() => false);
  if (!groupItemVisible) {
    return;
  }

  await openGroupActions(page, groupName);
  await clickFirstVisible(`Delete group ${groupName}`, [
    page.getByRole('menuitem', { name: /^delete$/i }),
    page.getByRole('listitem', { name: /^delete$/i }),
    page.getByText(/^Delete$/),
  ], 8_000);

  const dialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm deletion|delete/i }),
    page.locator('[role="dialog"]:has-text("delete")'),
  ], 8_000);

  if (!dialog) {
    return;
  }

  await clickFirstVisible('Confirm delete asset pool group', [
    dialog.getByRole('button', { name: /^delete$/i }),
    page.getByRole('button', { name: /^delete$/i }),
  ], 8_000);

  await maybeReadMessage(page, /success|deleted|removed/i, 5_000);
}

test('Asset Pool workflow with asset assignment, rights update, and reservation', async ({ page }, testInfo) => {
  const initialGroupName = `AssetPool${generateAlphaString(6)}`;
  const updatedGroupName = `${initialGroupName}Edit`;
  const resultRows: string[][] = [];

  let createdGroupName: string | null = null;
  let assignedAsset: AssignmentResult | null = null;
  let reservationCreated = false;

  const generatedDataTable = buildGeneratedDataTable(initialGroupName, updatedGroupName);
  console.log(generatedDataTable);
  await testInfo.attach('asset-pool-generated-data-table', {
    body: Buffer.from(generatedDataTable, 'utf-8'),
    contentType: 'text/plain',
  });

  try {
    await login(page);
    await openAdminMenu(page);
    await openAssetPoolsPage(page);

    // Create a fresh group for the workflow.
    const createMessage = await createAssetPoolGroup(page, initialGroupName);
    createdGroupName = initialGroupName;
    resultRows.push(['Create Group', initialGroupName, 'Passed', createMessage]);

    // Rename the new group before using it downstream.
    const editMessage = await editGroup(page, initialGroupName, updatedGroupName);
    createdGroupName = updatedGroupName;
    resultRows.push(['Edit Group', updatedGroupName, 'Passed', editMessage]);

    await selectAssetPoolGroup(page, updatedGroupName);

    // Retry assignment when an asset is already reserved by another pool.
    assignedAsset = await assignAssetWithRetry(page, MAX_ASSET_ASSIGN_RETRIES);
    resultRows.push([
      'Assign Asset',
      assignedAsset.assetLabel,
      'Passed',
      `${assignedAsset.successMessage} | Attempts: ${assignedAsset.attempts}`,
    ]);

    const rightsMessage = await updateUserRights(page, updatedGroupName);
    resultRows.push(['Update Rights', 'Nexuslink', 'Passed', rightsMessage]);

    const reservationMessage = await createReservation(page, assignedAsset);
    reservationCreated = true;
    resultRows.push(['Create Reservation', assignedAsset.assetSearchValue, 'Passed', reservationMessage]);
  } catch (error) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('asset-pool-workflow-failure', {
      body: screenshot,
      contentType: 'image/png',
    });
    throw error;
  } finally {
    if (reservationCreated && assignedAsset) {
      await deleteReservationIfPresent(page, assignedAsset.assetSearchValue).catch((error) => {
        console.log(`Cleanup warning (reservation delete): ${String(error)}`);
      });
    }

    if (createdGroupName && assignedAsset) {
      await unassignAssetIfPresent(page, createdGroupName, assignedAsset.assetLabel).catch((error) => {
        console.log(`Cleanup warning (asset unassign): ${String(error)}`);
      });
    }

    if (createdGroupName) {
      await deleteAssetPoolGroupIfPresent(page, createdGroupName).catch((error) => {
        console.log(`Cleanup warning (group delete): ${String(error)}`);
      });
    }

    const summaryTable = buildSummaryTable(
      resultRows.length
        ? resultRows
        : [['Workflow', initialGroupName, 'Failed', 'No successful steps were recorded.']],
    );
    console.log(summaryTable);
    await testInfo.attach('asset-pool-workflow-summary-table', {
      body: Buffer.from(summaryTable, 'utf-8'),
      contentType: 'text/plain',
    });
  }
});
