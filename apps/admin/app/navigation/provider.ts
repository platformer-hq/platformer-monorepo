import type { UsePageTransitionState } from '@workspace/ui-kit';
import type { DeepReadonly } from 'vue';

export const [providePageTransition, injectPageTransition] = createProviderTuple<{
  state: DeepReadonly<ComputedRef<UsePageTransitionState>>;
  enteredPage: DeepReadonly<ComputedRef<string | symbol | undefined>>;
}>();
