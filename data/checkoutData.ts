export const CHECKOUT_DATA = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  LONG_VALUES: {
    firstName: 'A'.repeat(50),
    lastName: 'B'.repeat(50),
    postalCode: '9'.repeat(20),
  },
  NUMERIC_VALUES: {
    firstName: '12345',
    lastName: '67890',
    postalCode: '99999',
  },
  ALPHANUMERIC_VALUES: {
    firstName: 'John123',
    lastName: 'Doe456',
    postalCode: 'A1B2C3',
  },
  SPECIAL_CHARACTERS: {
    firstName: "John-Paul O'Connor",
    lastName: 'Smith-Jones #1',
    postalCode: '!@#$%^&*()',
  },
};
