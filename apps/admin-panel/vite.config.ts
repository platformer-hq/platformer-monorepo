import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import cssnano from 'cssnano';
// import { basename } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import mkcert from 'vite-plugin-mkcert';
import vueDevTools from 'vite-plugin-vue-devtools';

import packageJson from './package.json' with { type: 'json' };

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/latest',
    css: {
      postcss: { plugins: [autoprefixer(), cssnano()] },
    },
    plugins: [
      vue({
        features: {
          // TODO: This one breaks hot reload.
          // componentIdGenerator(id, source, isProduction, getHash) {
          //   return basename(id).split('.')[0] + `-${getHash(id + source)}`;
          // },
        },
      }),
      vueDevTools(),
      process.env.ANALYZER ? analyzer() : undefined,
      process.env.HTTPS ? mkcert() : undefined,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: browserslistToEsbuild(),
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            mixpanel: ['mixpanel-browser'],
            sentry: ['@sentry/vue'],
            vue: ['vue'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': 'https://mini-apps.store/',
        // '/api': 'http://localhost:10000',
      },
      // Exposes your dev server and makes it accessible for the devices in the same network.
      host: true,
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version),
    },
  };
});
