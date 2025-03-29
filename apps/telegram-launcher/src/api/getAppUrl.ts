import type { AsyncOptions } from '@telegram-apps/sdk-solid';
import type { AbortablePromise } from 'better-promises';
import { looseObject, string } from 'valibot';

import { gqlRequest, type GqlRequestResult } from '@/api/gqlRequest.js';
import { maybe } from '@/validation/maybe.js';

export interface GetAppURLOptions extends AsyncOptions {
  apiBaseURL: string,
  authToken: string,
  appID: number,
  launchParams: string,
}

/**
 * Retrieves the application URL.
 * @param options - execution arguments
 * @param options - execution options
 */
export function getAppUrl(options: GetAppURLOptions): AbortablePromise<GqlRequestResult<[
  appFound: boolean,
  url?: Maybe<string>
]>> {
  return gqlRequest(
    options.apiBaseURL,
    'query GetAppURL ($appID: Int!, $launchParams: String!) {'
    + ' app(appID: $appID) {'
    + '  telegramURL(launchParams: $launchParams, isExternal: true)'
    + ' }'
    + '}',
    { appID: options.appID, launchParams: options.launchParams },
    looseObject({
      app: maybe(looseObject({
        telegramURL: maybe(string()),
      })),
    }),
    { ...options, authToken: options.authToken },
  ).then(v => v[0]
    ? [true, v[1].app ? [true, v[1].app.telegramURL] : [false]]
    : v);
}