import {
  request,
  type RequestOptions as GqlRequestOptions,
  GraphQLError as _GraphQLError,
} from '@solid-primitives/graphql';
import type { DocumentNode } from 'api';
import {
  useSWR,
  type CreateSWRStoreKey,
  type UseSWROptions,
  type UseSWRResult,
} from 'solid-swr';

import { GraphQLError } from './GraphQLError.js';

export type { GqlRequestOptions };
export type GqlRequestParameters<D, V extends object> = [
  url: string,
  query: DocumentNode<D, V>,
  options?: GqlRequestOptions<V>
];

export type UseGqlError = GraphQLError | Error;
export interface UseGqlOptions<D, V extends object>
  extends UseSWROptions<D, GqlRequestParameters<D, V>, UseGqlError> {
  /**
   * Custom key to be used instead of the default generated one.
   */
  key?: CreateSWRStoreKey<GqlRequestParameters<D, V>>;
}
export type UseGqlResult<D, V extends object> =
  UseSWRResult<D, GqlRequestParameters<D, V>, UseGqlError>;

export function useGql<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  options ||= {};
  const { key } = options;
  return useSWR<D, GqlRequestParameters<D, V>, UseGqlError>(
    key || ((endpoint, query, options) => {
      return JSON.stringify([endpoint, query, (options || {}).variables]);
    }),
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