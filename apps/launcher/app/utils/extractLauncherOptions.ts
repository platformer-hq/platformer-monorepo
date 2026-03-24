import * as v from 'valibot';

import type { LocationQuery } from '#vue-router';

function positiveIntFromStr() {
  return v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1));
}

/**
 * Extracts the launcher options from the window location.
 */
export function extractLauncherOptions(query: LocationQuery): ({
  ok: true;
  options: {
    appId: number;
    apiBaseUrl: string;
    fallbackUrl?: string | null;
    initTimeout: number;
    loadTimeout: number;
  };
} | {
  ok: false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: v.ValiError<any>;
}) {
  try {
    const argsObject = v.parse(
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
      }),
      query,
    );
    return {
      ok: true,
      options: {
        appId: argsObject.app_id,
        apiBaseUrl: argsObject.api_base_url,
        fallbackUrl: argsObject.fallback_url,
        initTimeout: argsObject.init_timeout,
        loadTimeout: argsObject.load_timeout,
      },
    };
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ok: false, error: (e as v.ValiError<any>) };
  }
}
