import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { apiGqlRequest, type ApiGraphQLResponseError } from '@workspace/api';
import type * as fp from 'fp-ts';
import type { Variables } from 'graphql-request';
import type { FetchError } from 'ofetch';

export type ApiGqlRequestFn = <TData, TVars extends Variables>(
  document: TypedDocumentNode<TData, TVars>,
  variables: TVars,
) => fp.taskEither.TaskEither<ApiGraphQLResponseError | FetchError, TData>;

export function useMakeApiGqlRequest(): ApiGqlRequestFn {
  const { gqlClient } = useApiStore();

  return (document, variables) => {
    return apiGqlRequest({ client: gqlClient, document, variables });
  };
}
