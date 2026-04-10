import {
  computed,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type StyleValue,
} from 'vue';

import { bem } from '@/utils/bem';

import './typograhy-base.scss';

export type UseTypographyBaseAttrsAlign = 'left' | 'right' | 'center';

export interface UseTypographyBaseAttrsOptions {
  align?: UseTypographyBaseAttrsAlign;
  caps?: boolean;
  /**
   * Maximum lines allowed to display.
   */
  maxLines?: number;
}

export interface UseTypographyBaseAttrsReturn {
  classes: string;
  style: StyleValue;
}

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
