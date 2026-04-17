import { faker } from '@faker-js/faker';

export function generateUserName() {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`.toLowerCase(),
    employeeNumber: `EMP${Math.floor(Math.random() * 1000000)}`,
    phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    billingcode: `Billingcode${Math.floor(Math.random() * 1000000)}`,
  };
}

export function generateAddress() {
  const timestamp = Date.now();
    return {
    street: `Main Street`,
    number: Math.floor(Math.random() * 200) + 1,
    postalCode: Math.floor(100000 + Math.random() * 900000).toString(),
    city: 'Ahmedabad',
    country: `India`,
    Postalcode: `382330`
  };
}

export function generateRFIDData() {
  return {
    generateRFID: `RFID${faker.string.alphanumeric(8).toUpperCase()}`,
    generateAlias: faker.person.firstName(),
    generateThirdpartyID: `TPID${faker.string.alphanumeric(10).toUpperCase()}`
  };
}

export function generateAlphaString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function buildTestDataTable(data: Record<string, string>): string {
  const headers = ['Field', 'Value'];
  const rows = Object.entries(data);

  const fieldWidth = Math.max(...rows.map(r => r[0].length), 'Field'.length);
  const valueWidth = Math.max(...rows.map(r => r[1].length), 'Value'.length);

  const border = `+${'-'.repeat(fieldWidth + 2)}+${'-'.repeat(valueWidth + 2)}+`;

  const lines = [
    border,
    `| ${'Field'.padEnd(fieldWidth)} | ${'Value'.padEnd(valueWidth)} |`,
    border,
    ...rows.map(([k, v]) =>
      `| ${k.padEnd(fieldWidth)} | ${v.padEnd(valueWidth)} |`
    ),
    border
  ];

  return lines.join('\n');
}

export function buildTestDataTable1(data: Record<string, string>): string {
  const headers = ['Field', 'Value'];
  const rows = Object.entries(data);

  const fieldWidth = Math.max(...rows.map(r => r[0].length), 'Field'.length);
  const valueWidth = Math.max(...rows.map(r => r[1].length), 'Value'.length);

  const border = `+${'-'.repeat(fieldWidth + 2)}+${'-'.repeat(valueWidth + 2)}+`;

  const lines = [
    border,
    `| ${'Field'.padEnd(fieldWidth)} | ${'Value'.padEnd(valueWidth)} |`,
    border,
    ...rows.map(([k, v]) =>
      `| ${k.padEnd(fieldWidth)} | ${v.padEnd(valueWidth)} |`
    ),
    border
  ];

  return lines.join('\n');
}

// helpers/notification.helper.ts

export const generateFormData = () => ({
  description: faker.lorem.sentence(),
  email: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`.toLowerCase(),
  subject: faker.lorem.words(3),
  message: faker.lorem.paragraph(),
});