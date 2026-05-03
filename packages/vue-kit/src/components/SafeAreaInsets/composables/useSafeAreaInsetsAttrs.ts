import {
  type MaybeRefOrGetter,
  computed,
  toValue,
  type ComputedRef,
} from 'vue';

import { bem } from '@/utils/bem';

import './safe-area-insets.scss';

export type UseSafeAreaInsetsAttrsSide = 'top' | 'bottom' | 'left' | 'right';
export type UseSafeAreaInsetsAttrsSpecificInset = 'sa' | 'csa' | 'sum';
export type UseSafeAreaInsetsAttrsInset = boolean | UseSafeAreaInsetsAttrsSpecificInset;
export type UseSafeAreaInsetsAttrsOptions = {
  /**
   * Inset configuration.
   * - `false` to disable the inset.
   * - `sa` to use the safe area inset.
   * - `csa` to use the content safe area inset.
   * - `sum` or `true` to use the content safe area inset added up to the safe area inset.
   */
  [K in UseSafeAreaInsetsAttrsSide | 'all']?: UseSafeAreaInsetsAttrsInset;
};

export interface UseSafeAreaInsetsAttrsReturn {
  classes: string[];
}

function formatInset(
  value: true | UseSafeAreaInsetsAttrsSpecificInset,
): UseSafeAreaInsetsAttrsSpecificInset {
  return value === true ? 'sum' : value;
}

export function useSafeAreaInsetsAttrs(
  options: MaybeRefOrGetter<UseSafeAreaInsetsAttrsOptions>,
): ComputedRef<UseSafeAreaInsetsAttrsReturn> {
  const { b } = bem('tgui-safe-area-insets');
  const sides: UseSafeAreaInsetsAttrsSide[] = ['top', 'bottom', 'left', 'right'];

  return computed(() => {
    const values = toValue(options);
    const insets: string[] = [];

    if (values.all) {
      const formatted = formatInset(values.all);
      insets.push(...sides.map(side => `${side}-${formatted}`));
    } else {
      insets.push(
        ...sides.reduce<string[]>((acc, side) => {
          const value = values[side];
          if (value) {
            acc.push(`${side}-${formatInset(value)}`);
          }
          return acc;
        }, []),
      );
    }

    return {
      classes: b(insets).split(' '),
    };
  });
}
