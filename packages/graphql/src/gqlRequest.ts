import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TimeoutError } from '@workspace/errors';
import * as fp from 'fp-ts';
import {
  request,
  type ClientError,
  type GraphQLClient,
  type RequestExtendedOptions,
  type Variables,
} from 'graphql-request';

export interface GqlRequestOptions<TData, TVars extends Variables> {
  client?: GraphQLClient;
  document: TypedDocumentNode<TData, TVars>;
  variables: TVars;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function gqlRequest<TData, TVars extends Variables, TError = TypeError>(
  {
    client,
    document,
    variables,
    timeout,
    signal,
  }: GqlRequestOptions<TData, TVars>,
): fp.taskEither.TaskEither<ClientError | TError, TData> {
  const controller = new AbortController();
  let timeoutId: number | undefined;
  if (timeout) {
    timeoutId = setTimeout(() => {
      controller.abort(new TimeoutError(timeout));
    }, timeout) as number;
  }
  if (signal) {
    signal.onabort = () => {
      controller.abort(signal.reason);
    };
  }
  // TODO: Add "retry" option.
  return fp.taskEither.tryCatch(() => {
    const options = {
      document,
      variables,
      signal: controller.signal,
    } as unknown as RequestExtendedOptions<TVars, TData>;
    return (client ? client.request(options) : request(options)).finally(() => {
      clearTimeout(timeoutId);
    });
  }, e => e as ClientError | TError);
}
