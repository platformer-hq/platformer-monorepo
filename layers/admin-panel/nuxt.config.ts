import path from 'node:path';

function resolve(filePath: string) {
  return path.resolve(__dirname, filePath);
}

const componentsIgnore = [
  '**/_/**',
  '**/_*',
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    // '@sentry/nuxt/module'
  ],
  alias: {
    '@': resolve('app'),
    '~': resolve('app'),
  },
  app: {
    rootTag: 'main',
  },
  appId: 'admin-panel',
  css: [
    resolve('app/assets/global.scss'),
  ],
  components: [
    {
      path: resolve('app/pages-components'),
      pathPrefix: false,
      extensions: ['.vue'],
      ignore: componentsIgnore,
    },
    {
      path: resolve('app/components'),
      pathPrefix: false,
      extensions: ['.vue'],
      ignore: componentsIgnore,
    },
    {
      path: resolve('app/auto-components'),
      pathPrefix: false,
      extensions: ['.ts', '.vue'],
      ignore: componentsIgnore,
    },
    {
      path: resolve('app/domains'),
      pathPrefix: false,
      pattern: '**/components/*.vue',
      ignore: componentsIgnore,
    },
  ],
  extends: [
    '../api',
    '../base',
    '../page-transitions',
    '../navigation',
    '../ui-kit',
  ],
  imports: {
    dirs: [
      resolve('app/domains/*/{composables,utils}.ts'),
      resolve('app/domains/*/{composables,utils}/**'),
      resolve('app/components/**/{composables,utils}/**'),
      resolve('app/components/**/{composables,utils}.ts'),
    ],
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'ru', name: 'Russian', language: 'ru-RU' },
    ],
    defaultLocale: 'en',
  },
  postcss: {
    plugins: {
      autoprefixer: {},
      cssnano: {},
    },
  },
  runtimeConfig: {

  },
  routeRules: {
    '/**': {
      prerender: true,
    },
  },
});
