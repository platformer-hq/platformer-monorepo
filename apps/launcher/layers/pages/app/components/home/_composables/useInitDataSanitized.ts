export function useInitDataSanitized(initDataRaw: MaybeRefOrGetter<string | undefined>) {
  return computed(() => {
    const initData = toValue(initDataRaw);
    if (!initData) {
      return;
    }
    const searchParams = new URLSearchParams(initData);
    searchParams.delete('hash');
    return searchParams.toString();
  });
}
