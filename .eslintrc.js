module.exports = {
  extends: ['algolia', 'algolia/typescript'],
  rules: {
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        filter: {
          regex: '__DEV__|__FLAVOR__',
          match: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['index-browser.cjs.d.ts', 'index-node.cjs.d.ts'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['index-browser.cjs.js', 'index-node.cjs.js'],
      rules: {
        'import/extensions': 'off',
      },
    },
    {
      files: ['.eslintrc.js', '*.config.js', '*.cjs.js'],
      rules: {
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
