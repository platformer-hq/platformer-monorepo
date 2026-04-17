import { createNuxtConfig, tsConfigs } from '@workspace/eslint-config';

export default createNuxtConfig({
  srcDirs: [
    'apps/admin-panel/app',
    'apps/launcher/app',
  ],
})
  .append(
    {
      name: 'workspace/packages-and-layers',
      files: ['{packages,nuxt-layers}/**/*.{ts,mts,tsx,vue}'],
    },
    {
      name: 'workspace/vue-overrides',
      files: ['**/*.vue'],
      rules: {
        // Not needed with SFC + TypeScript
        // Optional props (variant?: string) don't require defaults
        'vue/require-default-prop': 'off',
      },
    },
    {
      name: 'workspace/disable-multi-word-for-ui-kit-icons',
      files: ['./nuxt-layers/ui-kit/app/icons/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    ...tsConfigs,
  );
