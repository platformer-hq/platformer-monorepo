import type { StyleValue } from 'vue';

export type UseSafeAreaInsetsAttrsSide = 'top' | 'bottom' | 'left' | 'right';
export type UseSafeAreaInsetsAttrsSpecificInset = 'sa' | 'csa' | 'sum';
export type UseSafeAreaInsetsAttrsInset = boolean | UseSafeAreaInsetsAttrsSpecificInset;
export interface UseSafeAreaInsetsAttrsOptions {
  /**
   * Left inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  left?: UseSafeAreaInsetsAttrsInset;
  /**
   * Right inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  right?: UseSafeAreaInsetsAttrsInset;
  /**
   * Top inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  top?: UseSafeAreaInsetsAttrsInset;
  /**
   * Bottom inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  bottom?: UseSafeAreaInsetsAttrsInset;
  /**
   * Generates a CSS variable name that should be referred to in the styles.
   */
  createReferredCssVar?(context: {
    side: UseSafeAreaInsetsAttrsSide;
    inset: UseSafeAreaInsetsAttrsSpecificInset;
  }): string;
}

export interface UseSafeAreaInsetsAttrsReturn {
  classes: string;
  style: StyleValue;
}
