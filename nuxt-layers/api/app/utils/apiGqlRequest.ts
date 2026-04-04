import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { gqlRequest } from '@platformer/graphql';
import * as fp from 'fp-ts';
import type { GraphQLClient, Variables } from 'graphql-request';

import { ApiGraphQLResponseError } from './ApiGraphQLResponseError.js';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function apiGqlRequest<T, V extends Variables>({ client, document, variables }: {
  client: GraphQLClient;
  document: TypedDocumentNode<T, V>;
  variables: V;
}): fp.taskEither.TaskEither<ApiGraphQLResponseError, T> {
  return fp.function.pipe(
    gqlRequest({ client, document, variables }),
    fp.taskEither.mapLeft(e => new ApiGraphQLResponseError(e.response, e.request)),
  );
}
