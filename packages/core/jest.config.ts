export default {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/*.(spec|test).ts'],
      globals: {
        'ts-jest': {
          tsconfig: './tsconfig.json',
          diagnostics: false,
        },
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/integration/*.(spec|test).ts'],
      globals: {
        'ts-jest': {
          tsconfig: './tsconfig.json',
          diagnostics: false,
        },
      },
    },
  ],
}
