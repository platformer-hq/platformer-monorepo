import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as fp from 'fp-ts';
import type { Variables } from 'graphql-request';

export type GqlApiRequestFn = <T, V extends Variables>(
  document: TypedDocumentNode<T, V>,
  variables: V,
) => fp.taskEither.TaskEither<ApiGraphQLResponseError, T>;

export function useMakeApiGqlRequest(): GqlApiRequestFn {
  const store = useApiStore();

  return (document, variables) => {
    return fp.function.pipe(
      gqlRequest({ client: store.client, document, variables }),
      fp.taskEither.mapLeft(e => new ApiGraphQLResponseError(e.response, e.request)),
    );
  };
}
