import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { ClientError, request, type RequestExtendedOptions } from 'graphql-request';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { GraphQLError } from './GraphQLError.js';
import { injectGqlOptions } from './provider.js';

export function useGqlRequest() {
  const { endpoint, authToken } = injectGqlOptions();

  return <D, V extends object>(
    document: MaybeRefOrGetter<TypedDocumentNode<D, V>>,
    variables: MaybeRefOrGetter<V>,
    signal?: AbortSignal,
  ) => {
    const token = toValue(authToken);
    return request({
      url: toValue(endpoint),
      document: toValue(document),
      variables: toValue(variables),
      signal,
      requestHeaders: { Authorization: token ? `jwt ${token}` : '' },
    } as unknown as RequestExtendedOptions<V, D>).catch(error => {
      if (error instanceof ClientError) {
        throw new GraphQLError(error.response, error.request);
      }
      throw error;
    });
  };
}
