import type { UseTypographyIosAttrsOptions, UseTypographyIosAttrsReturn } from './types';

import './typography-ios.scss';

export function useTypographyIosAttrs(
  options: MaybeRefOrGetter<UseTypographyIosAttrsOptions>,
): ComputedRef<UseTypographyIosAttrsReturn> {
  const baseAttrs = useTypographyBaseAttrs(options);
  const { b } = bem('tgui-typography-ios');

  return computed(() => {
    const opts = toValue(options);
    const baseValue = toValue(baseAttrs);
    return {
      classes: [b(opts.variant, opts.weight, { rounded: opts.rounded }), baseValue.classes],
      style: baseValue.style,
    };
  });
}
