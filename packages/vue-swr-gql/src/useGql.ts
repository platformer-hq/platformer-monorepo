import {
  ClientError,
  request,
  type RequestExtendedOptions as GqlRequestOptions,
} from 'graphql-request';
import {
  useSWR,
  type CreateSWRStoreKey,
  type UseSWROptions,
  type UseSWRResult,
} from 'vue-swr';

import { GraphQLError } from './GraphQLError.js';

export type { GqlRequestOptions };
export type GqlRequestParameters<D, V extends object> = [GqlRequestOptions<V, D>];
export type UseGqlError = GraphQLError | Error;

export interface UseGqlOptions<D, V extends object>
  extends UseSWROptions<D, GqlRequestParameters<D, V>, UseGqlError> {
  /**
   * Custom key to be used instead of the default generated one.
   */
  key?: CreateSWRStoreKey<GqlRequestParameters<D, V>>;
}

export type UseGqlResult<D, V extends object> = UseSWRResult<
  D,
  GqlRequestParameters<D, V>,
  UseGqlError
>;

export function useGql<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  options ||= {};
  const { key } = options;
  return useSWR<D, GqlRequestParameters<D, V>, UseGqlError>(
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
