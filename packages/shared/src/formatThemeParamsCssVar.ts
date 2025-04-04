import type { ThemeParams } from '@telegram-apps/sdk-solid';
import { snakeToKebab } from 'utils';

/**
 * @returns Formatted viewport CSS variable name.
 * @param key - viewport CSS property key.
 */
export function formatThemeParamsCssVar(key: keyof ThemeParams): string {
  return `--theme-${snakeToKebab(key)}`;
}