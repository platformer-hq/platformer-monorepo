import {
  createNuxtConfig,
  vueConfig,
  importConfig,
  importConfigBase,
  importConfigTypescript,
  stylisticConfig,
} from '@platformer/eslint-config';

export default createNuxtConfig({
  srcDirs: [
    'apps/admin-panel/app',
    'apps/launcher/app',
  ],
})
  .append(
    {
      name: 'platformer/packages-and-layers',
      files: ['{packages,nuxt-layers}/**/*.{ts,mts,tsx,vue}'],
    },
    { rules: vueConfig.rules },
    stylisticConfig,
    importConfigBase,
    importConfigTypescript,
    importConfig,
  )
  .append({
    name: 'platformer/disable-multi-word-for-icons',
    files: ['nuxt-layers/ui-kit/app/icons/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  });
