import * as fp from 'fp-ts';
import * as v from 'valibot';

import type { LocationQuery } from '#vue-router';

function positiveIntFromStr() {
  return v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1));
}

/**
 * Extracts the launcher options from the window location.
 */
export function extractLauncherOptions(
  query: LocationQuery,
): fp.either.Either<
  v.ValiError<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>,
  {
    appId: number;
    apiBaseUrl: string;
    fallbackUrl?: string;
    initTimeout: number;
    loadTimeout: number;
    queryLp: boolean;
  }
> {
  const parseResult = v.safeParse(
    v.looseObject({
      app_id: positiveIntFromStr(),
      // app_id: v.optional(positiveIntFromStr(), '1'),
      api_base_url: v.optional(
        v.string(),
        import.meta.env.DEV ? '/api/' : 'https://mini-apps.store/api/',
      ),
      fallback_url: v.optional(v.string()),
      init_timeout: v.optional(positiveIntFromStr(), '5000'),
      load_timeout: v.optional(positiveIntFromStr(), '10000'),
      query_lp: v.optional(v.boolean(), false),
    }),
    query,
  );
  if (!parseResult.success) {
    return fp.either.left(new v.ValiError(parseResult.issues));
  }
  const { output } = parseResult;
  return fp.either.right({
    appId: output.app_id,
    apiBaseUrl: new URL(output.api_base_url, window.location.origin).toString(),
    fallbackUrl: output.fallback_url,
    initTimeout: output.init_timeout,
    loadTimeout: output.load_timeout,
    queryLp: output.query_lp,
  });
}
