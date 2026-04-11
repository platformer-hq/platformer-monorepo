import { type UsePageTransitionState, createProvider } from '@tma.js/vue-kit';
import type { DeepReadonly } from 'vue';

export const { provide: providePageTransition, inject: injectPageTransition } = createProvider<{
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
  enteredPage: DeepReadonly<ComputedRef<string | symbol | undefined>>;
}>();
