import * as v from 'valibot';

function positiveIntFromStr() {
  return v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1));
}

export function useLauncherOptions() {
  const route = useRoute();

  return computed(() => {
    if (import.meta.prerender) {
      return { kind: 'prerender' as const };
    }
    const parseResult = v.safeParse(
      v.looseObject({
        app_id: positiveIntFromStr(),
        // app_id: v.optional(positiveIntFromStr(), '2'),
        fallback_url: v.optional(v.string()),
        init_timeout: v.optional(positiveIntFromStr(), '5000'),
        load_timeout: v.optional(positiveIntFromStr(), '10000'),
        query_lp: v.optional(v.pipe(v.string(), v.transform(val => val === '1')), ''),
      }),
      route.query,
    );
    if (!parseResult.success) {
      return { kind: 'error' as const, error: new v.ValiError(parseResult.issues) };
    }
    const { output } = parseResult;
    return {
      kind: 'options' as const,
      options: {
        appId: output.app_id,
        fallbackUrl: output.fallback_url,
        initTimeout: output.init_timeout,
        loadTimeout: output.load_timeout,
        queryLp: output.query_lp,
      },
    };
  });
}
