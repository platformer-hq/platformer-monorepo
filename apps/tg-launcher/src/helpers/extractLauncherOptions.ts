import { transformQueryUsing } from '@telegram-apps/sdk-vue';
import {
  instance,
  integer,
  looseObject,
  minValue,
  optional,
  parse,
  pipe,
  string,
  transform,
  union,
  type ValiError,
} from 'valibot';

function positiveIntFromStr() {
  return pipe(string(), transform(Number), integer(), minValue(1));
}

/**
 * Extracts the launcher options from the window location.
 */
export function extractLauncherOptions():
  | {
  ok: true,
  options: {
    appID: number;
    apiBaseURL: string;
    fallbackURL?: string | null;
    initTimeout: number;
    loadTimeout: number;
  }
}
  | {
  ok: false,
  error: ValiError<any>
} {
  try {
    const argsObject = parse(
      pipe(
        union([instance(URLSearchParams), string()]),
        transformQueryUsing(
          looseObject({
            app_id: positiveIntFromStr(),
            // app_id: optional(positiveIntFromStr(), '1'),
            api_base_url: optional(
              pipe(
                string(),
                transform(v => new URL(v, window.location.origin).toString()),
              ),
              import.meta.env.DEV ? '/gql' : 'https://mini-apps.store/gql',
            ),
            fallback_url: optional(string()),
            init_timeout: optional(positiveIntFromStr(), '5000'),
            load_timeout: optional(positiveIntFromStr(), '10000'),
          }),
        ),
      ),
      new URLSearchParams(
        // Telegram API has a bug replacing & with &amp; for some reason. We are replacing it
        // back.
        window.location.search.replace(/&amp;/g, '&'),
      ),
    );
    return {
      ok: true,
      options: {
        appID: argsObject.app_id,
        apiBaseURL: argsObject.api_base_url,
        fallbackURL: argsObject.fallback_url,
        initTimeout: argsObject.init_timeout,
        loadTimeout: argsObject.load_timeout,
      },
    };
  } catch (e) {
    return { ok: false, error: (e as ValiError<any>) };
  }
}