import { iifeUrlPlugin } from '@workspace/vite-plugins';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

const componentsIgnore = ['**/_/**', '**/_*'];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@pinia/colada-nuxt'],
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
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'ru', name: 'Russian', language: 'ru-RU' },
    ],
    defaultLocale: 'en',
  },
  nitro: {
    preset: 'netlify',
  },
  postcss: {
    plugins: {
      autoprefixer: {},
      cssnano: {},
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
        'eruda',
        'valibot',
        'fp-ts',
        '@vueuse/core',
        'error-kid',
      ],
    },
    plugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error ABC
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
