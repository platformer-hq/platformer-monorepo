import type { UseMutationOptions } from '@pinia/colada';

interface EnhancedContext {
  apiGqlRequest: ApiGqlRequestFn;
}

type WireContext<T> = Omit<T, keyof EnhancedContext> & EnhancedContext;

/**
 * @param options `useMutation` options.
 * @returns A mutation with `apiGqlRequest` set in the mutation context.
 */
export function useMutationEnhanced<
  TData,
  TVars = void,
  TError = Error,
  TContext extends Record<never, never> = object,
>(options: UseMutationOptions<TData, TVars, TError, WireContext<TContext>>) {
  const apiGqlRequest = useMakeApiGqlRequest();

  return useMutation<TData, TVars, TError, WireContext<TContext>>({
    ...options,
    onMutate(vars, context) {
      const additionalContext: EnhancedContext = { apiGqlRequest };
      return options.onMutate?.(vars, {
        ...context,
        ...additionalContext,
      }) || (additionalContext as WireContext<TContext>);
    },
  });
}
