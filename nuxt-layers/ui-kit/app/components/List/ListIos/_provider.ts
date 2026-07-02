import type { ComputedRef } from 'vue';

export const { provide: provideListItemOptions, inject: injectListItemOptions } = createProvider<{
  large: ComputedRef<boolean>;
}>();
