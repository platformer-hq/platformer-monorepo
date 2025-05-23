import type { CachedData } from './cache.js';

export interface KeyLatestData<D> extends CachedData<D> {
  state: 'fresh' | 'stale' | 'expired';
}

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