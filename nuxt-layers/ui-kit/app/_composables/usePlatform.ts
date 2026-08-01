export function usePlatform() {
  const injected = injectUiKitPlatform();
  return computed(() => toValue(injected));
}
