import path from 'node:path';

function resolve(filePath: string) {
  return path.resolve(__dirname, filePath);
}

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  alias: {
    '@ui-kit': resolve('app'),
  },
  components: [{
    path: resolve('app/components'),
    pathPrefix: false,
    extensions: ['.vue'],
  }, {
    path: resolve('app/page-transitions/components'),
    pathPrefix: false,
    extensions: ['.vue'],
  }, {
    path: resolve('app/icons'),
    pathPrefix: false,
    prefix: 'Icon',
    extensions: ['.vue'],
  }],
  imports: {
    dirs: [
      resolve('app/composables/**/*.ts'),
      resolve('app/stores/*.ts'),
      resolve('app/page-transitions/{composables,utils}/*.ts'),
      resolve('app/transitions/utils/*.ts'),
    ],
  },
});
