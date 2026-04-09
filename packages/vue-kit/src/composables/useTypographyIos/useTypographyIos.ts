import {
  computed,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type StyleValue,
} from 'vue';

import {
  type UseTypographyBaseOptions,
  type UseTypographyBaseAlign,
  useTypographyBase,
} from '@/composables/useTypographyBase/useTypographyBase';
import { bem } from '@/utils/bem';

import './TypographyIos.scss';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyIosVariant =
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

export type UseTypographyIosAlign = UseTypographyBaseAlign;

export interface UseTypographyIosOptions extends UseTypographyBaseOptions {
  variant?: UseTypographyIosVariant;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  rounded?: boolean;
}

export interface UseTypographyIosReturn {
  classes: string[];
  style: StyleValue;
}

export function useTypographyIos(
  options: MaybeRefOrGetter<UseTypographyIosOptions>,
): ComputedRef<UseTypographyIosReturn> {
  const base = useTypographyBase(options);
  const { b } = bem('typography-ios');

  return computed(() => {
    const opts = toValue(options);
    const baseValue = toValue(base);
    return {
      classes: [b(opts.variant, opts.weight, { rounded: opts.rounded }), baseValue.classes],
      style: baseValue.style,
    };
  });
}
