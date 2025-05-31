import type { DocumentNode } from 'api';
import type {
  SWRStoreOnErrorFn,
  SWRStoreOnErrorPayload,
  SWRStoreOnSuccessFn,
  SWRStoreOnSuccessPayload,
  UseSWROptionsArgs,
  UseSWRResult,
} from 'solid-swr';
import {
  useGqlScoped,
  type UseGqlOptions,
  type UseGqlError,
  type GqlRequestOptions,
  type GqlRequestParameters,
} from 'solid-gql';
import { access } from '@solid-primitives/utils';

import { useGqlContext } from './GqlProvider.js';
import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

export type UseGqlQueryParams<V extends object> = V | [
  variables: V,
  options?: Omit<GqlRequestOptions, 'variables'>
];
export type UseGqlQueryOnErroredFn<V> = SWRStoreOnErrorFn<V, UseGqlError>;
export type UseGqlQueryOnSuccessFn<D, V> = SWRStoreOnSuccessFn<D, V>;

export interface UseGqlQueryOptions<D, V extends object> extends Pick<
  UseGqlOptions<D, V>,
  'freshAge' | 'retries' | 'retryInterval' | 'revalidationCache' | 'shouldRetry' | 'staleAge' | 'key'
> {
  /**
   * @see CreateSWRStoreOptions.onError
   */
  onError?: UseGqlQueryOnErroredFn<V>;
  /**
   * @see CreateSWRStoreOptions.onSuccess
   */
  onSuccess?: UseGqlQueryOnSuccessFn<D, V>;
}

export type UseGqlQueryResult<D, V extends object> = UseSWRResult<D, UseGqlQueryParams<V>, UseGqlError>;

export type UseGqlQueryArgs<V extends object> = UseSWROptionsArgs<UseGqlQueryParams<V>>;

function rewireHook<D, V extends object, F extends UseGqlQueryOnSuccessFn<D, V>>(
  fn: F,
): SWRStoreOnSuccessFn<D, GqlRequestParameters<D, V>>;
function rewireHook<D, V extends object, E, F extends UseGqlQueryOnErroredFn<V>>(
  fn: F,
  error: true,
): SWRStoreOnErrorFn<GqlRequestParameters<D, V>, E>;
function rewireHook(
  fn:
    | UseGqlQueryOnSuccessFn<any, any>
    | UseGqlQueryOnErroredFn<any>,
) {
  return ((
    payload:
      | SWRStoreOnErrorPayload<any, any>
      | SWRStoreOnSuccessPayload<any, any>,
    error?: true,
  ) => {
    if (error) {
      hapticFeedbackNotificationOccurred('error');
    }
    // We are using double "!" as long as according to the code, we can't have a case, when
    // the request was performed, but no variables were set.
    fn({ ...payload, params: payload.params[2].variables } as any);
  });
}

function createArgs<D, V extends object>(
  endpoint: string,
  query: DocumentNode<D, V>,
  authToken: string | undefined,
  variablesOrTuple: | V | [variables: V, options?: Omit<GqlRequestOptions, 'variables'>],
): [string, DocumentNode<D, V>, GqlRequestOptions<V>] {
  let variables: V;
  let options: Omit<GqlRequestOptions<any>, 'variables'> = {};
  if (Array.isArray(variablesOrTuple)) {
    variables = variablesOrTuple[0];
    options = variablesOrTuple[1] || {};
  } else {
    variables = variablesOrTuple;
  }

  return [endpoint, query, {
    ...options,
    variables,
    headers: {
      Authorization: authToken ? `jwt ${authToken}` : '',
      ...options.headers,
    },
  }];
}

export function useGqlQuery<D, V extends object>(
  query: DocumentNode<D, V>,
  args?: UseGqlQueryArgs<V>,
  options?: UseGqlQueryOptions<D, V>,
): UseGqlQueryResult<D, V> {
  options ||= {};
  const context = useGqlContext();
  const createArguments = (createArgs<D, V>).bind(
    null,
    context.endpoint,
    query,
    context.authToken,
  );

  const { onError, onSuccess } = options;
  const [resource, utils] = useGqlScoped<D, V>({
    ...options,
    onSuccess: onSuccess ? rewireHook(onSuccess) : undefined,
    onError: onError ? rewireHook(onError, true) : undefined,
    args() {
      const argsValue = access(args);
      return argsValue && [createArguments(argsValue[0]), argsValue[1]];
    },
  });

  return [resource, {
    get(variables, shouldRevalidate) {
      utils.get(createArguments(variables), shouldRevalidate);
    },
    revalidate(variables) {
      return utils.revalidate(createArguments(variables));
    },
    mutate(variables, ...rest) {
      return utils.mutate(createArguments(variables), ...rest as any);
    },
  }];
}
