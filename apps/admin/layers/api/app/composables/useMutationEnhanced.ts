import type { UseMutationOptions } from '@pinia/colada';

interface EnhancedContext {
  apiGqlRequest: ApiGqlRequestFn;
}

type OverrideContext<TContext extends Record<never, never>> =
  Omit<TContext, keyof EnhancedContext> & EnhancedContext;

export type UseMutationEnhancedOptions<
  TData,
  TVars,
  TError,
  TContext extends Record<never, never>,
> = UseMutationOptions<TData, TVars, TError, OverrideContext<TContext>>;

/**
 * @param options `useMutation` options.
 * @returns A mutation with `apiGqlRequest` set in the mutation context.
 */
export function useMutationEnhanced<
  TData,
  TVars = void,
  TError = Error,
  TContext extends Record<never, never> = object,
>(options: UseMutationEnhancedOptions<TData, TVars, TError, TContext>) {
  const apiGqlRequest = useMakeApiGqlRequest();

  return useMutation<TData, TVars, TError, OverrideContext<TContext>>({
    ...options,
    onMutate(vars, context) {
      const additionalContext: EnhancedContext = { apiGqlRequest };
      return options.onMutate?.(vars, {
        ...context,
        ...additionalContext,
      }) || (additionalContext as OverrideContext<TContext>);
    },
  });
}
