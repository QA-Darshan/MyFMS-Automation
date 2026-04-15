import { faker } from '@faker-js/faker';

export function generateUserName() {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`.toLowerCase(),
    employeeNumber: `EMP${Math.floor(Math.random() * 1000000)}`,
    phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString()
  };
}

export function generateAddress() {
  const timestamp = Date.now();
    return {
    street: `Main Street`,
    number: Math.floor(Math.random() * 200) + 1,
    postalCode: Math.floor(100000 + Math.random() * 900000).toString(),
    city: 'Ahmedabad',
    country: `India`
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
