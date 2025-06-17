import type { HeaderColorKey } from '@mini-apps/telegram-bridge';
import type { RGB, KnownThemeParamsKey } from '@mini-apps/telegram-types';

/**
 * Mini App header color.
 */
export type HeaderColor = HeaderColorKey | RGB;

export type AnyColor = RGB | KnownThemeParamsKey | string;

export interface State {
  backgroundColor: AnyColor;
  bottomBarColor: AnyColor;
  headerColor: AnyColor;
  isActive: boolean;
}

export interface GetCssVarNameFn {
  /**
   * @param property - mini app property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'bgColor' | 'bottomBarColor' | 'headerColor'): string;
}
