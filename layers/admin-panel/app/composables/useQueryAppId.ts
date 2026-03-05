import { looseObject, parse, pipe, string, transform } from 'valibot';

export function useQueryAppId() {
  const route = useRoute();
  return computed(() => {
    return parse(
      looseObject({ appId: pipe(string(), transform(Number)) }),
      route.query,
    ).appId;
  });
}
