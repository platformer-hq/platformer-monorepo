import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as fp from 'fp-ts';
import type { Variables } from 'graphql-request';

export function useMakeGqlApiRequest() {
  const store = useApiStore();

  return <T, V extends Variables>(
    document: TypedDocumentNode<T, V>,
    variables: V,
  ): fp.taskEither.TaskEither<ApiGraphQLError, T> => {
    return fp.function.pipe(
      gqlRequest({ client: store.client, document, variables }),
      fp.taskEither.mapLeft(e => new ApiGraphQLError(e.response, e.request)),
    );
  };
}
