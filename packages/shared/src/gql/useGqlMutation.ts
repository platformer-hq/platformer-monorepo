import { useGqlQuery, type UseGqlQueryOptions } from './useGqlQuery.js';

export type UseGqlMutationOptions<D extends object, V extends object> =
  Omit<UseGqlQueryOptions<D, V>, 'freshAge' | 'staleAge'>;

export function useGqlMutation<D extends object, V extends object>(
  query: string,
  options?: UseGqlMutationOptions<D, V>,
) {
  return useGqlQuery(query, undefined, { ...options, staleAge: 0, freshAge: 0 });
}