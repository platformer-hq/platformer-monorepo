import type { CSSProperties } from 'vue';

import type {
  UseSafeAreaInsetsAttrsOptions, UseSafeAreaInsetsAttrsReturn, UseSafeAreaInsetsAttrsSide,
  UseSafeAreaInsetsAttrsSpecificInset,
} from './types';

import './safe-area-insets.scss';

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
