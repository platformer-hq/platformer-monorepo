export function useParamsAppId() {
  const route = useRoute();
  return computed(() => {
    if ('appId' in route.params) {
      const { appId } = route.params;
      if (typeof appId === 'string') {
        const num = Number(appId);
        if (!Number.isNaN(num)) {
          return num;
        }
      }
    }
    throw new Error('App ID is missing in route params');
  });
}
