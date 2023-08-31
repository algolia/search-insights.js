module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'algolia',
    'algolia/typescript',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: '*.test.*',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'jsdoc/check-tag-names': [
      'error',
      {
        definedTags: ['jest-environment'],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
    ],
  },
};

// rules: {
//   'import/extensions': 'off',
//     'no-warning-comments': 'off',
//     'consistent-return': 'off',
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/no-shadow': 'off',
//     '@typescript-eslint/naming-convention': [
//     'error',
//     {
//       selector: 'typeAlias',
//       format: ['PascalCase'],
//     },
//     {
//       selector: 'typeParameter',
//       format: ['PascalCase'],
//     },
//     {
//       selector: 'interface',
//       format: ['PascalCase'],
//     },
//   ],
//     'jsdoc/check-tag-names': [
//     'error',
//     {
//       definedTags: ['jest-environment'],
//     },
//   ],
// },
// overrides: [
//   {
//     files: ['*.*js'],
//     rules: {
//       'import/no-commonjs': 'off',
//       '@typescript-eslint/no-var-requires': 'off',
//     },
//   },
//   {
//     files: ['*.test.*'],
//     rules: {
//       'import/no-commonjs': 'off',
//       '@typescript-eslint/no-var-requires': 'off',
//       '@typescript-eslint/no-empty-function': 'off',
//     },
//   },
//   {
//     files: ['instantsearchExample.js'],
//     rules: {
//       'no-param-reassign': 'off',
//     },
//   },
// ],
