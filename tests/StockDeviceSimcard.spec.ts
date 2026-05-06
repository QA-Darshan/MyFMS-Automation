import { test, expect } from '@playwright/test';
import { login } from './login';
import {generateTestData, generateSimNumber, generateIMEI} from './testdata';

test('test', async ({ page }) => {
  const data = generateTestData();
  const sim = generateSimNumber()
  const sim1 = generateSimNumber()
  const IMEI = generateIMEI()
  await login(page);
  await page.waitForTimeout(10000); 
  await page.getByText('Stock').click();

  await page.getByRole('link', { name: 'sim_card SIM Cards' }).click();

  await page.getByRole('button', { name: 'add Add SIM Card' }).click();

  await page.getByText('Select Provider').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('Orange');
  await page.getByText('Orange (NL)').click();
  await page.getByText('Micpoint B.V. Micpoint B.V.').click();

  await page.getByLabel('Micpoint B.V.').getByText('Micpoint B.V.').click();
  await page.getByRole('textbox', { name: 'Sim Number' }).click();
  await page.getByRole('textbox', { name: 'Sim Number' }).fill(sim);
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill(sim1);
  await page.getByRole('textbox', { name: 'User name' }).click();
  await page.getByRole('textbox', { name: 'User name' }).fill(data.username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(data.password);
  await page.getByRole('button', { name: 'Save' }).click();
  console.table([
  {
    SIM_Number: sim,
    Telephone_Number: sim1,
    Username: data.username,
    Password: data.password
  }
]);
  await page.waitForTimeout(5000);

  await page.getByRole('link', { name: 'devices Devices' }).click();
  await page.getByRole('button', { name: 'add Add Devices' }).click();

  await page.getByText('Enter Model').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill('M7');
  await page.getByText('M7', { exact: true }).click();
  await page.getByRole('textbox', { name: 'IMEI Number' }).click();
  await page.getByRole('textbox', { name: 'IMEI Number' }).fill(IMEI);
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Save' }).click();
    console.table([
  {
      IMEI: IMEI
  }
]);
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(IMEI);

  await page.getByText(IMEI).click();

  await page.getByText('Select Simcard Select Simcard').click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).click();
  await page.getByText(sim).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('link', { name: 'sim_card SIM Cards' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('checkbox').first().click();
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill(sim);
  await page.waitForTimeout(2000);
  await page.getByText(sim).click();
  await page.waitForTimeout(7000);
});