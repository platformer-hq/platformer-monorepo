import type {
  MiniAppGetCssVarNameFn,
  ThemeParamsGetCssVarNameFn,
  ViewportGetCSSVarNameFn,
} from '@telegram-apps/sdk-vue';

import { camelToKebab, snakeToKebab } from './casing.js';

/**
 * @returns Formatted viewport CSS variable name.
 * @param key - viewport CSS property key.
 */
export const formatThemeParamsCssVar: ThemeParamsGetCssVarNameFn = key => {
  return `--theme-${snakeToKebab(key)}`;
};

/**
 * @returns Formatted viewport CSS variable name.
 * @param key - viewport CSS property key.
 */
export const formatViewportCssVar: ViewportGetCSSVarNameFn = key => {
  const kebabed = camelToKebab(key);
  return key.startsWith('safeArea') || key.startsWith('contentSafeArea')
    ? `--${kebabed}`
    : `--viewport-${kebabed}`;
};

/**
 * @returns Formatted viewport CSS variable name.
 * @param key - viewport CSS property key.
 */
export const formatMiniAppCssVar: MiniAppGetCssVarNameFn = key => {
  return `--mini-app-${camelToKebab(key)}`;
};
