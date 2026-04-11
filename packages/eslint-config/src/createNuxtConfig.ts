import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

import { tsConfigs } from './typescript.js';

/**
 * Creates a Nuxt ESLint config with shared base rules.
 * Use this for Nuxt applications in the monorepo.
 */
export function createNuxtConfig(options: {
  /**
   * Additional source directories to lint.
   */
  srcDirs?: string[];
} = {}) {
  const { srcDirs } = options;

  return createConfigForNuxt({
    features: { standalone: true },
    dirs: {
      src: srcDirs,
    },
  })
    .removePlugins('import')
    .remove('nuxt/import/rules')
    .append(...tsConfigs);
}
