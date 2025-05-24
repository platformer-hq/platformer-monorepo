import {
  useGqlSuspenseless,
  type UseGqlSuspenselessOptions,
  type UseGqlSuspenselessResult,
} from './useGqlSuspenseless.js';
import { useGqlContext } from './GqlProvider.js';

export function useGqlSuspenselessScoped<D, V extends object>(
  options?: UseGqlSuspenselessOptions<D, V>,
): UseGqlSuspenselessResult<D, V> {
  // Using "as any" as long as we have non-typed caches. We can't have them typed, because each
  // query has its own type.
  return useGqlSuspenseless({ ...useGqlContext() as any, ...options });
}