// @ts-check

import eslint from '@eslint/js';
import pluginVitest from '@vitest/eslint-plugin';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: [
            './packages/*/tsconfig.json',
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
        '@typescript-eslint/no-misused-promises': 0,
        'no-empty': 0,
      },
    },
  ),
  ...defineConfigWithVueTs(
    {
      name: 'app/files-to-lint',
      files: ['apps/tg-launcher/**/*.{ts,mts,tsx,vue}'],
    },
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    {
      ...pluginVitest.configs.recommended,
      files: ['apps/tg-launcher/src/**/__tests__/*'],
    },
    {
      rules: {
        'vue/multi-word-component-names': 0,
      },
    },
  )
];