import type { StyleValue } from 'vue';

import './TypographyAndroid.scss';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyAndroidVariant =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'callout'
  | 'subheadline1'
  | 'subheadline2'
  | 'footnote'
  | 'caption1'
  | 'caption2';

export type UseTypographyAndroidAlign = UseTypographyBaseAlign;

export interface UseTypographyAndroidOptions extends UseTypographyBaseOptions {
  variant?: UseTypographyAndroidVariant;
  weight?: 'regular' | 'medium';
  mono?: boolean;
}

export interface UseTypographyAndroidReturn {
  classes: string[];
  style: StyleValue;
}

export function useTypographyAndroid(
  options: MaybeRefOrGetter<UseTypographyAndroidOptions>,
): ComputedRef<UseTypographyAndroidReturn> {
  const base = useTypographyBase(options);
  const { b } = bem('typography-android');

  return computed(() => {
    const opts = toValue(options);
    const baseValue = toValue(base);
    return {
      classes: [b(opts.variant, opts.weight, { mono: opts.mono }), baseValue.classes],
      style: baseValue.style,
    };
  });
}
