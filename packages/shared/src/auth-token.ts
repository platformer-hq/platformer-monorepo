import { date, looseObject, parse, pipe, string, transform } from 'valibot';
import { deleteStorageItem, getStorageItem, setStorageItem } from 'utils';
import { createSignal } from 'solid-js';
import { type MaybeAccessor, access } from 'solid-utils';
import { type RequestOptions, GraphQLError } from 'solid-gql';
import { Authenticate, type AuthenticateMutation, type AuthenticateMutationVariables } from 'api';
import { isTimeoutError } from 'better-promises';

import { useGqlQuery, type UseGqlQueryOptions } from './gql/useGqlQuery.js';

export interface UseAuthTokenOptions
  extends Omit<
    UseGqlQueryOptions<AuthenticateMutation, AuthenticateMutationVariables>,
    'freshAge' | 'staleAge' | 'shouldRetry'
  > {
  appID?: MaybeAccessor<number>,
  initData: MaybeAccessor<string>,
  request?: MaybeAccessor<Omit<RequestOptions, 'variables'>>;
}

const STORAGE_KEY = '@platformer/auth-token';

const AuthToken = looseObject({
  token: string(),
  expiresAt: pipe(string(), transform((v) => new Date(v)), date()),
});

/**
 * @returns Platformer authorization token from the safe storage.
 */
function getAuthTokenFromStorage(): { token: string, expiresAt: Date } | undefined {
  try {
    const json = parse(AuthToken, JSON.parse(getStorageItem(STORAGE_KEY)));
    // Check if the token hasn't expired. We consider it expired if less than 30 seconds left
    // until the expiration date.
    return Date.now() + 30000 <= json.expiresAt.getTime() ? json : undefined;
  } catch {
  }
}

/**
 * Retrieves the current user Platformer authorization token. The function automatically retrieves
 * the token from the storage in case it is considered as non-expired. It also automatically
 * saves it if the authentication request was performed.
 * @param options - additional options.
 */
export function useAuthToken(options: UseAuthTokenOptions) {
  const { onReady, request, ...rest } = options;
  const [$token, setToken] = createSignal(getAuthTokenFromStorage());

  const [$query, utils] = useGqlQuery(
    Authenticate,
    () => $token()
      ? undefined
      : [[{ appID: access(options.appID), initData: access(options.initData) }, access(request)]],
    {
      ...rest,
      freshAge: 0,
      onReady(vars, data, cached) {
        const { authenticateTelegram } = data;
        setToken({
          token: authenticateTelegram.token,
          expiresAt: new Date(authenticateTelegram.expiresAt),
        });
        onReady && onReady(vars, data, cached);
      },
      shouldRetry(err) {
        // Do not retry if timeout was reached, or the passed init data is invalid.
        return !isTimeoutError(err)
          || !GraphQLError.is(err)
          || !err.isOfType('ERR_INIT_DATA_INVALID');
      },
      staleAge: 0,
    },
  );

  createSignal(() => {
    const token = $token();
    if (token) {
      setStorageItem(STORAGE_KEY, JSON.stringify({
        token: token.token,
        expiresAt: token.expiresAt.toISOString(),
      }));
    } else {
      deleteStorageItem(STORAGE_KEY);
    }
  });

  return [
    [$token, setToken],
    [$query, utils],
  ] as const;
}