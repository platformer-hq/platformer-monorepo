import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

export const vueConfigs = defineConfigWithVueTs(
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,
  {
    name: 'platformer/vue-overrides',
    files: ['**/*.vue'],
    rules: {
      // Not needed with SFC + TypeScript
      // Optional props (variant?: string) don't require defaults
      'vue/require-default-prop': 'off',
    },
  }
);
