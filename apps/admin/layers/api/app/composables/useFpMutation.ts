import type * as fp from 'fp-ts';

interface Options<
  TData,
  TVars,
  TError,
  TContext extends Record<never, never>,
> extends Omit<UseMutationEnhancedOptions<TData, TVars, TError, TContext>, 'mutation'> {
  mutation: (
    ...args: Parameters<UseMutationEnhancedOptions<TData, TVars, TError, TContext>['mutation']>
  ) => fp.taskEither.TaskEither<TError, TData>;
}

/**
 * @param options `useMutation` options with `mutation` returning TaskEither monad.
 * @returns A mutation with `apiGqlRequest` set in the mutation context.
 */
export function useFpMutation<
  TData,
  TVars = void,
  TError = Error,
  TContext extends Record<never, never> = object,
>(options: Options<TData, TVars, TError, TContext>) {
  return useMutationEnhanced<TData, TVars, TError, TContext>({
    ...options,
    mutation(vars, context) {
      return throwifyAnyEither(options.mutation(vars, context));
    },
  });
}
