import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { taskEither, function as fn } from 'fp-ts';
import type { Variables } from 'graphql-request';

export function useMakeGqlApiRequest() {
  const store = useApiStore();

  return <T, V extends Variables>({ document, variables }: {
    document: TypedDocumentNode<T, V>;
    variables: V;
  }): taskEither.TaskEither<ApiGraphQLError, T> => {
    return fn.pipe(
      gqlRequest({ client: store.client, document, variables }),
      taskEither.mapLeft(e => new ApiGraphQLError(e.response, e.request)),
    );
  };
}
