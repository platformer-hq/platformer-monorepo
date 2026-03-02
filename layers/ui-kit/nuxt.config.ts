import path from 'node:path';

function resolve(filePath: string) {
  return path.resolve(__dirname, filePath);
}

export default defineNuxtConfig({
  extends: ['../base'],
  alias: {
    '@ui-kit-mixins': resolve('app/scss/mixins'),
    '#ui-kit-icons': resolve('app/icons'),
  },
  components: [
    {
      path: resolve('app/components'),
      pathPrefix: false,
      extensions: ['.vue'],
    },
    {
      path: resolve('app/icons'),
      pathPrefix: false,
      prefix: 'Icon',
      extensions: ['.vue'],
    },
  ],
  imports: {
    dirs: [
      resolve('app/composables/**/*.ts'),
    ],
  },
});
