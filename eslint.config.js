// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const pluginImport = require('eslint-plugin-import');
const pluginPrettier = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      import: { rules: pluginImport.rules },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      pluginPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^(?:[iI]gnore|_)',
          argsIgnorePattern: '^(?:[iI]gnore|_)',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^(?:[iI]gnore|_)',
          destructuredArrayIgnorePattern: '^(?:[iI]gnore|_)',
          ignoreRestSiblings: true,
        },
      ],
      'import/first': 'error',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'unknown'], 'internal', 'parent', ['sibling', 'index'], 'object', 'type'],
          pathGroups: [
            {
              pattern: '@angular/!(cdk|cdk-*|material|material-*){/**,}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@angular/{cdk,material}{-*,}{/**,}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@ngx-mat-time-input/**',
              group: 'internal',
            },
            {
              pattern: 'ngx-mat-time-input',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          distinctGroup: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
