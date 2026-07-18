import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { apiGqlRequest, type ApiGraphQLResponseError } from '@workspace/api';
import type * as fp from 'fp-ts';
import { GraphQLClient, type Variables } from 'graphql-request';
import { getRequestURL } from 'h3';

export type GqlRequestFn = <TData, TVars extends Variables>(
  document: TypedDocumentNode<TData, TVars>,
  variables: TVars,
) => fp.taskEither.TaskEither<ApiGraphQLResponseError | FetchError, TData>;

function createMakeGqlRequest(client: GraphQLClient): GqlRequestFn {
  return (document, variables) => {
    return apiGqlRequest({ client, document, variables });
  };
}

export const useApiStore = defineStore('api', () => {
  const requestEvent = useRequestEvent();
  const config = useRuntimeConfig();
  const gqlClient = new GraphQLClient(
    new URL(
      config.public.gqlApiBaseUrl,
      requestEvent ? getRequestURL(requestEvent)?.origin : window.location.origin,
    ).toString(),
    {
      requestMiddleware(request) {
        const url = new URL(request.url);
        if (request.operationName) {
          url.searchParams.set('operation', request.operationName);
        }
        request.url = url.toString();
        return request;
      },
    },
  );

  return {
    apiGqlRequest: createMakeGqlRequest(gqlClient),
  };
});
