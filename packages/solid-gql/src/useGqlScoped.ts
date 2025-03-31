import { useGql, type UseGqlOptions, type UseGqlResult } from './useGql.js';
import { useGqlContext } from './GqlProvider2.js';

export function useGqlScoped<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  const context = useGqlContext();
  return useGql({ ...context as any, ...options });
}