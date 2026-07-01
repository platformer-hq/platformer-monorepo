import type { StyleValue } from 'vue';

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
