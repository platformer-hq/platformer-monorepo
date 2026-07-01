import type { UseTypographyBaseAttrsOptions, UseTypographyBaseAttrsReturn } from './types';

import './typography-base.scss';

export function useTypographyBaseAttrs(
  options: MaybeRefOrGetter<UseTypographyBaseAttrsOptions>,
): ComputedRef<UseTypographyBaseAttrsReturn> {
  const { b } = bem('tgui-typography-base');

  return computed(() => {
    const opts = toValue(options);
    const { maxLines } = opts;
    return {
      classes: b(opts.align, {
        caps: opts.caps,
        'single-line': maxLines === 1,
        clamped: typeof maxLines === 'number' && maxLines > 1,
      }),
      style: {
        '--max-lines': typeof maxLines === 'number' && maxLines > 1 ? maxLines : undefined,
      },
    };
  });
}
