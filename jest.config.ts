export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.(spec|test).ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      diagnostics: false,
    },
  },
}
