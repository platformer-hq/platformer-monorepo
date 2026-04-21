import browserslistToEsbuild from 'browserslist-to-esbuild';
import path from 'node:path';

const componentsIgnore = ['**/_/**', '**/_*'];

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

function resolveLayer(layer: string) {
  return path.resolve(__dirname, '../../nuxt-layers', layer);
}

function higherPriorityComponents(componentsPath: string, options: {
  pathPrefix?: boolean;
  pattern?: string;
  extensions?: string[];
} = {}) {
  return {
    path: componentsPath,
    pattern: options.pattern,
    pathPrefix: options.pathPrefix || false,
    extensions: options.pattern
      ? undefined
      : options.extensions || ['.vue'],
    ignore: componentsIgnore,
    priority: 100,
  };
}

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
  css: [resolve('app/assets/global.scss')],
  components: [higherPriorityComponents(resolve('app/components'))],
  extends: [resolveLayer('utils'), resolveLayer('navigation')],
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
