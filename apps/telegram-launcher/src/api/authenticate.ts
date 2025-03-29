import type { AsyncOptions } from '@telegram-apps/sdk-solid';
import type { AbortablePromise } from 'better-promises';
import { looseObject } from 'valibot';

import { gqlRequest, type GqlRequestResult } from '@/api/gqlRequest.js';
import { AuthToken } from '@/validation/AuthToken.js';

export interface AuthenticateOptions extends AsyncOptions {
  apiBaseURL: string,
  appID: number,
  initData: string,
}

/**
 * Authenticates the current user.
 * @param options - execution options.
 */
export function authenticate(options: AuthenticateOptions): AbortablePromise<GqlRequestResult<{
  token: string;
  expiresAt: Date;
}>> {
  return gqlRequest(
    options.apiBaseURL,
    'mutation Authenticate($appID: Int, $initData: String!) {'
    + ' authenticateTelegram(appID: $appID, initData: $initData) {'
    + '  token'
    + '  expiresAt'
    + ' }'
    + '}',
    { appID: options.appID, initData: options.initData },
    looseObject({ authenticateTelegram: AuthToken }),
    options,
  ).then(v => v[0]
    ? [true, v[1].authenticateTelegram]
    : v);
}