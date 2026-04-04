import {
  type MaybeRefOrGetter,
  type ComputedRef,
  computed,
  toValue,
} from 'vue';

import { bem } from '@/utils/bem';

import './SafeAreaInsets.scss';

export type UseSafeAreaInsetsInset = boolean | 'sa' | 'csa' | 'sum';
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
}

export function useSafeAreaInsets(options: MaybeRefOrGetter<UseSafeAreaInsetsOptions>): {
  classes: ComputedRef<string>;
} {
  const { b } = bem('safe-area-insets');
  return {
    classes: computed(() => {
      const values = toValue(options);
      return b((['top', 'bottom', 'left', 'right'] as const).map(side => {
        const value = values[side];
        return value
          ? value === true
            ? `sum-${side}`
            : `${value}-${side}`
          : undefined;
      }));
    }),
  };
}
