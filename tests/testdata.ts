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
  url: faker.internet.url(),
  title: faker.lorem.words(3)
});

export function generateTestData() {
  const randomDigits = (length: number): string =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

  const phoneNumber = '9' + faker.string.numeric(9);

  const username = faker.string.alphanumeric(6);

  const password = `Pass@${faker.string.alphanumeric(4)}${faker.string.numeric(2)}`;

  return {
    randomDigits,
    phoneNumber,
    username,
    password,
  };
}

export const generateSimNumber = (): string => {
  let b = '31' + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join(''), s = 0, d = 1;
  for (let i = b.length - 1; i >= 0; i--) { let n = +b[i]; if (d) { n *= 2; if (n > 9) n -= 9; } s += n; d ^= 1; }
  return b + ((10 - s % 10) % 10);
};

export const generateIMEI = (): string => {
  let b = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join(''), s = 0, d = 1;
  for (let i = b.length - 1; i >= 0; i--) { let n = +b[i]; if (d) { n *= 2; if (n > 9) n -= 9; } s += n; d ^= 1; }
  return b + ((10 - s % 10) % 10);
};

export function generatePOIGroupData() {
  return {
    title: faker.company.name(),                     // realistic group name
    description: faker.lorem.sentence(),             // readable description
    thirdPartyId: faker.string.alphanumeric(10),     // unique external ID
  };
}

export function generatePOIData() {
  const [lat, lng] = faker.location.nearbyGPSCoordinate();

  return {
    name: faker.string.alphanumeric(6),
    address: faker.location.streetAddress().replace(/\n/g, ', '),
    latitude: lat.toFixed(6),
    longitude: lng.toFixed(6),
    thirdPartyId: faker.string.alphanumeric(8)
  };
}

export const generateCostCenterData = () => ({
  title: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  code: `${Math.floor(Math.random() * 1000000)}`,
  name: faker.string.alphanumeric(6),
});


export const generateassetpooldata = () => ({
  title: faker.lorem.words(2),
})