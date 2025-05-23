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

export interface KeyStatePending<D> {
  status: 'pending',
  data: Promise<D>;
  latestData?: KeyLatestData<D>;
}

export interface KeyStateRevalidating<D> {
  status: 'revalidating';
  data: Promise<D>;
  latestData?: KeyLatestData<D>;
}

export interface KeyStateSuccess<D> extends CachedData<D> {
  status: 'success';
}

export interface KeyStateError<D, E> {
  status: 'error';
  error: E;
  latestData?: KeyLatestData<D>;
}

export type KeyState<D, E = unknown> =
  | KeyStatePending<D>
  | KeyStateRevalidating<D>
  | KeyStateSuccess<D>
  | KeyStateError<D, E>;