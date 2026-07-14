import { GraphQLClient } from 'graphql-request';
import { getRequestURL } from 'h3';

export const useApiStore = defineStore('api', () => {
  const requestEvent = useRequestEvent();
  const config = useRuntimeConfig();
  return {
    gqlClient: markRaw(
      new GraphQLClient(
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
      ),
    ),
  };
});
