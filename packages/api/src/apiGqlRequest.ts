import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { gqlRequest } from '@workspace/graphql';
import * as fp from 'fp-ts';
import { ClientError, type GraphQLClient, type Variables } from 'graphql-request';

import { ApiGraphQLResponseError } from './ApiGraphQLResponseError.js';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function apiGqlRequest<TData, TVars extends Variables, TError = TypeError>({
  client,
  document,
  variables,
}: {
  client?: GraphQLClient;
  document: TypedDocumentNode<TData, TVars>;
  variables: TVars;
}): fp.taskEither.TaskEither<ApiGraphQLResponseError | TError, TData> {
  return fp.function.pipe(
    gqlRequest<TData, TVars, TError>({ client, document, variables }),
    fp.taskEither.mapLeft(e => (e instanceof ClientError ? new ApiGraphQLResponseError(e) : e)),
  );
}
