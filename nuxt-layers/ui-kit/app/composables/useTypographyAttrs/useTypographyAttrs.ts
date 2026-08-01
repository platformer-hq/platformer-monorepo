import type { StyleValue } from 'vue';

import type { KnownCssColorToken } from '~colors/generated';
import { usePlatform } from '~ui-kit/_composables/usePlatform';

import './v-typography.scss';

export type UseTypographyAttrsAlign = 'left' | 'right' | 'center';
export type UseTypographyAttrsVariant = (
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'callout'
  | 'subheadline1'
  | 'subheadline2'
  | 'footnote'
  | 'caption1'
  | 'caption2'
);
export type UseTypographyAttrsWeight = ('regular' | 'medium' | 'semibold' | 'bold');

export interface UseTypographyAttrsOptions {
  align?: UseTypographyAttrsAlign;
  caps?: boolean;
  mono?: boolean;
  monoNumbers?: boolean;
  /**
   * Maximum lines allowed to display.
   */
  maxLines?: number;
  variant?: UseTypographyAttrsVariant;
  weight?: UseTypographyAttrsWeight;
  rounded?: boolean;
  color?: KnownCssColorToken;
}

export interface UseTypographyAttrsReturn {
  classes: string;
  style: StyleValue;
}

export function useTypographyAttrs(
  options: MaybeRefOrGetter<UseTypographyAttrsOptions>,
): ComputedRef<UseTypographyAttrsReturn> {
  const { b } = bem('v-typography');
  const platform = usePlatform();

  return computed(() => {
    const opts = toValue(options);
    const { maxLines } = opts;
    const prefix = platform.value;
    return {
      classes: b(
        opts.align,
        platform.value,
        {
          caps: opts.caps,
          'single-line': maxLines === 1,
          clamped: typeof maxLines === 'number' && maxLines > 1,
          [`${prefix}-mono`]: opts.mono,
          [`${prefix}-${opts.weight}`]: opts.weight,
          [`${prefix}-${opts.variant}`]: opts.variant,
        },
        platform.value === 'ios' && {
          'ios-rounded': opts.rounded,
          'ios-mono-numbers': opts.monoNumbers,
        },
      ),
      style: {
        '--max-lines': typeof maxLines === 'number' && maxLines > 1 ? maxLines : undefined,
        '--v-typography-color': opts.color
          ? cssColorTokenReference(opts.color)
          : undefined,
      },
    };
  });
}
