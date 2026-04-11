export function useIsCurrentPageEntered() {
  return useIsPageEntered(useRoute().name || '');
}
