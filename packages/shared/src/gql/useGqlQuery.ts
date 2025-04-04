import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { UseSWROptionsArgs, UseSWRResult } from 'solid-swr';
import {
  useGqlScoped,
  type UseGqlOptions,
  type UseGqlError,
  type RequestOptions,
} from 'solid-gql';
import { access } from 'solid-utils';

import { useGqlContext } from './GqlProvider.js';

export type UseGqlQueryValue<V extends object> =
  | V
  | [variables: V, options?: Omit<RequestOptions, 'variables'>];

export type UseGqlQueryOptions<D, V extends object> = Omit<
  UseGqlOptions<D, V>,
  'args' | 'dataCache' | 'revalidationCache' | 'observersCache'
>;

export type UseGqlQueryResult<D, V extends object> =
  UseSWRResult<D, UseGqlQueryValue<V>, UseGqlError>;

export type UseGqlQueryArgs<V extends object> = UseSWROptionsArgs<UseGqlQueryValue<V>>;

export function useGqlQuery<D, V extends object>(
  query: TypedDocumentNode<D, V>,
  args?: UseGqlQueryArgs<V>,
  options?: UseGqlQueryOptions<D, V>,
): UseGqlQueryResult<D, V> {
  const context = useGqlContext();
  options ||= {};

  const createArguments = (
    variablesOrTuple:
      | V
      | [variables: V, options?: Omit<RequestOptions, 'variables'>],
  ): [string, TypedDocumentNode<D, V>, RequestOptions<V>] => {
    const { authToken } = context;
    let variables: V;
    let options: Omit<RequestOptions<any>, 'variables'> = {};
    if (Array.isArray(variablesOrTuple)) {
      variables = variablesOrTuple[0];
      options = variablesOrTuple[1] || {};
    } else {
      variables = variablesOrTuple;
    }

    return [context.endpoint, query, {
      ...options,
      variables,
      headers: {
        Authorization: authToken ? `jwt ${authToken}` : '',
        ...options.headers,
      },
    }];
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
