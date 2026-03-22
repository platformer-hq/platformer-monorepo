import type { ComputedRef } from 'vue';

export const [provideListItemOptions, injectListItemOptions] = createProviderTuple<{
  large: ComputedRef<boolean>;
}>();
