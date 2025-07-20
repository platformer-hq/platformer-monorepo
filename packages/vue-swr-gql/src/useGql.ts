import {
  ClientError,
  request,
  type RequestExtendedOptions,
} from 'graphql-request';
import {
  useSWR,
  type CreateSWRStoreKey,
  type UseSWROptions,
  type UseSWRResult,
} from 'vue-swr';

import { GraphQLError } from './GraphQLError.js';

export type GqlRequestOptions<D, V extends object> = RequestExtendedOptions<V, D>;
export type UseGqlError = GraphQLError | Error;

export interface UseGqlOptions<D, V extends object>
  extends UseSWROptions<D, GqlRequestOptions<D, V>, UseGqlError> {
  /**
   * Custom key to be used instead of the default generated one.
   */
  key?: CreateSWRStoreKey<GqlRequestOptions<D, V>>;
}

export type UseGqlResult<D, V extends object> = UseSWRResult<
  D,
  GqlRequestOptions<D, V>,
  UseGqlError
>;

export function useGql<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  options ||= {};
  const { key } = options;
  return useSWR<D, GqlRequestOptions<D, V>, UseGqlError>(
    key || (options => {
      return JSON.stringify([options.url, options.document, options.variables]);
    }),
    options => {
      return request(options).catch(error => {
        if (error instanceof ClientError) {
          throw new ClientError(error.response, error.request);
        }
        throw error;
      });
    },
    options,
  );
}
