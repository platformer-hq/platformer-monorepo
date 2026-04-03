import * as fp from 'fp-ts';

export type AnyEither = (
  | fp.either.Either<unknown, unknown>
  | fp.taskEither.TaskEither<unknown, unknown>
);

type AnyEitherToCommon<T> = [T] extends [fp.either.Either<unknown, infer U>]
  ? U
  : T extends fp.taskEither.TaskEither<unknown, infer U>
    ? Promise<U>
    : T;

export function throwifyAnyEither<V extends AnyEither>(value: V): AnyEitherToCommon<V> {
  const onError = (e: unknown) => {
    throw e;
  };
  return (
    typeof value === 'function'
      ? fp.function.pipe(value, fp.taskEither.match(onError, d => d))()
      : fp.function.pipe(value, fp.either.match(onError, d => d))
  ) as AnyEitherToCommon<V>;
}
