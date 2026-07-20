import type { GqlRequestFn } from '../stores/useApiStore';

export function useMakeApiGqlRequest(): GqlRequestFn {
  return useApiStore().apiGqlRequest;
}
