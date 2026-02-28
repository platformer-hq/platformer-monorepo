import { either as E, taskEither as TE, function as fn } from 'fp-ts';

import type { AnyEither } from '../types.js';

type RequiredFn = (...args: never[]) => AnyEither;

type WrappedFn<Fn extends RequiredFn> =
  (...args: Parameters<Fn>) => ReturnType<Fn> extends E.Either<unknown, infer R>
    ? R
    : ReturnType<Fn> extends TE.TaskEither<unknown, infer R>
      ? Promise<R>
      : never;

export function throwify<Fn extends RequiredFn>(fn_: Fn): WrappedFn<Fn> {
  return ((...args) => {
    const result = fn_(...args);
    const onError = (e: unknown) => {
      throw e;
    };
    return typeof result === 'function'
      ? fn.pipe(result, TE.match(onError, d => d))()
      : fn.pipe(result, E.match(onError, d => d));
  }) as WrappedFn<Fn>;
}
