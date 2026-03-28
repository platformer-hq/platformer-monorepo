// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.nuxt/nuxt.node.d.ts" />
import path from 'node:path';

import { iifeUrlPlugin } from './vite/iifeUrlPlugin';

function resolve(filePath: string) {
  return path.resolve(__dirname, filePath);
}

function resolvePackage(pkg: string) {
  return path.resolve(__dirname, '../../packages', pkg);
}

const componentsIgnore = ['**/_/**', '**/_*'];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    // '@sentry/nuxt/module'
  ],
  alias: {
    '@': resolve('app'),
    '~': resolve('app'),
    '#packages': resolve('../../packages'),
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
  appId: 'launcher',
  css: [
    resolve('app/assets/global.scss'),
  ],
  components: [{
    path: resolve('app/components'),
    pathPrefix: false,
    extensions: ['.vue'],
    ignore: componentsIgnore,
    priority: 100,
  }],
  extends: [
    // '../api',
    // '../base',
    resolvePackage('navigation'),
    resolvePackage('ui-kit'),
    resolvePackage('tma'),
  ],
  imports: {
    dirs: [
      resolve('app/stores/*.ts'),
      // resolve('app/components/**/{composables,utils}/**'),
      // resolve('app/components/**/{composables,utils}.ts'),
      // resolve('app/pages-components/*/composables/**'),
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
  ssr: false,
  // typescript: {
  //   typeCheck: 'build',
  // },
  vite: {
    plugins: [
      iifeUrlPlugin(),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://mini-apps.store',
          changeOrigin: true,
        },
      },
    },
  },
});
