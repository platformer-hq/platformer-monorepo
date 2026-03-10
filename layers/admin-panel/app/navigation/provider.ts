import type { DeepReadonly } from 'vue';

import type { UsePageTransitionState } from '#layers/ui-kit';

export const [providePageTransition, injectPageTransition] = createProviderTuple<{
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
  enteredPage: DeepReadonly<ComputedRef<string | symbol | undefined>>;
}>();
