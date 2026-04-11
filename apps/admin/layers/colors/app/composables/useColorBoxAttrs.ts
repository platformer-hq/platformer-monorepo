import type { ComputedRef, MaybeRefOrGetter, StyleValue } from 'vue';

export type UseColorBoxAttrsColor = ColorReferenceAnyColor;
export interface UseColorBoxAttrsOptions {
  bg?: UseColorBoxAttrsColor | undefined | null;
  text?: UseColorBoxAttrsColor | undefined | null;
  border?: UseColorBoxAttrsColor | undefined | null;
}

export function useColorBoxAttrs(options: MaybeRefOrGetter<UseColorBoxAttrsOptions>): {
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
