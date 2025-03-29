import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    rollupOptions: {
      external: 'dequal/lite',
    },
    emptyOutDir: true,
    target: 'esnext',
    lib: {
      formats: ['es'],
      fileName: 'index',
      entry: './src/index.ts',
    },
  },
});
