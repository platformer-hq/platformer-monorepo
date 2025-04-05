import { request, type RequestOptions, GraphQLError as _GraphQLError } from '@solid-primitives/graphql';
import type { DocumentNode } from 'api';
import { useSWR, type UseSWROptions, type UseSWRResult } from 'solid-swr';

import { GraphQLError } from './GraphQLError.js';

export type { RequestOptions };
export type RequestParameters<D, V extends object> = [
  url: string,
  query: DocumentNode<D, V>,
  options?: RequestOptions<V>
];

export type UseGqlError = GraphQLError | Error;
export type UseGqlOptions<D, V extends object> = UseSWROptions<D, RequestParameters<D, V>, UseGqlError>;
export type UseGqlResult<D, V extends object> = UseSWRResult<D, RequestParameters<D, V>, UseGqlError>;

export function useGql<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  return useSWR<D, RequestParameters<D, V>, UseGqlError>(
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