import type { taskEither as TE, either as E } from 'fp-ts';

export type AnyEither = E.Either<unknown, unknown> | TE.TaskEither<unknown, unknown>;
export type AnyFnEither = (...ars: never[]) => AnyEither;

export type RightOfAnyEither<T extends AnyEither> = T extends E.Either<unknown, infer U>
  ? U
  : T extends TE.TaskEither<unknown, infer U>
    ? U
    : never;

export type LeftOfAnyEither<T extends AnyEither> = T extends E.Either<infer U, unknown>
  ? U
  : T extends TE.TaskEither<infer U, unknown>
    ? U
    : never;

export type LeftOfReturnType<Fn extends AnyFnEither> = LeftOfAnyEither<ReturnType<Fn>>;
export type RightOfReturnType<Fn extends AnyFnEither> = RightOfAnyEither<ReturnType<Fn>>;
