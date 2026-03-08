import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as fp from 'fp-ts';
import type { GraphQLClient, Variables } from 'graphql-request';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function apiGqlRequest<T, V extends Variables>({ client, document, variables }: {
  client: GraphQLClient;
  document: TypedDocumentNode<T, V>;
  variables: V;
}): fp.taskEither.TaskEither<ApiGraphQLError, T> {
  return fp.function.pipe(
    gqlRequest({ client, document, variables }),
    fp.taskEither.mapLeft(e => new ApiGraphQLError(e.response, e.request)),
  );
}
