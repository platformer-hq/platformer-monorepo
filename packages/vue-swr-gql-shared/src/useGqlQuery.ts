import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-vue';
import { toValue, type MaybeRefOrGetter } from 'vue';
import {
  useGqlScoped,
  type GqlRequestOptions,
  type SWRStoreOnErrorFn,
  type SWRStoreOnErrorPayload,
  type SWRStoreOnSuccessFn,
  type SWRStoreOnSuccessPayload,
  type TypedDocumentNode,
  type UseGqlError,
  type UseGqlOptions,
  type UseSWRResult,
} from 'vue-swr-gql';
import { injectGqlOptions } from './providers.js';

export type GqlRequestSanitizedOptions = Omit<GqlRequestOptions<{}, {}>, 'variables' | 'url' | 'document'>;
export type UseGqlQueryParams<V extends object> = V | [
  variables: V,
  options?: GqlRequestSanitizedOptions & { shouldRevalidate?: boolean },
];
export type UseGqlQueryOnErroredFn<V> = SWRStoreOnErrorFn<V, UseGqlError>;
export type UseGqlQueryOnSuccessFn<D, V> = SWRStoreOnSuccessFn<D, V>;

export interface UseGqlQueryOptions<D, V extends object> extends Pick<
  UseGqlOptions<D, V>,
  | 'freshAge'
  | 'retries'
  | 'retryInterval'
  | 'revalidationCache'
  | 'shouldRetry'
  | 'staleAge'
  | 'key'
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

export type UseGqlQueryArgs<V extends object> = MaybeRefOrGetter<UseGqlQueryParams<V>>;

function rewireHook<D, V extends object, F extends UseGqlQueryOnSuccessFn<D, V>>(
  fn: F,
): SWRStoreOnSuccessFn<D, GqlRequestOptions<D, V>>;
function rewireHook<D, V extends object, E, F extends UseGqlQueryOnErroredFn<V>>(
  fn: F,
  error: true,
): SWRStoreOnErrorFn<GqlRequestOptions<D, V>, E>;
function rewireHook(
  fn:
    | UseGqlQueryOnSuccessFn<any, any>
    | UseGqlQueryOnErroredFn<any>,
) {
  return (
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
    fn({ ...payload, params: payload.params.variables } as any);
  };
}

function createRequestOpts<D, V extends object>(
  url: string,
  document: TypedDocumentNode<D, V>,
  authToken: string | undefined,
  variablesOrTuple: V | [variables: V, options?: GqlRequestSanitizedOptions],
): GqlRequestOptions<D, V> {
  let variables: V;
  let options: GqlRequestSanitizedOptions = {};
  if (Array.isArray(variablesOrTuple)) {
    variables = variablesOrTuple[0];
    options = variablesOrTuple[1] || {};
  } else {
    variables = variablesOrTuple;
  }

  return {
    ...options,
    url,
    document,
    variables,
    requestHeaders: {
      Authorization: authToken ? `jwt ${authToken}` : '',
      ...options.requestHeaders,
    },
  } as unknown as GqlRequestOptions<D, V>;
}

export function useGqlQuery<D, V extends object>(
  document: TypedDocumentNode<D, V>,
  args?: UseGqlQueryArgs<V>,
  options?: UseGqlQueryOptions<D, V>,
): UseGqlQueryResult<D, V> {
  options ||= {};
  const { endpoint, authToken } = injectGqlOptions();
  const createRequestOptions = (createRequestOpts<D, V>).bind(
    null,
    endpoint,
    document,
    authToken,
  );

  const { onError, onSuccess } = options;
  const [state, utils] = useGqlScoped<D, V>({
    ...options,
    onSuccess: onSuccess ? rewireHook(onSuccess) : undefined,
    onError: onError ? rewireHook(onError, true) : undefined,
    args() {
      const argsValue = toValue(args);
      if (argsValue) {
        const tuple = Array.isArray(argsValue) ? argsValue : [argsValue] as [V];
        return [
          createRequestOptions(tuple),
          (tuple[1] || {}).shouldRevalidate,
        ];
      }
    },
  });

  return [state, {
    get(variables, shouldRevalidate) {
      utils.get(createRequestOptions(variables), shouldRevalidate);
    },
    revalidate(variables) {
      return utils.revalidate(createRequestOptions(variables));
    },
    mutate(variables, ...rest) {
      return utils.mutate(createRequestOptions(variables), ...rest as any);
    },
  }];
}
