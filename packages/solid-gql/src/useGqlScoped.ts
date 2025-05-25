import {
  useGql,
  type UseGqlOptions,
  type UseGqlResult,
} from './useGql.js';
import { useGqlContext } from './GqlProvider.js';

export function useGqlScoped<D, V extends object>(options?: UseGqlOptions<D, V>): UseGqlResult<D, V> {
  // Using "as any" as long as we have non-typed caches. We can't have them typed, because each
  // query has its own type.
  return useGql({ ...useGqlContext() as any, ...options });
}