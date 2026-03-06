import type { StyleValue } from 'vue';

import './TypographyBase.scss';

export type UseTypographyBaseAlign = 'left' | 'right' | 'center';

export interface UseTypographyBaseOptions {
  align?: UseTypographyBaseAlign;
  caps?: boolean;
  /**
   * Maximum lines allowed to display.
   * @default 'infinite'
   */
  maxLines?: number | 'infinite';
}

export interface UseTypographyBaseReturn {
  classes: string;
  style: StyleValue;
}

export function useTypographyBase(
  options: MaybeRefOrGetter<UseTypographyBaseOptions>,
): ComputedRef<UseTypographyBaseReturn> {
  const { b } = bem('typography-base');

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
