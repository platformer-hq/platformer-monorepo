import type { ComputedRef } from 'vue';

import { createProviderTuple } from '@/utils/createProviderTuple';

export const [provideListItemOptions, injectListItemOptions] = createProviderTuple<{
  large: ComputedRef<boolean>;
}>();
