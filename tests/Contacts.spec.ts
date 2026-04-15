import { login } from './login';
import { test, expect, type Locator, type Page } from '@playwright/test';
import {generateUserName} from './testdata';
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

function buildGeneratedContactDataTable(user: any, address: any, user1: any, address1: any): string {
  const rows = [
    ['firstName', user.firstName, user1.firstName],
    ['middleName', user.middleName, user1.middleName],
    ['lastName', user.lastName, user1.lastName],
    ['email', user.email, user1.email],
    ['phoneNumber', user.phoneNumber, user1.phoneNumber],
    ['code', String(address.number), String(address1.number)],
    ['street', address.street, address1.street],
    ['postalCode', address.postalCode, address1.postalCode],
    ['city', address.city, address1.city],
    ['country', 'India', 'India'],
    ['Function', 'QA', 'QA1'],
    ['comment', 'Test', 'Test'],
  ];

  return buildFixedTable('Generated Contact Data', ['Field', 'Add', 'Edit'], rows, [12, 28, 28]);
}

function buildContactFlowSummaryTable(user: any, user1: any, addMessage: string, editMessage: string, deleteMessage: string): string {
  const rows = [
    ['Add', user.email, 'Passed', addMessage],
    ['Edit', user1.email, 'Passed', editMessage],
    ['Delete', user1.email, 'Passed', deleteMessage],
  ];

  return buildFixedTable('Contact Flow Summary', ['Action', 'Email', 'Status', 'Success Message'], rows, [8, 30, 8, 60]);
}

function buildContactSuccessDetails(addMessage: string, editMessage: string, deleteMessage: string): string {
  return [
    'Full Success Messages',
    `Add    : ${addMessage}`,
    `Edit   : ${editMessage}`,
    `Delete : ${deleteMessage}`,
  ].join('\n');
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

test('Add Contact', async ({ page }) => {
  const user = generateUserName();
  const address = generateAddress();
  const user1 = generateUserName();
  const address1 = generateAddress();
  let addSuccessMessage = 'Not executed';
  let editSuccessMessage = 'Not executed';
  let deleteSuccessMessage = 'Not executed';

  const generatedDataTable = buildGeneratedContactDataTable(user, address, user1, address1);
  console.log(generatedDataTable);
  await test.info().attach('generated-contact-data-table', {
    body: Buffer.from(generatedDataTable, 'utf-8'),
    contentType: 'text/plain',
  });

  try {
    await login(page);  
    await page.waitForTimeout(12000);
    await page.getByText('Admin').click();
    await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'contacts Contacts' }).click();
    await page.getByRole('button', { name: 'add Add Contact' }).click();
    await expect(page.getByRole('complementary', { name: 'Add Contact' })).toBeVisible();

    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName);
    await page.getByRole('textbox', { name: 'Middle name' }).click();
    await page.getByRole('textbox', { name: 'Middle name' }).fill(user.middleName);
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName);
    await page.getByRole('textbox', { name: 'Mail address' }).click();
    await page.getByRole('textbox', { name: 'Mail address' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Mail address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Telephone number' }).fill(user.phoneNumber);
    await page.getByRole('textbox', { name: 'Function' }).click();
    await page.getByRole('textbox', { name: 'Function' }).fill('QA');
    await page.getByRole('textbox', { name: 'Code' }).click();
    await page.getByRole('textbox', { name: 'Code' }).fill(address.number.toString());
    await page.getByRole('textbox', { name: 'Comment' }).click();
    await page.getByRole('textbox', { name: 'Comment' }).fill('Test');
    await page.locator('.rz-chkbox-box').click();
    await expect(page.getByRole('textbox', { name: 'Enter number' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Street' }).click();
    await page.getByRole('textbox', { name: 'Street' }).fill(address.street);
    await page.getByRole('textbox', { name: 'Enter number' }).click();
    await page.getByRole('textbox', { name: 'Enter number' }).fill(address.number.toString());
    await page.getByRole('textbox', { name: 'Postal code' }).click();
    await page.getByRole('textbox', { name: 'Postal code' }).fill(address.postalCode);
    await page.getByRole('textbox', { name: 'City' }).click();
    await page.getByRole('textbox', { name: 'City' }).fill(address.city);
    await page.getByText('Netherlands').first().click();
    await page.getByRole('textbox', { name: 'Search', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search', exact: true }).fill('india');
    await page.getByRole('option', { name: 'India', exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    addSuccessMessage = await expectSuccessMessage(page, 'add contact', /success|saved|created/i);
    
    //Search
    await page.getByRole('textbox', { name: 'Search...' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(user.email);

    //Edit Contact
    await page.getByText(user.firstName).click();
    await expect(page.getByRole('complementary', { name: 'Edit Contact' })).toBeVisible();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: 'First name' }).fill(user1.firstName);
    await page.getByRole('textbox', { name: 'Middle name' }).click();
    await page.getByRole('textbox', { name: 'Middle name' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: 'Middle name' }).fill(user1.middleName);
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill(user1.lastName);
    await page.getByRole('textbox', { name: 'Mail address' }).click();
    await page.getByRole('textbox', { name: 'Mail address' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: 'Mail address' }).fill(user1.email);
    await page.getByRole('textbox', { name: 'Mail address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Telephone number' }).fill(user1.phoneNumber);
    await page.getByRole('textbox', { name: 'Function' }).click();
    await page.getByRole('textbox', { name: 'Function' }).fill('QA1');
    await page.locator('//input[@id="Code"]').fill(address1.number.toString());
    await page.getByRole('textbox', { name: 'Comment' }).click();
    await page.getByRole('textbox', { name: 'Comment' }).fill('Test');
    await expect(page.getByRole('textbox', { name: 'Enter number' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Street' }).click();
    await page.getByRole('textbox', { name: 'Street' }).fill(address1.street);
    await page.getByRole('textbox', { name: 'Enter number' }).click();
    await page.getByRole('textbox', { name: 'Enter number' }).fill(address1.number.toString());
    await page.getByRole('textbox', { name: 'Postal code' }).click();
    await page.getByRole('textbox', { name: 'Postal code' }).fill(address1.postalCode);
    await page.getByRole('textbox', { name: 'City' }).click();
    await page.getByRole('textbox', { name: 'City' }).fill(address1.city);
    await page.getByText('Netherlands').first().click();
    await page.getByRole('textbox', { name: 'Search', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search', exact: true }).fill('india');
    await page.getByRole('option', { name: 'India', exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    editSuccessMessage = await expectSuccessMessage(page, 'edit contact', /success|saved|updated/i);

    //Delete Contact
    await page.getByRole('textbox', { name: 'Search...' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(user1.email);
    const row = page.getByRole('row', { name: user1.email });
    await expect(row).toBeVisible();  
    await row.getByRole('button', { name: 'delete' }).click();
    await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    deleteSuccessMessage = await expectSuccessMessage(page, 'delete contact', /success|deleted|removed/i);
  } finally {
    const summaryTable = buildContactFlowSummaryTable(user, user1, addSuccessMessage, editSuccessMessage, deleteSuccessMessage);
    const fullSuccessDetails = buildContactSuccessDetails(addSuccessMessage, editSuccessMessage, deleteSuccessMessage);
    console.log(summaryTable);
    console.log(`\n${fullSuccessDetails}`);
    await test.info().attach('contact-flow-summary-table', {
      body: Buffer.from(summaryTable, 'utf-8'),
      contentType: 'text/plain',
    });
    await test.info().attach('contact-success-messages-full', {
      body: Buffer.from(fullSuccessDetails, 'utf-8'),
      contentType: 'text/plain',
    });
  }
});