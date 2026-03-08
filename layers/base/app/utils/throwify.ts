import * as fp from 'fp-ts';

type RequiredFn = (...args: never[]) => (
  | fp.either.Either<unknown, unknown>
  | fp.taskEither.TaskEither<unknown, unknown>
);

type WrappedFn<Fn extends RequiredFn> =
  (...args: Parameters<Fn>) => ReturnType<Fn> extends fp.either.Either<unknown, infer R>
    ? R
    : ReturnType<Fn> extends fp.taskEither.TaskEither<unknown, infer R>
      ? Promise<R>
      : never;

export function throwify<Fn extends RequiredFn>(fn_: Fn): WrappedFn<Fn> {
  return ((...args) => {
    const result = fn_(...args);
    const onError = (e: unknown) => {
      throw e;
    };
    return typeof result === 'function'
      ? fp.function.pipe(result, fp.taskEither.match(onError, d => d))()
      : fp.function.pipe(result, fp.either.match(onError, d => d));
  }) as WrappedFn<Fn>;
}
