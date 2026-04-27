import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { generateRFIDData } from './testdata';

const DEFAULT_WAIT_MS = 15_000;
const POLL_MS = 250;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function buildGeneratedRfidDataTable(
  groupName: string,
  updatedGroupName: string,
  createdRfid: ReturnType<typeof generateRFIDData>,
  editedRfid: ReturnType<typeof generateRFIDData>,
): string {
  const rows = [
    ['RFID Group', groupName, updatedGroupName],
    ['Identification code', createdRfid.generateRFID, editedRfid.generateRFID],
    ['Alias', createdRfid.generateAlias, editedRfid.generateAlias],
    ['Third-party ID', createdRfid.generateThirdpartyID, editedRfid.generateThirdpartyID],
  ];

  return buildFixedTable('Generated RFID Flow Data', ['Field', 'Add', 'Edit'], rows, [20, 28, 28]);
}

function buildRfidFlowSummaryTable(rows: string[][]): string {
  return buildFixedTable(
    'RFID Flow Summary',
    ['Action', 'Value', 'Status', 'Message'],
    rows,
    [14, 28, 10, 70],
  );
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

async function expectSuccessMessage(page: Page, action: string, messagePattern: RegExp): Promise<string> {
  const toast = await waitForFirstVisible([
    page.getByRole('alert').filter({ hasText: messagePattern }),
    page.locator('[role="status"]').filter({ hasText: messagePattern }),
    page
      .locator('.MuiSnackbar-root, .notistack-Snackbar, .Toastify__toast, .rz-notification, .rz-growl-item-wrapper, .rz-growl-message, .rz-message')
      .filter({ hasText: messagePattern }),
    page.getByText(messagePattern),
  ]);

  if (!toast) {
    throw new Error(`Success message not shown after: ${action}`);
  }

  const message = ((await toast.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  return message || 'Success notification visible';
}

async function selectRfidGroup(page: Page, groupName: string): Promise<void> {
  const group = await waitForFirstVisible([
    page.getByRole('listitem', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')),
    page.locator('div').filter({ hasText: new RegExp(`^${escapeRegex(groupName)}$`) }),
    page.getByText(groupName, { exact: true }),
  ]);

  if (!group) {
    throw new Error(`Unable to find RFID group: ${groupName}`);
  }

  await group.click();
}

async function searchRfid(page: Page, value: string): Promise<void> {
  const searchBox = page.getByRole('textbox', { name: 'Search...' }).first();
  await searchBox.click();
  await searchBox.press('ControlOrMeta+a');
  await searchBox.fill(value);
}

test('RFID group and RFID management', async ({ page }, testInfo) => {
  const groupName = `Testrfid${Date.now()}`;
  const updatedGroupName = `Updatedrfid${Date.now()}`;
  const createdRfid = generateRFIDData();
  const editedRfid = generateRFIDData();

  let addGroupSuccessMessage = 'Not executed';
  let editGroupSuccessMessage = 'Not executed';
  let addRfidSuccessMessage = 'Not executed';
  let editRfidSuccessMessage = 'Not executed';
  let deleteRfidSuccessMessage = 'Not executed';
  let deleteGroupSuccessMessage = 'Not executed';

  const generatedDataTable = buildGeneratedRfidDataTable(groupName, updatedGroupName, createdRfid, editedRfid);
  console.log(generatedDataTable);
  await testInfo.attach('generated-rfid-data-table', {
    body: Buffer.from(generatedDataTable, 'utf-8'),
    contentType: 'text/plain',
  });

  try {
    await login(page);
    await page.waitForTimeout(8000);
    await page.getByText('Admin').click();
    await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'credit_card RFID\'s' }).click();

    await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
    await expect(page.getByRole('complementary', { name: 'Add RFID group' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
    await page.getByRole('button', { name: 'Save' }).click();
    addGroupSuccessMessage = await expectSuccessMessage(page, 'add RFID group', /success|saved|created/i);
    await expect(page.getByRole('listitem', { name: groupName })).toBeVisible();

    await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
    await page.getByText('Edit', { exact: true }).click();
    await expect(page.getByRole('complementary', { name: `Edit RFID group - ${groupName}` })).toBeVisible();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: 'Title' }).fill(updatedGroupName);
    await page.getByRole('button', { name: 'Save' }).click();
    editGroupSuccessMessage = await expectSuccessMessage(page, 'edit RFID group', /success|saved|updated/i);
    await expect(page.getByRole('listitem', { name: updatedGroupName })).toBeVisible();

    await selectRfidGroup(page, updatedGroupName);
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'add Add RFID' }).click();
    await expect(page.getByRole('complementary', { name: 'Add RFID' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Identification code' }).fill(createdRfid.generateRFID);
    await page.getByPlaceholder('Enter alias').fill(createdRfid.generateAlias);
    await page.getByPlaceholder('Enter Third-party ID').fill(createdRfid.generateThirdpartyID);
    await page.getByRole('button', { name: 'Save' }).click();
    addRfidSuccessMessage = await expectSuccessMessage(page, 'add RFID', /success|saved|created/i);

    await searchRfid(page, createdRfid.generateRFID);
    const createdRow = page.getByRole('row', { name: new RegExp(escapeRegex(createdRfid.generateRFID), 'i') });
    await expect(createdRow).toBeVisible();
    await page.getByText(createdRfid.generateRFID, { exact: true }).click();
    await expect(page.getByRole('complementary', { name: 'Edit RFID' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Identification code' }).click();
    await page.getByRole('textbox', { name: 'Identification code' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: 'Identification code' }).fill(editedRfid.generateRFID);
    await page.getByPlaceholder('Enter alias').click();
    await page.getByPlaceholder('Enter alias').press('ControlOrMeta+a');
    await page.getByPlaceholder('Enter alias').fill(editedRfid.generateAlias);
    await page.getByPlaceholder('Enter Third-party ID').click();
    await page.getByPlaceholder('Enter Third-party ID').press('ControlOrMeta+a');
    await page.getByPlaceholder('Enter Third-party ID').fill(editedRfid.generateThirdpartyID);
    await page.getByRole('button', { name: 'Save' }).click();
    editRfidSuccessMessage = await expectSuccessMessage(page, 'edit RFID', /success|saved|updated/i);

    await searchRfid(page, editedRfid.generateRFID);
    const editedRow = page.getByRole('row', { name: new RegExp(escapeRegex(editedRfid.generateRFID), 'i') });
    await expect(editedRow).toBeVisible();
    const deleteButton = await waitForFirstVisible([
      editedRow.getByRole('button', { name: /^delete$/i }),
      page.getByRole('button', { name: /^delete$/i }),
    ], 5_000);

    if (!deleteButton) {
      throw new Error(`Unable to find delete button for RFID: ${editedRfid.generateRFID}`);
    }

    await deleteButton.click();
    await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    deleteRfidSuccessMessage = await expectSuccessMessage(page, 'delete RFID', /success|deleted|removed/i);
    await searchRfid(page, editedRfid.generateRFID);
    await expect(page.getByRole('row', { name: new RegExp(escapeRegex(editedRfid.generateRFID), 'i') })).not.toBeVisible();

    await page.getByLabel(updatedGroupName).getByRole('button', { name: 'more_vert' }).click();
    await page.getByText('Delete', { exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    deleteGroupSuccessMessage = await expectSuccessMessage(page, 'delete RFID group', /success|deleted|removed/i);
  } finally {
    const summaryTable = buildRfidFlowSummaryTable([
      ['Add Group', groupName, addGroupSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', addGroupSuccessMessage],
      ['Edit Group', updatedGroupName, editGroupSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', editGroupSuccessMessage],
      ['Add RFID', createdRfid.generateRFID, addRfidSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', addRfidSuccessMessage],
      ['Edit RFID', editedRfid.generateRFID, editRfidSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', editRfidSuccessMessage],
      ['Delete RFID', editedRfid.generateRFID, deleteRfidSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', deleteRfidSuccessMessage],
      ['Delete Group', updatedGroupName, deleteGroupSuccessMessage === 'Not executed' ? 'Pending' : 'Passed', deleteGroupSuccessMessage],
    ]);

    console.log(summaryTable);
    await testInfo.attach('rfid-flow-summary-table', {
      body: Buffer.from(summaryTable, 'utf-8'),
      contentType: 'text/plain',
    });
  }
});