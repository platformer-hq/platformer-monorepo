export const [provideViewTransition, injectViewTransition] = createProviderTuple<{
  isEntered: ComputedRef<boolean>;
}>();
