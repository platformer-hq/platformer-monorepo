import type { ComputedRef } from 'vue';

import { createProvider } from '@/utils/createProvider';

export const { provide: provideListItemOptions, inject: injectListItemOptions } = createProvider<{
  large: ComputedRef<boolean>;
}>();
