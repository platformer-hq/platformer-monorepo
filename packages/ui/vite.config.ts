import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const tsconfigPath = mode === 'development'
    ? 'tsconfig.storybook.json'
    : 'tsconfig.build.json';
  const platform = process.env.PLATFORM;
  if (!['all', 'ios', 'android'].includes(platform)) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  return {
    plugins: [
      dts({ outDir: `dist/dts`, tsconfigPath }),
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
      outDir: `dist/${platform}`,
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: `src/index.${platform}.ts`,
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [
          'solid-js',
          'solid-utils',
          '@solid-primitives/event-listener',
          '@solid-primitives/memo',
          '@solid-primitives/utils',
          'solid-transition-group',
        ],
      },
    },
  };
});
