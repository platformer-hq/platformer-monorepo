import {
  computed,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type StyleValue,
} from 'vue';

import {
  type UseTypographyBaseAttrsOptions,
  type UseTypographyBaseAttrsAlign,
  useTypographyBaseAttrs,
} from '@/components/Typography/TypographyBase/useTypographyBaseAttrs';
import { bem } from '@/utils/bem';

import './typography-android.scss';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyAndroidAttrsVariant =
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

export type UseTypographyAndroidAttrsAlign = UseTypographyBaseAttrsAlign;

export interface UseTypographyAndroidAttrsOptions extends UseTypographyBaseAttrsOptions {
  variant?: UseTypographyAndroidAttrsVariant;
  weight?: 'regular' | 'medium';
  mono?: boolean;
}

export interface UseTypographyAndroidAttrsReturn {
  classes: string[];
  style: StyleValue;
}

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
