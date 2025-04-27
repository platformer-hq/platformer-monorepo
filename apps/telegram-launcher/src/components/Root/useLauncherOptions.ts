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
  ValiError,
} from 'valibot';
import { transformQueryUsing } from '@telegram-apps/sdk-solid';
import { splitExecutionTuple } from 'solid-utils';

function positiveIntFromStr() {
  return pipe(string(), transform(Number), integer(), minValue(1));
}

export function useLauncherOptions() {
  return splitExecutionTuple<{
    appID: number;
    apiBaseURL: string;
    fallbackURL?: Maybe<string>;
    initTimeout: number;
    loadTimeout: number;
  }, ValiError<any>>(() => {
    try {
      const argsObject = parse(
        pipe(
          union([instance(URLSearchParams), string()]),
          transformQueryUsing(
            looseObject({
              app_id: positiveIntFromStr(),
              api_base_url: optional(
                pipe(
                  string(),
                  transform(v => new URL(v, window.location.origin).toString()),
                ),
                'https://mini-apps.store/gql',
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
      return [true, {
        appID: argsObject.app_id,
        apiBaseURL: argsObject.api_base_url,
        fallbackURL: argsObject.fallback_url,
        initTimeout: argsObject.init_timeout,
        loadTimeout: argsObject.load_timeout,
      }];
    } catch (e) {
      return [false, (e as ValiError<any>)];
    }
  });
}