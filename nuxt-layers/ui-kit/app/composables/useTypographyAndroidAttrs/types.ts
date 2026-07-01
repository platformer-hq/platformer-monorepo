import type { StyleValue } from 'vue';

import type {
  UseTypographyBaseAttrsAlign,
  UseTypographyBaseAttrsOptions,
} from '../useTypographyBaseAttrs/types';

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
export type UseTypographyAndroidAttrsWeight = 'regular' | 'medium';

export interface UseTypographyAndroidAttrsOptions extends UseTypographyBaseAttrsOptions {
  variant?: UseTypographyAndroidAttrsVariant;
  weight?: 'regular' | 'medium';
  mono?: boolean;
}

export interface UseTypographyAndroidAttrsReturn {
  classes: string[];
  style: StyleValue;
}
