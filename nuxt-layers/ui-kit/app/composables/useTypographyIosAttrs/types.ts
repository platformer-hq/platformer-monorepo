import type { StyleValue } from 'vue';

import type {
  UseTypographyBaseAttrsAlign,
  UseTypographyBaseAttrsOptions,
} from '../useTypographyBaseAttrs/types';

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
export type UseTypographyIosAttrsWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface UseTypographyIosAttrsOptions extends UseTypographyBaseAttrsOptions {
  variant?: UseTypographyIosAttrsVariant;
  weight?: UseTypographyIosAttrsWeight;
  rounded?: boolean;
}

export interface UseTypographyIosAttrsReturn {
  classes: string[];
  style: StyleValue;
}
