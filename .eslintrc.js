module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/member-ordering': ['error'],
    '@typescript-eslint/ban-types': ['error', { extendDefaults: true, types: { '{}': false } }],
  },
  ignorePatterns: ['node_modules', 'dist', 'build', 'lib', 'coverage', 'target'],
}
