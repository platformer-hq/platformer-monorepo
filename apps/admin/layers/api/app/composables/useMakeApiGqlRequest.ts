import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { apiGqlRequest, type ApiGraphQLResponseError } from '@workspace/api';
import type * as fp from 'fp-ts';
import type { Variables } from 'graphql-request';

export type ApiGqlRequestFn = <T, V extends Variables>(
  document: TypedDocumentNode<T, V>,
  variables: V,
) => fp.taskEither.TaskEither<ApiGraphQLResponseError, T>;

export function useMakeApiGqlRequest(): ApiGqlRequestFn {
  const store = useApiStore();

  return (document, variables) => {
    return apiGqlRequest({ client: store.client, document, variables });
  };
}
