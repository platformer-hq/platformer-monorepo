// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['./apps/telegram-launcher/**/*.tsx?'],
    extends: ['plugin:solid/typescript']
  },
  {
    languageOptions: {
      parserOptions: {
        project: [
          './packages/*/tsconfig.eslint.json',
          './apps/*/tsconfig.json'
        ],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-redundant-type-constituents': 0,
      '@typescript-eslint/no-duplicate-type-constituents': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-namespace': 0,
      'no-empty': 0,
    },
  },
);