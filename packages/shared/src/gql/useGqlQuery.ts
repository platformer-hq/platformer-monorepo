import type { UseSWROptionsArgs, UseSWRResult } from 'solid-swr';
import {
  useGqlScoped,
  type UseGqlOptions,
  type UseGqlError,
} from 'solid-gql';
import { access } from 'solid-utils';

import { useGqlContext } from './GqlProvider.js';

export type UseGqlQueryOptions<D extends object, V extends object> = Omit<
  UseGqlOptions<D, V>,
  'args' | 'dataCache' | 'revalidationCache' | 'observersCache'
>;

export type UseGqlQueryResult<D, V> = UseSWRResult<D, V, UseGqlError>;

export function useGqlQuery<D extends object, V extends object>(
  query: string,
  args?: UseSWROptionsArgs<V>,
  options?: UseGqlQueryOptions<D, V>,
): UseGqlQueryResult<D, V> {
  const context = useGqlContext();
  options ||= {};

  const createArguments = (variables: V) => {
    const { authToken } = context;
    return [context.endpoint, query, {
      variables,
      headers: {
        Authorization: authToken ? `jwt ${authToken}` : '',
      },
    }] as const;
  };

  const [resource, utils] = useGqlScoped({
    ...options,
    args() {
      const argsValue = access(args);
      return argsValue && [createArguments(argsValue[0]), argsValue[1]];
    },
  });

  return [resource, {
    get(variables, shouldRevalidate) {
      utils.get(createArguments(variables), shouldRevalidate);
    },
    mutate(variables, ...rest) {
      utils.mutate(createArguments(variables), ...rest);
    },
  }];
}
