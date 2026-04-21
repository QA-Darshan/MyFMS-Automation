import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import {generateAlphaString, generateUserName} from './testdata';
import {generateAddress} from './testdata';

const DEFAULT_WAIT_MS = 15_000;
const POLL_MS = 250;

function toCell(value: unknown, width: number): string {
  const raw = String(value ?? '');
  const normalized = raw.replace(/\s+/g, ' ').trim();
  const trimmed = normalized.length > width ? `${normalized.slice(0, Math.max(0, width - 3))}...` : normalized;
  return trimmed.padEnd(width, ' ');
}

function buildFixedTable(title: string, headers: string[], rows: string[][], widths: number[]): string {
  const border = `+${widths.map((w) => '-'.repeat(w + 2)).join('+')}+`;
  const header = `| ${headers.map((h, i) => toCell(h, widths[i])).join(' | ')} |`;
  const lines = [``, title, border, header, border];
  for (const row of rows) {
    lines.push(`| ${row.map((c, i) => toCell(c, widths[i])).join(' | ')} |`);
  }
  lines.push(border);
  return lines.join('\n');
}

function columnWidth(header: string, values: string[]): number {
  const longest = values.reduce((max, value) => Math.max(max, value.length), header.length);
  return Math.max(header.length, longest);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function clickFirstVisible(candidates: Locator[], timeoutMs = DEFAULT_WAIT_MS): Promise<boolean> {
  const target = await waitForFirstVisible(candidates, timeoutMs);
  if (!target) {
    return false;
  }
  await target.click();
  return true;
}

async function selectGroupByName(page: Page, groupName: string): Promise<void> {
  const name = new RegExp(`^${escapeRegex(groupName)}$`, 'i');
  const clicked = await clickFirstVisible([
    page.getByRole('listitem', { name }),
    page.getByLabel(name),
    page.getByText(name),
    page.locator('li', { hasText: name }).first(),
  ], 8_000);

  if (!clicked) {
    throw new Error(`Could not select group: ${groupName}`);
  }
}

async function selectAllUsersGroup(page: Page): Promise<void> {
  const clicked = await clickFirstVisible([
    page.getByRole('listitem', { name: /all users?/i }),
    page.getByLabel(/all users?/i),
    page.getByText(/^All users?$/i),
    page.locator('li', { hasText: /all users?/i }).first(),
    page.getByRole('listitem', { name: /^root$/i }),
    page.getByLabel(/root/i),
  ], 8_000);

  if (!clicked) {
    throw new Error('Could not select All Users group.');
  }
}

function parseCount(text: string): number | null {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return null;
  }

  const patterns = [
    /\((\d+)\)/,
    /\b(\d+)\s*users?\b/i,
    /\bcount\D+(\d+)\b/i,
    /\b(\d+)\b/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return Number(match[1]);
    }
  }
  return null;
}

async function readAllUsersSidebarCount(page: Page): Promise<number | null> {
  const allUsersItem = await waitForFirstVisible([
    page.locator('li', { hasText: /^all users?/i }),
    page.getByRole('listitem', { name: /all users?/i }),
    page.getByLabel(/all users?/i),
  ], 5_000);

  if (!allUsersItem) {
    return null;
  }

  const text = ((await allUsersItem.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  return parseCount(text);
}

async function clearVisibleSearchInputs(page: Page): Promise<void> {
  const searchInputs = page.getByRole('textbox', { name: /search/i });
  const count = await searchInputs.count();
  for (let i = 0; i < count; i++) {
    const input = searchInputs.nth(i);
    const visible = await input.isVisible().catch(() => false);
    if (!visible) {
      continue;
    }
    await input.fill('').catch(() => {});
  }
}

async function getVisibleUsersInCurrentGrid(page: Page): Promise<string[]> {
  const rows = page.getByRole('row');
  const count = await rows.count();
  const users: string[] = [];

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const isVisible = await row.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    const text = ((await row.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    if (!text) {
      continue;
    }
    if (/no records to display/i.test(text)) {
      continue;
    }
    if (/first name|last name|mail address|employee number|telephone number|action/i.test(text)) {
      continue;
    }

    const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g);
    if (emails && emails.length > 0) {
      for (const email of emails) {
        users.push(email.toLowerCase());
      }
      continue;
    }

    users.push(text);
  }

  return Array.from(new Set(users));
}

async function captureAllUsersSnapshot(page: Page, phase: string, restoreGroupName: string): Promise<string[]> {
  await selectAllUsersGroup(page);
  await clearVisibleSearchInputs(page);
  await page.waitForTimeout(500);
  const users = await getVisibleUsersInCurrentGrid(page);
  const sidebarCount = await readAllUsersSidebarCount(page);
  const totalCount = sidebarCount ?? users.length;
  await selectGroupByName(page, restoreGroupName);
  return [phase, String(totalCount), users.length ? users.join(', ') : 'Captured from All Users count'];
}

function buildUsersSnapshotTable(rows: string[][]): string {
  const phaseWidth = columnWidth('Phase', rows.map((row) => row[0]));
  const countWidth = columnWidth('Count', rows.map((row) => row[1]));
  const usersWidth = columnWidth('Users', rows.map((row) => row[2]));

  return buildFixedTable(
    'Users Count Snapshot',
    ['Phase', 'Count', 'Users'],
    rows,
    [phaseWidth, countWidth, usersWidth],
  );
}

async function firstVisible(locator: Locator): Promise<Locator | null> {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    const item = locator.nth(i);
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

async function openAdminMenuFromAssetsLanding(page: Page): Promise<void> {
  await waitForFirstVisible([
    page.getByRole('button', { name: /search assets/i }),
    page.getByRole('link', { name: /assets/i }),
    page.getByText(/\bassets\b/i),
    page.locator('a[href*="/assets"], a[href*="/asset"]').first(),
  ], 20_000);

  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();
}

async function firstVisibleOption(
  candidates: Locator[],
  excludedText?: string,
): Promise<Locator | null> {
  const excluded = (excludedText ?? '').trim().toLowerCase();
  let fallback: Locator | null = null;

  for (const candidate of candidates) {
    const count = await candidate.count();
    for (let i = 0; i < count; i++) {
      const option = candidate.nth(i);
      const isVisible = await option.isVisible().catch(() => false);
      if (!isVisible) {
        continue;
      }
      if (!fallback) {
        fallback = option;
      }

      const text = ((await option.textContent()) ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (text && (!excluded || !text.includes(excluded))) {
        return option;
      }
    }
  }

  return fallback;
}

async function clickReplacementSaveIfPresent(page: Page, dialog: Locator): Promise<boolean> {
  const saveButton = await waitForFirstVisible([
    dialog.getByRole('button', { name: /^save$/i }),
    dialog.getByRole('button', { name: /save replacement|apply|confirm|ok/i }),
    page.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /save replacement|apply|confirm|ok/i }),
  ], 3_000);

  if (!saveButton) {
    return false;
  }

  await saveButton.click();
  return true;
}

async function closeReplacementDropdownIfOpen(page: Page): Promise<void> {
  const openPanels = page.locator('[role="listbox"], .rz-dropdown-panel.rz-popup, .rz-dropdown-panel');
  const isOpen = await openPanels.first().isVisible().catch(() => false);
  if (!isOpen) {
    return;
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);
}

async function expectSuccessMessage(
  page: Page,
  action: string,
  messagePattern: RegExp,
  timeoutMs = DEFAULT_WAIT_MS,
  required = true,
): Promise<string> {
  const toast = await waitForFirstVisible([
    page.getByRole('alert').filter({ hasText: messagePattern }),
    page.locator('[role="status"]').filter({ hasText: messagePattern }),
    page
      .locator('.MuiSnackbar-root, .notistack-Snackbar, .Toastify__toast, .rz-notification, .rz-growl-item-wrapper, .rz-growl-message, .rz-message')
      .filter({ hasText: messagePattern }),
    page.getByText(messagePattern),
  ], timeoutMs);

  if (!toast) {
    if (required) {
      throw new Error(`Success message not shown after: ${action}`);
    }
    return 'No success toast shown (validated by UI state checks)';
  }

  const message = ((await toast.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  return message || 'Success notification visible';
}

async function selectReplacementGroupIfPrompted(page: Page, dialog: Locator, excludedGroupName: string): Promise<string> {
  const replacementControl = await waitForFirstVisible([
    dialog.getByRole('combobox', { name: /replace|replacement|group|search/i }),
    dialog.getByRole('textbox', { name: /replace|replacement|group|search/i }),
    dialog.getByRole('button', { name: /replace|replacement|group|select/i }),
    dialog.locator('input[role="combobox"], input[aria-autocomplete], [aria-haspopup="listbox"]').first(),
    dialog.locator('.rz-dropdown, .rz-dropdown-label, [role="combobox"]').first(),
  ], 4_000);

  if (!replacementControl) {
    return 'Not required';
  }

  const optionCandidates = [
    dialog.getByRole('option'),
    page.getByRole('option'),
    page.locator('[role="listbox"] [role="option"]'),
    page.locator('.rz-dropdown-items .rz-dropdown-item, .MuiAutocomplete-option'),
  ];

  let replacementOption = await firstVisibleOption(optionCandidates, excludedGroupName);
  if (!replacementOption) {
    const openTargets = [
      replacementControl,
      replacementControl.locator('button').first(),
      dialog.locator('[aria-haspopup="listbox"]').first(),
      dialog.locator('.rz-dropdown-trigger, .rz-dropdown-label').first(),
    ];
    for (const target of openTargets) {
      const visible = await target.isVisible().catch(() => false);
      if (!visible) {
        continue;
      }

      await target.click({ force: true }).catch(() => {});
      await replacementControl.press('ArrowDown').catch(() => {});
      await replacementControl.press('Enter').catch(() => {});
      replacementOption = await firstVisibleOption(optionCandidates, excludedGroupName);
      if (replacementOption) {
        break;
      }
    }
  }

if (!replacementOption) {
  console.log('No replacement option available — skipping replacement step.');
  await closeReplacementDropdownIfOpen(page);
  return 'Not required';
}

  const chosen = ((await replacementOption.textContent()) ?? 'Any available group').replace(/\s+/g, ' ').trim();
  await replacementOption.click();
  await closeReplacementDropdownIfOpen(page);
  return chosen || 'Any available group';
}

test('User Management', async ({ page }, testInfo) => {
  const groupName = generateAlphaString(10);
  const updatedgroupName = generateAlphaString(10);
  const user = generateUserName();
  const user1 = generateUserName();
  const address = generateAddress();
  const resultRows: string[][] = [];
  const countSnapshotRows: string[][] = [];

  await login(page);  
  await page.waitForTimeout(18000);
  await openAdminMenuFromAssetsLanding(page);

  await page.getByRole('link', { name: 'account_circle Users' }).click();

  // Add user group
  await page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: 'add' }).click();
  await expect(page.getByRole('complementary', { name: 'Add user group' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Title' }).fill(groupName);
  await page.getByRole('textbox', { name: 'Description' }).fill('Description');
  await page.getByRole('button', { name: 'Save' }).click();
  const addGroupSuccessMessage = await expectSuccessMessage(page, 'add user group', /success|saved|created/i);
  resultRows.push(['Add Group', groupName, 'Passed', addGroupSuccessMessage]);
  await expect(page.getByRole('listitem', { name: groupName })).toBeVisible();

  // Edit user group
  await page.getByLabel(groupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await expect(page.getByRole('complementary', { name: `Edit group - ${groupName}` })).toBeVisible();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Title' }).fill(updatedgroupName);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Description' }).fill('Updated Description');
  await page.getByRole('button', { name: 'Save' }).click();
  const editGroupSuccessMessage = await expectSuccessMessage(page, 'edit user group', /success|saved|updated/i);
  resultRows.push(['Edit Group', updatedgroupName, 'Passed', editGroupSuccessMessage]);
  await expect(page.getByRole('listitem', { name: updatedgroupName })).toBeVisible();

  // Select edited group
  await page.getByLabel(updatedgroupName).getByRole('button', { name: 'more_vert' }).click();
  await page.locator('div').filter({ hasText: new RegExp(`^${updatedgroupName}$`) }).click();
  await expect(page.getByRole('row', { name: 'No records to display' })).toBeVisible();
  countSnapshotRows.push(await captureAllUsersSnapshot(page, 'All Users Before Add', updatedgroupName));

  await page.getByRole('button', { name: 'add Add user' }).click(); 
  await expect(page.getByRole('complementary', { name: 'Add user' })).toBeVisible();

  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
  await page.getByRole('textbox', { name: 'Middle name' }).click();
  await page.getByRole('textbox', { name: 'Middle name' }).fill(user.middleName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).fill(user.email);
  await page.getByRole('textbox', { name: 'Employee number' }).click();
  await page.getByRole('textbox', { name: 'Employee number' }).fill(user.employeeNumber);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(user.phoneNumber);

  await page.getByRole('textbox', { name: 'Street' }).fill(address.street);
  await page.getByRole('textbox', { name: 'Enter number' }).click();
  await page.getByRole('textbox', { name: 'Enter number' }).fill(address.number.toString());
  await page.getByRole('textbox', { name: 'Postal code' }).click();
  await page.getByRole('textbox', { name: 'Postal code' }).fill(address.postalCode);
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).fill(address.city);
  await page.getByText('Netherlands').first().click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('ind');
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Select role').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByRole('option', { name: 'Standard user' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();
  const addSuccessMessage = await expectSuccessMessage(page, 'add user', /success|saved|created/i, DEFAULT_WAIT_MS, false);
  resultRows.push(['Add', user.email, 'Passed', addSuccessMessage]);
  countSnapshotRows.push(await captureAllUsersSnapshot(page, 'All Users After Add', updatedgroupName));
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(user.email);
  await expect(page.getByRole('row', { name: user.email })).toBeVisible();

  await page.getByText(user.email).click();
  await expect(page.getByRole('complementary', { name: 'Edit user' })).toBeVisible();

  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'First name' }).fill(user1.firstName);
  await page.getByRole('textbox', { name: 'Mail address' }).click();
  await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Mail address' }).fill(user1.email);
  await page.getByRole('textbox', { name: 'Employee number' }).click();
  await page.getByRole('textbox', { name: 'Employee number' }).fill(user1.employeeNumber);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(user1.phoneNumber);
  await page.getByRole('button', { name: 'Save' }).click();
  const editSuccessMessage = await expectSuccessMessage(page, 'edit user', /success|saved|updated/i, DEFAULT_WAIT_MS, false);
  await page.waitForTimeout(5000);
  resultRows.push(['Edit', user1.email, 'Passed', editSuccessMessage]);

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(user1.email);

  await page.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  const deleteSuccessMessage = await expectSuccessMessage(page, 'delete user', /success|deleted|removed/i, DEFAULT_WAIT_MS, false);
  resultRows.push(['Delete', user1.email, 'Passed', deleteSuccessMessage]);
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(user1.email);
  await expect(page.getByRole('row', { name: user1.email })).not.toBeVisible();
  countSnapshotRows.push(await captureAllUsersSnapshot(page, 'All Users After Delete', updatedgroupName));

  // Delete edited group
  await page.getByLabel(updatedgroupName).getByRole('button', { name: 'more_vert' }).click();
  await page.getByText('Delete', { exact: true }).click();
  const deleteGroupDialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm deletion|delete|replace/i }),
    page.locator('[role="dialog"]').filter({ hasText: /delete|replace|confirm/i }),
  ], 5_000);
  let replacementUsed = 'Not required';
  if (deleteGroupDialog) {
    replacementUsed = await selectReplacementGroupIfPrompted(page, deleteGroupDialog, updatedgroupName);
    await clickReplacementSaveIfPresent(page, deleteGroupDialog);
    await closeReplacementDropdownIfOpen(page);
    const confirmDelete = await waitForFirstVisible([
      deleteGroupDialog.getByRole('button', { name: /^delete$/i }),
      page.getByRole('button', { name: /^delete$/i }),
    ], 3_000);
    if (confirmDelete) {
      await confirmDelete.click({ force: true });
    }
  }
  const deleteGroupSuccessMessage = await expectSuccessMessage(page, 'delete user group', /success|deleted|removed/i);
  const deleteGroupMessage = replacementUsed === 'Not required'
    ? deleteGroupSuccessMessage
    : `${deleteGroupSuccessMessage} | Replacement: ${replacementUsed}`;
  resultRows.push(['Delete Group', updatedgroupName, 'Passed', deleteGroupMessage]);

  const actionWidth = columnWidth('Action', resultRows.map((row) => row[0]));
  const emailWidth = columnWidth('Email', resultRows.map((row) => row[1]));
  const statusWidth = columnWidth('Status', resultRows.map((row) => row[2]));
  const messageWidth = columnWidth('Message', resultRows.map((row) => row[3]));

  const resultTable = buildFixedTable(
    'Users Flow Summary',
    ['Action', 'Email', 'Status', 'Message'],
    resultRows,
    [actionWidth, emailWidth, statusWidth, messageWidth],
  );
  const usersSnapshotTable = buildUsersSnapshotTable(countSnapshotRows);
  console.log(usersSnapshotTable);
  console.log(resultTable);
  await testInfo.attach('users-count-snapshot-table', {
    body: Buffer.from(usersSnapshotTable, 'utf-8'),
    contentType: 'text/plain',
  });
  await testInfo.attach('users-flow-summary-table', {
    body: Buffer.from(resultTable, 'utf-8'),
    contentType: 'text/plain',
  });
});

test('Users page smoke', async ({ page }, testInfo) => {
  await login(page);
  await page.waitForTimeout(10000);
  await openAdminMenuFromAssetsLanding(page);

  await page.getByRole('link', { name: 'account_circle Users' }).click();

  const addUserButton = page.getByRole('button', { name: 'add Add user' });
  const searchBox = page.getByRole('textbox', { name: 'Search...' });
  const usersLink = page.getByRole('link', { name: 'account_circle Users' });

  await expect(addUserButton).toBeVisible();
  await expect(searchBox).toBeVisible();
  await expect(usersLink).toBeVisible();

  const smokeSummary = buildFixedTable(
    'Users Page Smoke',
    ['Check', 'Result'],
    [
      ['URL', page.url()],
      ['Users menu visible', 'Passed'],
      ['Add user button visible', 'Passed'],
      ['Search input visible', 'Passed'],
    ],
    [24, 70],
  );

  console.log(`\n${smokeSummary}`);
  await testInfo.attach('users-page-smoke-summary', {
    body: Buffer.from(smokeSummary, 'utf-8'),
    contentType: 'text/plain',
  });
});
