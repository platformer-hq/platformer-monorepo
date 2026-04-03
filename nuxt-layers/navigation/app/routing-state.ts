import type { ComputedRef } from 'vue';
import { createProviderTuple } from '@workspace/base';

export type RoutingDirection = 'initial' | 'forward' | 'backward';

export const [provideRoutingState, injectRoutingState] = createProviderTuple<{
  direction: ComputedRef<RoutingDirection>;
}>();
