import browserslistToEsbuild from 'browserslist-to-esbuild';
import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

function resolveLayer(pkg: string) {
  return path.resolve(__dirname, '../../nuxt-layers', pkg);
}

function higherPriorityImport(name: string, from: string) {
  return { name, from, priority: 10 };
}

const componentsIgnore = ['**/_/**', '**/_*'];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@pinia/colada-nuxt',
    // '@sentry/nuxt/module'
  ],
  alias: {
    '@': resolve('app'),
    '~': resolve('app'),
  },
  app: {
    rootTag: 'main',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap' },
      ],
    },
  },
  appId: 'admin-panel',
  css: [
    resolve('app/assets/global.scss'),
    '@tma.js/vue-kit/styles',
  ],
  components: [{
    path: resolve('app/pages-components'),
    pathPrefix: false,
    extensions: ['.vue'],
    ignore: componentsIgnore,
    priority: 100,
  }, {
    path: resolve('app/components'),
    pathPrefix: false,
    extensions: ['.vue'],
    ignore: componentsIgnore,
    priority: 100,
  }, {
    path: resolve('app/auto-components'),
    pathPrefix: false,
    extensions: ['.ts', '.vue'],
    ignore: componentsIgnore,
    priority: 100,
  }, {
    path: resolve('app/domains'),
    pathPrefix: false,
    pattern: '**/components/*.vue',
    ignore: componentsIgnore,
    priority: 100,
  }, {
    path: resolve('app/navigation'),
    pathPrefix: false,
    pattern: '**/components/*.vue',
    ignore: componentsIgnore,
    priority: 100,
  }],
  extends: [
    resolveLayer('api'),
    resolveLayer('base'),
    resolveLayer('navigation'),
    resolveLayer('pinia'),
    resolveLayer('tma'),
  ],
  imports: {
    imports: [
      higherPriorityImport('useParametrizedQueryMeta', '~/domains/api/composables/useParametrizedQueryMeta'),
      higherPriorityImport('useNonParametrizedQueryMeta', '~/domains/api/composables/useNonParametrizedQueryMeta'),
    ],
    dirs: [
      resolve('app/stores/*.ts'),
      resolve('app/navigation/{composables,utils}/*.ts'),
      resolve('app/domains/*/{composables,utils}.ts'),
      resolve('app/domains/*/{composables,utils}/**'),
      resolve('app/components/**/{composables,utils}/**'),
      resolve('app/components/**/{composables,utils}.ts'),
      resolve('app/pages-components/*/composables/**'),
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
  routeRules: {
    '/**': {
      prerender: true,
    },
  },
  typescript: {
    typeCheck: 'build',
  },
  vite: {
    build: {
      target: browserslistToEsbuild(),
    },
    optimizeDeps: {
      include: [
        '@tma.js/sdk-vue',
        'fp-ts',
        'eruda',
        '@vueuse/core',
        'graphql-request',
        'valibot',
      ],
    },
    server: {
      proxy: {
        '/api/gql': {
          target: 'https://mini-apps.store',
          changeOrigin: true,
        },
      },
    },
  },
});
