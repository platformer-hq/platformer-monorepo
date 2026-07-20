import type { GqlRequestOptions } from '@workspace/graphql';
import { gqlRequest } from '@workspace/graphql';
import * as fp from 'fp-ts';
import { ClientError, type Variables } from 'graphql-request';

import { ApiGraphQLResponseError } from './ApiGraphQLResponseError.js';

/**
 * Performs a GraphQL request using specified client.
 * @returns TaskEither with the error and execution result.
 */
export function apiGqlRequest<TData, TVars extends Variables, TError = TypeError>(
  options: GqlRequestOptions<TData, TVars>,
): fp.taskEither.TaskEither<ApiGraphQLResponseError | TError, TData> {
  return fp.function.pipe(
    gqlRequest<TData, TVars, TError>(options),
    fp.taskEither.mapLeft(e => (e instanceof ClientError ? new ApiGraphQLResponseError(e) : e)),
  );
}
