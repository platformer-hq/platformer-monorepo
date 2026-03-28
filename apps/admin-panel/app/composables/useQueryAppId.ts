import * as v from 'valibot';

export function useQueryAppId() {
  const route = useRoute();
  return computed(() => {
    return v.parse(
      v.looseObject({ appId: v.pipe(v.string(), v.transform(Number)) }),
      route.query,
    ).appId;
  });
}
