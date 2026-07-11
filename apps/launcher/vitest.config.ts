// import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['layers/**/*.{test,spec}.ts'],
          environment: 'happy-dom',
        },
      },
      // {
      //   test: {
      //     name: 'e2e',
      //     include: ['test/e2e/*.{test,spec}.ts'],
      //     environment: 'node',
      //   },
      // },
      // await defineVitestProject({
      //   test: {
      //     name: 'nuxt',
      //     include: ['test/nuxt/*.{test,spec}.ts'],
      //     environment: 'nuxt',
      //   },
      // }),
    ],
  },
});
