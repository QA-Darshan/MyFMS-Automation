import { test, expect } from '@playwright/test';
import { login } from './login';
import { generateFormData } from './testdata'

test('Email Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);
  await page.getByRole('textbox', { name: 'Add email recipients' }).click();
  await page.getByRole('textbox', { name: 'Add email recipients' }).fill(data.email);
  await page.getByRole('button', { name: 'add', exact: true }).click();
  await expect(page.getByRole('button', { name: 'close', exact: true })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Subject' }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).fill(data.subject);
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data.message);
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  //Search Action
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);
  await page.waitForTimeout(5000);
//  await expect(page.getByRole('row', { name: 'my test test Email Yes 17-04-' })).toBeVisible();

  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByRole('textbox', { name: 'Add email recipients' }).click();
  await page.getByRole('textbox', { name: 'Add email recipients' }).fill(data1.email);
  await page.getByRole('button', { name: 'add', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).click();
  await page.getByRole('textbox', { name: 'Enter Subject' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter Subject' }).fill(data1.subject);
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data1.message);
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();

  //Delete Email Action
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data1.description);
  await page.waitForTimeout(5000);
  await page.getByRole('row', { name: data1.description }).getByRole('button').click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();
});

test('URL Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add URL Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);

  await page.getByText('Email Email Url Banner Alert').click();
  await expect(page.getByRole('option', { name: 'Email' })).toBeVisible();

  await page.getByLabel('Url').getByText('Url').click();
  await page.getByRole('textbox', { name: 'Enter Url' }).click();
  await page.getByRole('textbox', { name: 'Enter Url' }).fill(data.url);
  await page.getByRole('button', { name: 'Save' }).click();
  
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);
  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByRole('textbox', { name: 'Enter Url' }).click();
  await page.getByRole('textbox', { name: 'Enter Url' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter Url' }).fill(data1.url);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data1.description);
  await page.waitForTimeout(2000);
  await page.getByRole('row', { name: data1.description }).getByRole('button').click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
});

test('Banner Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add Banner Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);

  await page.getByText('Email Email Url Banner Alert').click();
  await expect(page.getByRole('option', { name: 'Email' })).toBeVisible();

  await page.getByLabel('Banner').getByText('Banner').click();
  await page.getByText('Select Recipients').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('Darshan');
  await page.getByText('Darshan B Prajapati').click();
  await page.getByText('Cancel Save').click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data.message);
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);
  await page.waitForTimeout(5000);

  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByText('Darshan B Prajapati close MyFMS Root Remon Lucassen Kees vaste belangen').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.locator('.rz-multiselect-filter-container').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('Darshan');
  await page.locator('li:nth-child(2) > .rz-chkbox > .rz-chkbox-box').click();
  await page.getByText('Cancel Save').click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data1.message);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search...' }).fill(data1.description);
  
  await page.waitForTimeout(2000);
  await page.getByRole('row', { name: data1.description }).getByRole('button').click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
});

test('Alert Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add Alert Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);

  await page.getByText('Email Email Url Banner Alert').click();
  await expect(page.getByRole('option', { name: 'Email' })).toBeVisible();

  await page.getByLabel('Alert').getByText('Alert').click();
  await page.getByText('Select Recipients MyFMS Root').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('Darshan');
  await page.getByText('Darshan B Prajapati').click();
  await expect(page.getByRole('button', { name: 'close', exact: true })).toBeVisible();

  await page.getByText('Cancel Save').click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data.message);
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);

  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByText('Darshan B Prajapati close MyFMS Root Remon Lucassen Kees vaste belangen').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.waitForTimeout(2000)

  await page.locator('.rz-multiselect-filter-container').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('Darshan');
  await page.locator('li:nth-child(2) > .rz-chkbox > .rz-chkbox-box').click();
  await page.getByText('Cancel Save').click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).click();
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Type a Message, Use @ to add' }).fill(data1.message);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search...' }).fill(data1.description);

  await page.waitForTimeout(2000);
  await page.getByRole('row', { name: data1.description }).getByRole('button').click();
  await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
})

test('Enable Recovery Action', async ({ page }) => {
 const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();


  //Add Enable Recovery Action
  await page.getByRole('button', { name: 'add Add Action' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);

  await page.getByText('Email Email Url Banner Alert').click();
  await expect(page.getByRole('option', { name: 'Email' })).toBeVisible();
  await page.getByText('Enable Recovery').click();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(data.description);

  await page.getByText(data.description).click();
  await expect(page.getByRole('complementary', { name: 'Edit Action' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data1.description);
  await page.getByRole('button', { name: 'Save' }).click();
})

test('Ruleset', async ({ page }) => {
  const data = generateFormData();
 const data1 = generateFormData();
  await login(page);
  await page.waitForTimeout(8000);
  await page.getByText('Admin').click();
  await expect(page.getByRole('listitem', { name: 'Journeys', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Actions' })).toBeVisible();
  await page.getByRole('link', { name: 'notifications Notification' }).click();
  await page.getByRole('tab', { name: 'Rulesets' }).click();
  await page.getByRole('button', { name: 'add Add Ruleset' }).click();
  await expect(page.getByRole('complementary', { name: 'Add Ruleset' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter description' }).click();
  await page.getByRole('textbox', { name: 'Enter description' }).fill(data.description);
  await page.locator('#AuaFpuMJRU > .rz-chkbox-box').click();
  await page.getByText('Select Action Mail Action').click();
  await expect(page.getByRole('textbox', { name: 'Search', exact: true })).toBeVisible();

  await page.getByLabel('Mail Action').getByText('Mail Action').click();
  await page.getByText('Select...').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('auto');
  await page.getByText('Auto Reply').click();
  await expect(page.getByRole('row', { name: '15 Event Number expand_more' })).toBeVisible();

  await page.getByRole('button', { name: 'Save' }).click();
});