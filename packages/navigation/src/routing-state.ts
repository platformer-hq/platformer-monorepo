import { createProvider } from '@workspace/utils';
import type { ComputedRef } from 'vue';

export type RoutingDirection = 'initial' | 'forward' | 'backward';

export const { provide: provideRoutingState, inject: injectRoutingState } = createProvider<{
  direction: ComputedRef<RoutingDirection>;
}>();
