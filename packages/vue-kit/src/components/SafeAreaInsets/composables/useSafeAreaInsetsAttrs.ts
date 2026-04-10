import {
  type MaybeRefOrGetter,
  computed,
  toValue,
  type CSSProperties,
  type StyleValue,
  type ComputedRef,
} from 'vue';

import { bem } from '@/utils/bem';

import './safe-area-insets.scss';

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

export function useSafeAreaInsetsAttrs(
  options: MaybeRefOrGetter<UseSafeAreaInsetsAttrsOptions>,
): ComputedRef<UseSafeAreaInsetsAttrsReturn> {
  const { b } = bem('tgui-safe-area-insets');
  const sides: UseSafeAreaInsetsAttrsSide[] = ['top', 'bottom', 'left', 'right'];

  return computed(() => {
    const values = toValue(options);
    const createReferredCssVar = values.createReferredCssVar || (context => {
      return `--tg-viewport-${{
        sa: 'safe-area-inset',
        csa: 'content-safe-area-inset',
        sum: 'sum-inset',
      }[context.inset]}-${context.side}`;
    });
    const insets = sides.reduce<{
      [Side in UseSafeAreaInsetsAttrsSide]?: UseSafeAreaInsetsAttrsSpecificInset
    }>((acc, side) => {
      const value = values[side];
      if (value) {
        acc[side] = value === true ? 'sum' : value;
      }
      return acc;
    }, {});

    return {
      style: sides.reduce<CSSProperties>((acc, side) => {
        const inset = insets[side];
        if (inset) {
          acc[`--padding-${side}`] = `var(${createReferredCssVar({ side, inset })})`;
        }
        return acc;
      }, {}),
      classes: b(Object.keys(insets)),
    };
  });
}
