import type { DeepReadonly } from 'vue';

import type { UsePageTransitionState } from '~ui-kit/composables/usePageTransition';

export const { provide: providePageTransition, inject: injectPageTransition } = createProvider<{
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
  enteredPage: DeepReadonly<ComputedRef<string | symbol | undefined>>;
}>();
