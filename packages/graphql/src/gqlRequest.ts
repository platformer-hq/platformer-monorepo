import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as fp from 'fp-ts';
import {
  request,
  type ClientError,
  type GraphQLClient,
  type RequestExtendedOptions,
  type Variables,
} from 'graphql-request';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function gqlRequest<TData, TVars extends Variables, TError = TypeError>({
  client,
  document,
  variables,
}: {
  client?: GraphQLClient;
  document: TypedDocumentNode<TData, TVars>;
  variables: TVars;
}): fp.taskEither.TaskEither<ClientError | TError, TData> {
  // TODO: Add "retry" option.
  return fp.taskEither.tryCatch(() => {
    const options = {
      document,
      variables,
    } as unknown as RequestExtendedOptions<TVars, TData>;
    return client ? client.request(options) : request(options);
  }, e => e as ClientError | TError);
}
