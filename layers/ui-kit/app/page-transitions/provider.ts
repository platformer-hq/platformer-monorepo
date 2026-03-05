import type { PageTransitionState } from './components/UsePageTransition.vue';

export const [providePageTransition, injectPageTransition] = createProviderTuple<{
  state: ComputedRef<PageTransitionState>;
  enteredPage: ComputedRef<string | symbol | undefined>;
}>();
