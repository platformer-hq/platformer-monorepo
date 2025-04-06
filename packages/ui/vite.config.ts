import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const tsconfigPath = mode === 'development'
    ? 'tsconfig.storybook.json'
    : 'tsconfig.build.json';
  return {
    plugins: [
      dts({ outDir: 'dist/dts', tsconfigPath }),
      tsconfigPaths({ projects: [tsconfigPath] }),
      solidPlugin(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        external: ['solid-js', 'solid-utils'],
      },
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
    },
  };
});
