import type { CachedData } from './cache.js';

export type KeyStateState = 'fresh' | 'stale' | 'expired';

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

export type KeyStatePending<D> = CreateKeyState<
  'pending',
  Promise<D>,
  undefined,
  KeyLatestData<D> | undefined
>;

export type KeyStateRevalidating<D> = CreateKeyState<
  'revalidating',
  Promise<D>,
  undefined,
  KeyLatestData<D>
>;

export type KeyStateSuccess<D> = CreateKeyState<'success', D, undefined, KeyLatestData<D>>;

export type KeyStateError<D, E> = CreateKeyState<
  'error',
  undefined,
  E,
  KeyLatestData<D> | undefined
>;

export type KeyState<D, E = unknown> =
  | KeyStatePending<D>
  | KeyStateRevalidating<D>
  | KeyStateSuccess<D>
  | KeyStateError<D, E>;
