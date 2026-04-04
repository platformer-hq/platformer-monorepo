import type * as fp from 'fp-ts';

import { throwifyAnyEither, type AnyEither } from './throwifyAnyEither.js';

type RequiredFn = (...args: never[]) => AnyEither;

type WrappedFn<Fn extends RequiredFn> =
  (...args: Parameters<Fn>) => ReturnType<Fn> extends fp.either.Either<unknown, infer R>
    ? R
    : ReturnType<Fn> extends fp.taskEither.TaskEither<unknown, infer R>
      ? Promise<R>
      : never;

export function throwify<Fn extends RequiredFn>(fn_: Fn): WrappedFn<Fn> {
  return ((...args) => {
    return throwifyAnyEither(fn_(...args));
  }) as WrappedFn<Fn>;
}
