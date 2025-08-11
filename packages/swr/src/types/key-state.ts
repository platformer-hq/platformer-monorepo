import type { CachedData } from './cache.js';

export type KeyStateState = 'fresh' | 'stale' | 'expired';
export type KeyStatePromiseData<D, E> = { ok: true; data: D } | { ok: false; error: E };
export type KeyStateDataPromise<D, E> = Promise<KeyStatePromiseData<D, E>>;

export interface KeyStateSuccess<D> {
  key: string;
  status: 'success';
  data: D;
}

export interface KeyStateError<E> {
  key: string;
  status: 'error';
  error: E;
}

export interface KeyStatePending<D, E> {
  key: string;
  status: 'pending';
  promise: KeyStateDataPromise<D, E>;
}

export type KeyState<D, E> =
  | KeyStateSuccess<D>
  | KeyStateError<E>
  | KeyStatePending<D, E>;

export interface KeyLatestData<D> extends CachedData<D> {
  get state(): 'fresh' | 'stale' | 'expired';
}
