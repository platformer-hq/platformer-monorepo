import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const tsconfigPath = resolve(import.meta.dirname, 'tsconfig.build.json');

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath,
      outDir: 'dist/dts',
      cleanVueFileName: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', 'pinia', '@vueuse/core', 'vue-router'],
      output: {
        globals: { vue: 'Vue', pinia: 'Pinia' },
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
    minify: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
