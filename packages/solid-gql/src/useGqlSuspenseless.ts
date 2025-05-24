import {
  request,
  type RequestOptions as GqlRequestOptions,
  GraphQLError as _GraphQLError,
} from '@solid-primitives/graphql';
import type { DocumentNode } from 'api';
import {
  useSWRSuspenseless,
  type UseSWRSuspenselessOptions,
  type UseSWRSuspenselessResult,
} from 'solid-swr';

import { GraphQLError } from './GraphQLError.js';

export type { GqlRequestOptions };
export type GqlRequestParameters<D, V extends object> = [
  url: string,
  query: DocumentNode<D, V>,
  options?: GqlRequestOptions<V>
];

export type UseGqlSuspenselessError = GraphQLError | Error;
export type UseGqlSuspenselessOptions<D, V extends object> =
  UseSWRSuspenselessOptions<D, GqlRequestParameters<D, V>, UseGqlSuspenselessError>;
export type UseGqlSuspenselessResult<D, V extends object> =
  UseSWRSuspenselessResult<D, GqlRequestParameters<D, V>, UseGqlSuspenselessError>;

export function useGqlSuspenseless<D, V extends object>(
  options?: UseGqlSuspenselessOptions<D, V>,
): UseGqlSuspenselessResult<D, V> {
  return useSWRSuspenseless<D, GqlRequestParameters<D, V>, UseGqlSuspenselessError>(
    (endpoint, query, options) => {
      return JSON.stringify([endpoint, query, (options || {}).variables]);
    },
    (...args) => {
      return request(...args).catch(error => {
        if (error instanceof _GraphQLError) {
          throw new GraphQLError(error.message, error.locations, error.extensions);
        }
        throw error;
      });
    },
    options,
  );
}