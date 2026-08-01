import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'ui-kit',
  },
  alias: {
    '~ui-kit': resolve('app'),
  },
  css: [resolve('app/assets/global.scss')],
  components: [{
    path: resolve('app/components'),
    pathPrefix: false,
    extensions: ['.vue'],
    ignore: ['**/_/**', '**/_*'],
  }],
  extends: [
    '@workspace-layers/scss',
    '@workspace-layers/colors',
    '@workspace-layers/utils',
    '@workspace-layers/navigation',
  ],
  imports: {
    dirs: [
      resolve('app/components/*/utils/*.ts'),
      resolve('app/components/*/composables/*.ts'),
      resolve('app/composables/use*/use*.ts'),
      resolve('app/utils/*/*.ts'),
    ],
  },
  modules: ['@pinia/nuxt'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~scss/mixins.scss" as mixins;',
        },
      },
    },
  },
});
