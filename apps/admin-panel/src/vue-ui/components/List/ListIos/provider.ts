import type { ComputedRef } from 'vue';

import { createProviderTuple } from '@/providers/createProviderTuple.js';

export const [provideListItemOptions, injectListItemOptions] = createProviderTuple<{
  large: ComputedRef<boolean>;
  first: ComputedRef<boolean>;
}>();

export const [provideListOptions, injectListOptions] = createProviderTuple<{
  register: () => symbol;
  unregister: (id: symbol) => void;
  firstItem: ComputedRef<symbol | undefined>;
}>();
