import type { ComputedRef, MaybeRefOrGetter, StyleValue } from 'vue';

export type UseColorBoxColor = ColorReferenceAnyColor;
export interface UseColorBoxOptions {
  bg?: UseColorBoxColor | undefined | null;
  text?: UseColorBoxColor | undefined | null;
  border?: UseColorBoxColor | undefined | null;
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
