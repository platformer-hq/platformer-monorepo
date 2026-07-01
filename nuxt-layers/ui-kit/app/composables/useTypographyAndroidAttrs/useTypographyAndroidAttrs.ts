import type { UseTypographyAndroidAttrsOptions, UseTypographyAndroidAttrsReturn } from './types';

import './typography-android.scss';

export function useTypographyAndroidAttrs(
  options: MaybeRefOrGetter<UseTypographyAndroidAttrsOptions>,
): ComputedRef<UseTypographyAndroidAttrsReturn> {
  const baseAttrs = useTypographyBaseAttrs(options);
  const { b } = bem('tgui-typography-android');

  return computed(() => {
    const opts = toValue(options);
    const baseValue = toValue(baseAttrs);
    return {
      classes: [b(opts.variant, opts.weight, { mono: opts.mono }), baseValue.classes],
      style: baseValue.style,
    };
  });
}
