import type { ComputedRef, MaybeRefOrGetter, StyleValue } from 'vue';

export type UseColorBoxColor = ColorReferenceAnyColor;
export interface UseColorBoxOptions {
  bg?: Maybe<UseColorBoxColor>;
  text?: Maybe<UseColorBoxColor>;
  border?: Maybe<UseColorBoxColor>;
}

export function useColorBox(options: MaybeRefOrGetter<UseColorBoxOptions>): {
  style: ComputedRef<StyleValue>;
} {
  return {
    style: computed(() => {
      const values = toValue(options);
      return {
        backgroundColor: colorReference(values.bg) || undefined,
        color: colorReference(values.text) || undefined,
        borderColor: colorReference(values.border) || undefined,
      };
    }),
  };
}
