import { createNuxtConfig, tsConfigs } from '@workspace/eslint-config';

export default createNuxtConfig({
  srcDirs: [
    'apps/admin/app',
    'apps/launcher/app',
  ],
})
  .append(
    {
      name: 'workspace/vue-overrides',
      files: ['**/*.vue'],
      rules: {
        // Not needed with SFC + TypeScript
        // Optional props (variant?: string) don't require defaults
        'vue/require-default-prop': 'off',
      },
    },
    ...tsConfigs,
  );
