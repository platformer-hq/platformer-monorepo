import {
  type MaybeRefOrGetter,
  computed,
  toValue,
  type CSSProperties,
} from 'vue';

import { bem } from '@/utils/bem';

import './safe-area-insets.scss';

export type UseSafeAreaInsetsSide = 'top' | 'bottom' | 'left' | 'right';
export type UseSafeAreaInsetsSpecificInset = 'sa' | 'csa' | 'sum';
export type UseSafeAreaInsetsInset = boolean | UseSafeAreaInsetsSpecificInset;
export interface UseSafeAreaInsetsOptions {
  /**
   * Left inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  left?: UseSafeAreaInsetsInset;
  /**
   * Right inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  right?: UseSafeAreaInsetsInset;
  /**
   * Top inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  top?: UseSafeAreaInsetsInset;
  /**
   * Bottom inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  bottom?: UseSafeAreaInsetsInset;
  /**
   * Generates a CSS variable name that should be referred to in the styles.
   */
  createReferredCssVar?(context: {
    side: UseSafeAreaInsetsSide;
    inset: UseSafeAreaInsetsSpecificInset;
  }): string;
}

export function useSafeAreaInsets(options: MaybeRefOrGetter<UseSafeAreaInsetsOptions>) {
  const { b } = bem('tgui-safe-area-insets');
  const sides: UseSafeAreaInsetsSide[] = ['top', 'bottom', 'left', 'right'];

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
      [Side in UseSafeAreaInsetsSide]?: UseSafeAreaInsetsSpecificInset
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
