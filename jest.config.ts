export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/*.(spec|test).ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      diagnostics: false,
    },
  },
}
