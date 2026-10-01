const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    rules: {
      // Each `as const` object is paired with a type of the same name.
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
]);
