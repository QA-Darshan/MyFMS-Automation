import { test, expect, type Locator, type Page } from '@playwright/test';
import { login } from './login';

const DEFAULT_WAIT_MS = 20_000;
const POLL_MS = 250;

type CostCenterData = {
  name: string;
  code: string;
  description: string;
};

function formatGroupResult(label: string, groupName: string, fromName?: string): string {
  return [
    '',
    `========== ${label} ==========`,
    fromName ? `From Group     : ${fromName}` : null,
    `Group Name     : ${groupName}`,
    '================================',
  ].filter(Boolean).join('\n');
}

function formatCostCenterResult(label: string, data: CostCenterData, fromName?: string): string {
  return [
    '',
    `========== ${label} ==========`,
    fromName ? `From Name      : ${fromName}` : null,
    `Name           : ${data.name}`,
    `Code           : ${data.code}`,
    `Description    : ${data.description}`,
    '================================',
  ].filter(Boolean).join('\n');
}

function formatCountResult(label: string, beforeCount: number, afterCount: number): string {
  return [
    '',
    `========== ${label} ==========`,
    `Before Count   : ${beforeCount}`,
    `After Count    : ${afterCount}`,
    `Difference     : ${afterCount - beforeCount}`,
    '================================',
  ].join('\n');
}

function formatStatusCountResult(activeCount: number, inactiveCount: number): string {
  return [
    '',
    '========== COST CENTER STATUS COUNTS ==========',
    `Active Count   : ${activeCount}`,
    `Inactive Count : ${inactiveCount}`,
    '===============================================',
  ].join('\n');
}

async function expectSuccessMessage(
  page: Page,
  actionName: string,
  timeoutMs = 15_000,
  required = true,
): Promise<boolean> {
  const successPattern = /success|saved|created|updated|deleted/i;
  const toast = await waitForFirstVisible([
    page.getByRole('alert').filter({ hasText: successPattern }),
    page.locator('[role="status"]').filter({ hasText: successPattern }),
    page
      .locator('.MuiSnackbar-root, .notistack-Snackbar, .Toastify__toast, .rz-notification, .rz-growl-item-wrapper, .rz-growl-message, .rz-message')
      .filter({ hasText: successPattern }),
    page.getByText(successPattern),
  ], timeoutMs);

  if (!toast) {
    if (required) {
      throw new Error(`Success message not shown after: ${actionName}`);
    }
    console.log(`Success message (${actionName}): not shown (fallback validation will be used).`);
    return false;
  }

  const message = ((await toast.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  console.log(`Success message (${actionName}): ${message || 'visible success notification'}`);
  return true;
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

async function clickFirstVisible(actionName: string, candidates: Locator[]): Promise<void> {
  const target = await waitForFirstVisible(candidates);
  if (!target) {
    throw new Error(`Could not find clickable element for: ${actionName}`);
  }
  await target.click();
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

async function fillOptionalVisible(candidates: Locator[], value: string): Promise<void> {
  const target = await waitForFirstVisible(candidates, 3_000);
  if (!target) {
    return;
  }
  await target.click();
  await target.press('ControlOrMeta+a').catch(() => {});
  await target.fill(value);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function randomLetters(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = '';
  for (let i = 0; i < length; i++) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

function createShortGroupName(): string {
  const meaningfulWords = ['Ops', 'Sales', 'HR', 'IT', 'Finance', 'Admin'];
  const word = meaningfulWords[Math.floor(Math.random() * meaningfulWords.length)];
  const suffix = randomLetters(3);
  return `${word} ${suffix}`;
}

function createCostCenterData(prefix: string): CostCenterData {
  const normalizedPrefix = prefix.replace(/[^a-zA-Z]/g, '').slice(0, 6) || 'Core';
  const nameSuffix = randomLetters(4);
  const codeSuffix = randomLetters(5);
  return {
    name: `${normalizedPrefix} CC ${nameSuffix}`,
    code: `${normalizedPrefix.slice(0, 3).toUpperCase()}${codeSuffix}`,
    description: `${normalizedPrefix} cost center ${randomLetters(4)}`,
  };
}

async function readCheckedState(control: Locator): Promise<boolean | null> {
  try {
    return await control.isChecked();
  } catch {
    try {
      return await control.evaluate((el) => {
        if (el instanceof HTMLInputElement) {
          return el.checked;
        }
        const ariaChecked = el.getAttribute('aria-checked');
        if (ariaChecked) {
          return ariaChecked === 'true';
        }
        return /checked|selected|active/i.test(el.className || '');
      });
    } catch {
      return null;
    }
  }
}

async function openCostCenterPage(page: Page): Promise<void> {
  await login(page, { url: 'https://test-portal.myfms.com' });
  await page.waitForTimeout(5_000);

  const adminMenu = await waitForFirstVisible([
    page.locator('li:has-text("Admin") >> visible=true'),
    page.locator('li:has-text("Admin")'),
    page.getByRole('link', { name: /^admin$/i }),
    page.getByRole('button', { name: /^admin$/i }),
    page.getByText(/admin/i),
  ], 8_000);
  if (adminMenu) {
    await adminMenu.click();
  }

  const costCenterLink = page.locator('a[href*="/admin/costcenter"], a[href*="/admin/costcenters"]').first();
  if (await costCenterLink.isVisible().catch(() => false)) {
    await costCenterLink.click();
  } else {
    const costCenterMenuItem = await waitForFirstVisible([
      page.getByRole('link', { name: /cost centers?/i }),
      page.getByRole('listitem', { name: /cost centers?/i }),
      page.getByRole('button', { name: /cost centers?/i }),
      page.getByText(/cost centers?/i),
    ], 8_000);
    if (costCenterMenuItem) {
      await costCenterMenuItem.click();
    }
  }

  if (!/\/admin\/costcenter(s)?(\/|$)/i.test(page.url())) {
    await page.goto('https://test-portal.myfms.com/admin/costcenters', { waitUntil: 'domcontentloaded' });
  }
  await expect(page).toHaveURL(/\/admin\/costcenter(s)?(\/|$)/i, { timeout: 30_000 });
}

function getGroupListItem(page: Page, groupName: string): Locator {
  return page.locator('li', {
    has: page.getByRole('heading', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
  }).first();
}

async function selectGroup(page: Page, groupName: string): Promise<void> {
  await clickFirstVisible(`Group ${groupName}`, [
    page.getByRole('listitem', { name: new RegExp(`\\b${escapeRegex(groupName)}\\b`, 'i') }),
    page.getByRole('heading', { name: new RegExp(`^${escapeRegex(groupName)}$`, 'i') }),
    page.getByLabel(new RegExp(escapeRegex(groupName), 'i')),
  ]);
}

async function createGroup(page: Page, groupName: string): Promise<void> {
  await clickFirstVisible('Add group (+) from left panel', [
    page.getByLabel(/root/i).getByRole('button', { name: /^add$/i }),
    page.getByLabel('<span class=\'unitforecolor\'>Root</span>').getByRole('button', { name: /^add$/i }),
    page.locator('li:has(h6:has-text("Root")) button:has-text("add")'),
    page.locator('li:has-text("Root") button:has-text("add")'),
  ]);

  const addGroupPanel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /add.*group|add.*cost center/i }),
    page.getByRole('dialog', { name: /add.*group|add.*cost center/i }),
    page.locator('[role="complementary"]:has-text("Add"), [role="dialog"]:has-text("Add")'),
  ], 20_000);
  if (!addGroupPanel) {
    throw new Error('Could not open Add Cost Center group panel.');
  }

  await fillFirstVisible('Group Title', [
    addGroupPanel.getByRole('textbox', { name: /^title$/i }),
    addGroupPanel.getByRole('textbox', { name: /title|name/i }),
  ], groupName);
  await fillOptionalVisible([
    addGroupPanel.getByRole('textbox', { name: /description/i }),
  ], `Group for ${groupName}`);

  await clickFirstVisible('Save group', [
    addGroupPanel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ]);
  await expectSuccessMessage(page, 'create group');

  await expect(getGroupListItem(page, groupName)).toBeVisible({ timeout: 20_000 });
}

async function openGroupActions(page: Page, groupName: string): Promise<void> {
  const groupRow = getGroupListItem(page, groupName);
  await expect(groupRow).toBeVisible({ timeout: 20_000 });
  await groupRow.scrollIntoViewIfNeeded().catch(() => {});

  await clickFirstVisible(`Action menu for group ${groupName}`, [
    page.getByLabel(new RegExp(`^${escapeRegex(groupName)}$`, 'i')).getByRole('button', { name: /more_vert/i }),
    groupRow.getByRole('button', { name: /more_vert|more|menu|action/i }),
    groupRow.locator('button[aria-label*="more" i], button[title*="more" i]'),
    page.getByLabel(new RegExp(escapeRegex(groupName), 'i')).getByRole('button', { name: /more_vert|more/i }),
  ]);

  await waitForFirstVisible([
    groupRow.getByText(/^Edit$/),
    groupRow.getByText(/^Delete$/),
    page.getByRole('menuitem', { name: /^edit$/i }),
    page.getByRole('menuitem', { name: /^delete$/i }),
    page.getByRole('listitem', { name: /^edit$/i }),
    page.getByRole('listitem', { name: /^delete$/i }),
  ], 3_000);
}

async function editGroup(page: Page, currentName: string, updatedName: string): Promise<void> {
  await openGroupActions(page, currentName);

  const row = getGroupListItem(page, currentName);
  await clickFirstVisible(`Edit action for group ${currentName}`, [
    row.getByText(/^Edit$/),
    row.getByRole('listitem', { name: /^edit$/i }),
    row.getByRole('menuitem', { name: /^edit$/i }),
    row.locator('[role="menuitem"]:has-text("Edit"), li:has-text("Edit"), [role="listitem"]:has-text("Edit"), div:has-text("Edit")').first(),
    page.locator('[role="menu"] >> text=/^Edit$/').first(),
    page.getByRole('menuitem', { name: /^edit$/i }),
    page.getByRole('listitem', { name: /^edit$/i }),
  ]);

  const editPanel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /edit/i }),
    page.getByRole('dialog', { name: /edit/i }),
    page.locator('[role="complementary"]:has-text("Edit"), [role="dialog"]:has-text("Edit")').first(),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('textbox', { name: /title|name/i }) })
      .first(),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .filter({ has: page.locator('input:not([type="hidden"]):not([disabled]), textarea:not([disabled])') })
      .first(),
  ], 20_000);
  if (!editPanel) {
    throw new Error(`Could not open edit panel for group: ${currentName}`);
  }

  await fillFirstVisible('Edited Group Title', [
    editPanel.getByRole('textbox', { name: /^title$/i }),
    editPanel.getByRole('textbox', { name: /title|name/i }),
    editPanel.locator('input[name*="title" i], input[name*="name" i], input[placeholder*="title" i], input[placeholder*="name" i]').first(),
    editPanel.locator('input:not([type="hidden"]):not([disabled]), textarea:not([disabled])').first(),
  ], updatedName);
  await fillOptionalVisible([
    editPanel.getByRole('textbox', { name: /description/i }),
  ], `Updated group for ${updatedName}`);

  await clickFirstVisible('Save edited group', [
    editPanel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ]);
  await expectSuccessMessage(page, 'edit group');

  await expect(getGroupListItem(page, updatedName)).toBeVisible({ timeout: 20_000 });
}

function parseCount(text: string): number | null {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return null;
  }

  const patterns = [
    /\((\d+)\s*items?\)/i,
    /\ball\s*cost\s*centers?\D+(\d+)\b/i,
    /\bpage\s+\d+\s+of\s+\d+\s+\((\d+)\s*items?\)/i,
    /\b(\d+)\s*items?\b/i,
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

async function getAllCostCenterCount(page: Page): Promise<number | null> {
  const allGroup = await waitForFirstVisible([
    page.locator('li', { has: page.getByRole('heading', { name: /all.*cost/i }) }),
    page.getByRole('listitem', { name: /all.*cost/i }),
    page.locator('li:has-text("All Cost"), li:has-text("All cost")'),
  ], 5_000);

  if (allGroup) {
    const text = (await allGroup.textContent()) ?? '';
    const count = parseCount(text);
    if (count !== null) {
      return count;
    }
  }

  const pageSummary = await waitForFirstVisible([
    page.locator('text=/\\(\\d+\\s*items?\\)/'),
    page.locator('text=/Page\\s+\\d+\\s+of\\s+\\d+/i'),
  ], 5_000);
  if (!pageSummary) {
    return null;
  }

  const summaryText = (await pageSummary.textContent()) ?? '';
  return parseCount(summaryText);
}

async function waitForAllCount(page: Page, timeoutMs = 30_000): Promise<number> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const count = await getAllCostCenterCount(page);
    if (count !== null) {
      return count;
    }
    await page.waitForTimeout(POLL_MS);
  }
  throw new Error(`Could not read All Cost Center count within ${timeoutMs}ms.`);
}

async function addCostCenter(page: Page, data: CostCenterData): Promise<void> {
  await clickFirstVisible('Add Cost Center button', [
    page.getByRole('button', { name: /add\s*add\s*cost\s*center/i }),
    page.getByRole('button', { name: /add\s*cost\s*center/i }),
    page.getByRole('button', { name: /^add$/i }),
    page.locator('button:has-text("Add Cost Center"), button:has-text("Add cost center")'),
    page.getByText(/add cost center/i),
  ]);

  const addPanel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /add.*cost center/i }),
    page.getByRole('dialog', { name: /add.*cost center/i }),
    page.locator('[role="complementary"]:has-text("Add Cost"), [role="dialog"]:has-text("Add Cost")'),
  ], 20_000);
  if (!addPanel) {
    throw new Error('Could not open Add Cost Center form.');
  }

  await fillFirstVisible('Cost Center Name', [
    addPanel.getByRole('textbox', { name: /name|title/i }),
    addPanel.locator('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]'),
    addPanel.locator('input:not([type="hidden"]):not([disabled])').first(),
  ], data.name);

  await fillOptionalVisible([
    addPanel.getByRole('textbox', { name: /code/i }),
    addPanel.locator('input[name*="code" i], input[id*="code" i], input[placeholder*="code" i]'),
  ], data.code);
  await fillOptionalVisible([
    addPanel.getByRole('textbox', { name: /description/i }),
    addPanel.locator('textarea[name*="description" i], input[name*="description" i]'),
  ], data.description);

  await clickFirstVisible('Save Cost Center', [
    addPanel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ]);
  await expectSuccessMessage(page, 'add cost center');
}

async function searchCostCenter(page: Page, value: string): Promise<void> {
  const searchBox = page.getByRole('textbox', { name: 'Search...' }).first();
  await expect(searchBox).toBeVisible({ timeout: 20_000 });
  await searchBox.fill('');
  await searchBox.fill(value);
  await searchBox.press('Enter').catch(() => {});
}

async function setDisplayInactiveCostCenters(page: Page, enabled: boolean): Promise<void> {
  const label = page.getByText(/Display inactive Cost Centers/i).first();
  await expect(label).toBeVisible({ timeout: 10_000 });

  const toggleContainer = label.locator('xpath=parent::*').first();
  const toggleHandle = label.locator('xpath=preceding-sibling::*[1]').first();
  const controlLikeCheckbox = toggleContainer.locator(
    'input[type="checkbox"], [role="checkbox"], .rz-chkbox-box, .MuiCheckbox-root',
  ).first();

  const toggleControl = await waitForFirstVisible([
    controlLikeCheckbox,
    toggleHandle,
    label,
  ], 5_000);
  if (!toggleControl) {
    throw new Error('Could not find "Display inactive Cost Centers" toggle.');
  }

  const currentState = await readCheckedState(toggleControl);
  if (currentState === enabled) {
    return;
  }

  await toggleControl.click();
  await page.waitForTimeout(500);

  if (currentState !== null) {
    await expect
      .poll(async () => await readCheckedState(toggleControl), { timeout: 5_000 })
      .toBe(enabled)
      .catch(() => {
        console.log('Display inactive toggle state could not be confirmed; continuing with row-based validation.');
      });
  }
}

async function getVisibleCostCenterStatusCounts(page: Page): Promise<{ active: number; inactive: number }> {
  const rows = page.getByRole('row');
  const count = await rows.count();
  let active = 0;
  let inactive = 0;

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const isVisible = await row.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    const text = ((await row.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    if (!text || /no records to display/i.test(text) || /code.*name.*group.*status.*action/i.test(text)) {
      continue;
    }

    if (/\binactive\b/i.test(text)) {
      inactive += 1;
      continue;
    }
    if (/\bactive\b/i.test(text)) {
      active += 1;
    }
  }

  return { active, inactive };
}

async function editCostCenter(page: Page, name: string, updated: CostCenterData): Promise<void> {
  await searchCostCenter(page, name);
  const row = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(name), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(name), 'i') }),
  ], 20_000);
  if (!row) {
    throw new Error(`Could not find Cost Center row for edit: ${name}`);
  }
  await row.click();

  const editPanel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /edit.*cost center|cost center/i }),
    page.getByRole('dialog', { name: /edit.*cost center|cost center/i }),
    page.locator('[role="complementary"]:has-text("Cost Center"), [role="dialog"]:has-text("Cost Center")').first(),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .filter({ has: page.locator('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]') })
      .first(),
  ], 6_000);
  if (!editPanel) {
    await clickFirstVisible(`Edit action for cost center ${name}`, [
      row.getByRole('button', { name: /^edit$/i }),
      row.getByRole('button', { name: /edit/i }),
      row.locator('button[aria-label*="edit" i], button[title*="edit" i]'),
    ]);
  }

  const resolvedEditPanel = await waitForFirstVisible([
    page.getByRole('complementary', { name: /edit.*cost center|cost center/i }),
    page.getByRole('dialog', { name: /edit.*cost center|cost center/i }),
    page.locator('[role="complementary"]:has-text("Cost Center"), [role="dialog"]:has-text("Cost Center")').first(),
    page.locator('[role="complementary"], [role="dialog"]')
      .filter({ has: page.getByRole('button', { name: /^save$/i }) })
      .filter({ has: page.locator('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]') })
      .first(),
  ], 20_000);
  if (!resolvedEditPanel) {
    throw new Error(`Could not open edit panel for cost center: ${name}`);
  }

  await fillFirstVisible('Edited Cost Center Name', [
    resolvedEditPanel.getByRole('textbox', { name: /name|title/i }),
    resolvedEditPanel.locator('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]'),
    resolvedEditPanel.locator('input:not([type="hidden"]):not([disabled])').first(),
  ], updated.name);
  await fillOptionalVisible([
    resolvedEditPanel.getByRole('textbox', { name: /code/i }),
    resolvedEditPanel.locator('input[name*="code" i], input[id*="code" i], input[placeholder*="code" i]'),
  ], updated.code);
  await fillOptionalVisible([
    resolvedEditPanel.getByRole('textbox', { name: /description/i }),
    resolvedEditPanel.locator('textarea[name*="description" i], input[name*="description" i]'),
  ], updated.description);

  await clickFirstVisible('Save edited cost center', [
    resolvedEditPanel.getByRole('button', { name: /^save$/i }),
    page.getByRole('button', { name: /^save$/i }),
  ]);
  await expectSuccessMessage(page, 'edit cost center');
}

async function deleteCostCenter(page: Page, name: string): Promise<void> {
  await searchCostCenter(page, name);

  let row = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(name), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(name), 'i') }),
    page.getByRole('listitem', { name: new RegExp(escapeRegex(name), 'i') }),
  ], 20_000);
  if (!row) {
    await searchCostCenter(page, '');
    row = await waitForFirstVisible([
      page.getByRole('row').filter({ has: page.getByRole('button', { name: /delete/i }) }).first(),
      page.locator('tr').filter({ has: page.locator('button[aria-label*="delete" i], button:has-text("delete")') }).first(),
    ], 10_000);
    if (row) {
      console.log(`Cost center row not found by name (${name}); deleting first deletable row in selected group.`);
    }
  }
  if (!row) {
    throw new Error(`Could not find Cost Center row for delete: ${name}`);
  }

  await clickFirstVisible(`Delete cost center ${name}`, [
    row.getByRole('button', { name: /^delete$/i }),
    row.getByRole('button', { name: /delete/i }),
    row.locator('button[aria-label*="delete" i], button[title*="delete" i]'),
  ]);

  const dialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm deletion|delete/i }),
    page.locator('[role="dialog"]:has-text("delete")'),
  ], 15_000);
  if (!dialog) {
    throw new Error('Delete confirmation dialog did not appear for cost center.');
  }

  await clickFirstVisible('Confirm delete cost center', [
    dialog.getByRole('button', { name: /^delete$/i }),
  ]);
  await expectSuccessMessage(page, 'delete cost center');
}

async function deleteGroup(page: Page, groupName: string): Promise<void> {
  await openGroupActions(page, groupName);
  const row = getGroupListItem(page, groupName);

  await clickFirstVisible(`Delete group ${groupName}`, [
    row.getByText(/^Delete$/),
    row.getByRole('listitem', { name: /^delete$/i }),
    row.getByRole('menuitem', { name: /^delete$/i }),
    row.locator('[role="menuitem"]:has-text("Delete"), li:has-text("Delete"), [role="listitem"]:has-text("Delete"), div:has-text("Delete")').first(),
    page.locator('[role="menu"] >> text=/^Delete$/').first(),
    page.getByRole('menuitem', { name: /^delete$/i }),
    page.getByRole('listitem', { name: /^delete$/i }),
  ]);

  const dialog = await waitForFirstVisible([
    page.getByRole('dialog', { name: /confirm deletion|delete/i }),
    page.locator('[role="dialog"]:has-text("Confirm deletion"), [role="dialog"]:has-text("Are you sure"), [role="dialog"]:has-text("delete")').first(),
  ], 15_000);
  if (!dialog) {
    throw new Error('Delete confirmation dialog did not appear for group.');
  }

  const deleteRequestPromise = page
    .waitForRequest(
      (request) => request.method().toUpperCase() === 'DELETE' && /cost|center|group/i.test(request.url()),
      { timeout: 20_000 },
    )
    .catch(() => null);
  const deleteResponsePromise = page
    .waitForResponse(
      (response) =>
        response.request().method().toUpperCase() === 'DELETE' && /cost|center|group/i.test(response.url()),
      { timeout: 20_000 },
    )
    .catch(() => null);

  await clickFirstVisible('Confirm delete group', [
    dialog.getByRole('button', { name: /^delete$/i }),
  ]);
  await expectSuccessMessage(page, 'delete group', 10_000, false);

  const deleteRequest = await deleteRequestPromise;
  const deleteResponse = await deleteResponsePromise;
  if (deleteRequest) {
    console.log(`Delete group request URL: ${deleteRequest.url()}`);
  }
  if (deleteResponse) {
    console.log(`Delete group response status: ${deleteResponse.status()}`);
  }

  // Some builds do not immediately refresh the group list after deletion.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/costcenter(s)?(\/|$)/i, { timeout: 30_000 });

  await expect
    .poll(async () => await getGroupListItem(page, groupName).isVisible().catch(() => false), { timeout: 30_000 })
    .toBeFalsy();
}

test('Cost Center full flow: add/edit group, add/edit/delete cost center, delete group', async ({ page }) => {
  const initialGroup = createShortGroupName();
  const editedGroup = createShortGroupName();
  const addedCostCenter = createCostCenterData('Ops');
  const editedCostCenter = createCostCenterData('Finance');

  await openCostCenterPage(page);

  await createGroup(page, initialGroup);
  console.log(formatGroupResult('GROUP ADDED', initialGroup));

  await editGroup(page, initialGroup, editedGroup);
  console.log(formatGroupResult('GROUP EDITED', editedGroup, initialGroup));

  await selectGroup(page, editedGroup);

  const beforeAllCount = await waitForAllCount(page);
  console.log(`All Cost Center count before add: ${beforeAllCount}`);

  await addCostCenter(page, addedCostCenter);
  await expect
    .poll(async () => {
      const count = await getAllCostCenterCount(page);
      return count ?? -1;
    }, { timeout: 30_000 })
    .toBeGreaterThan(beforeAllCount);
  const currentCount = await getAllCostCenterCount(page);
  if (currentCount !== null) {
    console.log(formatCountResult('ALL COST CENTER COUNT CHECK', beforeAllCount, currentCount));
  }
  console.log(formatCostCenterResult('COST CENTER ADDED', addedCostCenter));

  await editCostCenter(page, addedCostCenter.name, editedCostCenter);
  console.log(formatCostCenterResult('COST CENTER EDITED', editedCostCenter, addedCostCenter.name));

  await setDisplayInactiveCostCenters(page, true);
  await searchCostCenter(page, editedCostCenter.name);
  const editedInactiveRow = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
  ], 20_000);
  if (editedInactiveRow) {
    const editedRowText = ((await editedInactiveRow.textContent()) ?? '').toLowerCase();
    expect(editedRowText).toContain('inactive');
  } else {
    console.log(`Edited cost center not found by name after save (${editedCostCenter.name}); continuing to delete flow.`);
  }
  await setDisplayInactiveCostCenters(page, false);

  await deleteCostCenter(page, editedCostCenter.name);
  console.log(formatCostCenterResult('COST CENTER DELETED', editedCostCenter));

  // Deleted cost centers are validated only after switching to the inactive view.
  await setDisplayInactiveCostCenters(page, true);
  await searchCostCenter(page, editedCostCenter.name);
  let inactiveRow = await waitForFirstVisible([
    page.getByRole('row', { name: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
    page.locator('tr', { hasText: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
  ], 20_000);
  if (!inactiveRow) {
    await setDisplayInactiveCostCenters(page, true);
    await searchCostCenter(page, editedCostCenter.name);
    inactiveRow = await waitForFirstVisible([
      page.getByRole('row', { name: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
      page.locator('tr', { hasText: new RegExp(escapeRegex(editedCostCenter.name), 'i') }),
    ], 20_000);
  }
  expect(inactiveRow, `Deleted cost center should appear in inactive list: ${editedCostCenter.name}`).not.toBeNull();
  const inactiveRowText = ((await inactiveRow?.textContent()) ?? '').toLowerCase();
  expect(inactiveRowText).toContain('inactive');

  await searchCostCenter(page, '');
  const statusCounts = await getVisibleCostCenterStatusCounts(page);
  console.log(formatStatusCountResult(statusCounts.active, statusCounts.inactive));

  await deleteGroup(page, editedGroup);
  console.log(formatGroupResult('GROUP DELETED', editedGroup));
});
