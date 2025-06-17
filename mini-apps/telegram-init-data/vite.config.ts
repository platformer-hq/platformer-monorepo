import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig((_) => ({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  },
  plugins: [
    dts({ outDir: 'dist' }),
  ],
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    outDir: 'dist/entries',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        'node:crypto',
        '@mini-apps/telegram-transformers',
        '@mini-apps/telegram-types',
        'error-kid',
      ],
    },
    lib: {
      entry: {
        node: 'src/entries/node.ts',
        web: 'src/entries/web.ts',
      },
      formats: ['es', 'cjs'],
      fileName(format, entry) {
        return `${entry}.${format === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
}));
