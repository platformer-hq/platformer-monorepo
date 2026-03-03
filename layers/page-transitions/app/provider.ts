export const [provideViewTransition, injectViewTransition] = createProviderTuple<{
  enteredPage: ComputedRef<string | symbol | undefined>;
}>();
