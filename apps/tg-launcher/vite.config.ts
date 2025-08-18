import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import mkcert from 'vite-plugin-mkcert';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
    rollupOptions: {
      output: {
        manualChunks: {
          sentry: ['@sentry/vue'],
        },
      },
    },
  },
  server: {
    proxy: {
      // '/api': 'https://mini-apps.store/',
      '/api': 'http://localhost:10000',
    },
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
});
