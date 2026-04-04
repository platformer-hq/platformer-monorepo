import { createProviderTuple } from '@platformer/base';
import type { ComputedRef } from 'vue';

export type RoutingDirection = 'initial' | 'forward' | 'backward';

export const [provideRoutingState, injectRoutingState] = createProviderTuple<{
  direction: ComputedRef<RoutingDirection>;
}>();
