import type { CachedData } from './cache.js';

export type KeyStateState = 'fresh' | 'stale' | 'expired';
export type KeyStatePromiseData<D, E> = { ok: true; data: D } | { ok: false; error: E };
export type KeyStateDataPromise<D, E> = Promise<KeyStatePromiseData<D, E>>;

interface CreateKeyLatestState<D, S extends KeyStateState> extends CachedData<D> {
  state: S;
}

export type KeyLatestDataFresh<D> = CreateKeyLatestState<D, 'fresh'>;
export type KeyLatestDataStale<D> = CreateKeyLatestState<D, 'stale'>;
export type KeyLatestDataExpired<D> = CreateKeyLatestState<D, 'expired'>;
export type KeyLatestData<D> =
  | KeyLatestDataFresh<D>
  | KeyLatestDataStale<D>
  | KeyLatestDataExpired<D>;

interface CreateKeyState<S, D, E, LD> {
  data: D;
  error: E;
  latestData: LD;
  status: S;
}

export type KeyStatePending<D, E> = CreateKeyState<
  'pending',
  KeyStateDataPromise<D, E>,
  never,
  KeyLatestData<D> | undefined
>;

export type KeyStateRevalidating<D, E> = CreateKeyState<
  'revalidating',
  KeyStateDataPromise<D, E>,
  never,
  KeyLatestData<D>
>;

export type KeyStateSuccess<D> = CreateKeyState<'success', D, never, KeyLatestData<D>>;

export type KeyStateError<D, E> = CreateKeyState<
  'error',
  never,
  E,
  KeyLatestData<D> | undefined
>;

export type KeyState<D, E = unknown> =
  | KeyStatePending<D, E>
  | KeyStateRevalidating<D, E>
  | KeyStateSuccess<D>
  | KeyStateError<D, E>;
