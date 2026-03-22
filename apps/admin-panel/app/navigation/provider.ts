import type { DeepReadonly } from 'vue';

import type { UsePageTransitionState } from '#packages/ui-kit';

export const [providePageTransition, injectPageTransition] = createProviderTuple<{
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
  enteredPage: DeepReadonly<ComputedRef<string | symbol | undefined>>;
}>();
