import type { Observable } from './observable.js';
import type { KeyState } from './key-state.js';

export interface CachedData<D> {
  /**
   * Cache creation timestamp.
   */
  timestamp: number;
  /**
   * Cached data.
   */
  data: D;
}

export interface DataCache<D> {
  get: (key: string) => CachedData<D> | undefined | null;
  set: (key: string, value: CachedData<D>) => void;
}

export interface RevalidationCache<D> {
  get: (key: string) => Promise<D> | undefined | null;
  set: (key: string, value: Promise<D>) => void;
  delete: (key: string) => void;
}

export interface ObserversCache<D, E> {
  get: (key: string) => Observable<KeyState<D, E>>;
  set: (key: string, value: Observable<KeyState<D, E>>) => void;
}