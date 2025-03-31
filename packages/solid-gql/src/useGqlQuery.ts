import {
  useSWR,
  type UseSWROptionsArgs,
  type UseSWROptions,
  type UseSWRResult,
  type DataCache,
  type ObserversCache,
  type RevalidationCache,
} from 'solid-swr';
import { GraphQLError, request } from '@solid-primitives/graphql';
import { access } from 'solid-utils';

import { useGqlContext } from './GqlProvider.js';
import { ExtendedGraphQLError } from './ExtendedGraphQLError.js';

type ErrorType = ExtendedGraphQLError | Error;

export type UseGqlQueryOptions<D extends object, V extends object> = Omit<
  UseSWROptions<D, [V], ErrorType>,
  'args' | 'dataCache' | 'revalidationCache' | 'observersCache'
>;

export function useGqlQuery<D extends object, V extends object>(
  query: string,
  args?: UseSWROptionsArgs<V>,
  options?: UseGqlQueryOptions<D, V>,
): UseSWRResult<D, V, ErrorType> {
  const {
    endpoint,
    authToken,
    dataCache,
    revalidationCache,
    observersCache,
  } = useGqlContext();

  const [resource, utils] = useSWR<D, [V], ErrorType>(
    variables => query + JSON.stringify(variables),
    variables => request(endpoint, query, {
      variables,
      headers: authToken ? { Authorization: `jwt ${authToken}` } : {},
    }).catch(error => {
      if (error instanceof GraphQLError) {
        throw new ExtendedGraphQLError(error.message, error.locations, error.extensions);
      }
      throw error;
    }),
    {
      ...options,
      logger: 'default',
      observersCache: observersCache as ObserversCache<D, ErrorType>,
      dataCache: dataCache as DataCache<D>,
      revalidationCache: revalidationCache as RevalidationCache<D>,
      args() {
        const argsValue = access(args);
        return argsValue ? [[argsValue[0]], argsValue[1]] : argsValue;
      },
    },
  );

  return [resource, {
    get(variables, ...rest) {
      utils.get([variables], ...rest);
    },
    mutate(variables, ...rest) {
      utils.mutate([variables], ...rest);
    },
  }];
}