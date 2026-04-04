import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as fp from 'fp-ts';
import type {
  ClientError,
  GraphQLClient,
  RequestExtendedOptions,
  Variables,
} from 'graphql-request';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function gqlRequest<T, V extends Variables>({ client, document, variables }: {
  client: GraphQLClient;
  document: TypedDocumentNode<T, V>;
  variables: V;
}): fp.taskEither.TaskEither<ClientError, T> {
  // TODO: Add "retry" option.
  return fp.taskEither.tryCatch(() => {
    return client.request({
      document,
      variables,
    } as unknown as RequestExtendedOptions<V, T>);
  }, e => e as ClientError);
}
