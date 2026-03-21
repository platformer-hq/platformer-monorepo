export function useTmaPlatform() {
  const store = useTmaStore();
  return computed(() => store.platform);
}
