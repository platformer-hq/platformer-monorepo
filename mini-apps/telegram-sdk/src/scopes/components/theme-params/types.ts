import type { ThemeParams } from '@mini-apps/telegram-types';

export interface GetCssVarNameFn {
  /**
   * @param property - palette key.
   * @returns Computed complete CSS variable name.
   */
  (property: Extract<keyof ThemeParams, string>): string;
}
