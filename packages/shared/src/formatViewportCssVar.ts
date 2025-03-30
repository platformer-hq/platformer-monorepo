import type { ViewportGetCSSVarNameKey } from '@telegram-apps/sdk-solid';

import { camelToKebab } from './camelToKebab.js';

/**
 * @returns Formatted viewport CSS variable name.
 * @param key - viewport CSS property key.
 */
export function formatViewportCssVar(key: ViewportGetCSSVarNameKey): string {
  const kebabed = camelToKebab(key);
  return key.startsWith('safeArea') || key.startsWith('contentSafeArea')
    ? `--${kebabed}`
    : `--viewport-${kebabed}`;
}