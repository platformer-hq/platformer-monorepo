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

import './typography-ios.scss';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyIosAttrsVariant =
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

export type UseTypographyIosAttrsAlign = UseTypographyBaseAttrsAlign;

export interface UseTypographyIosAttrsOptions extends UseTypographyBaseAttrsOptions {
  variant?: UseTypographyIosAttrsVariant;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  rounded?: boolean;
}

export interface UseTypographyIosAttrsReturn {
  classes: string[];
  style: StyleValue;
}

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
