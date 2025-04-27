import { dequal } from 'dequal/lite';
import { createLogger } from 'utils';

import { type ObservableListener, type Observable, observable } from './observable.js';

export interface KeyStatePending<D> {
  status: 'pending',
  data: Promise<D>;
}

export interface KeyStateSuccess<D> {
  status: 'success';
  data: D;
}

export interface KeyStateError<D, E> {
  status: 'error';
  error: E;
  latestData?: D;
}

export type KeyState<D, E = unknown> =
  | KeyStatePending<D>
  | KeyStateSuccess<D>
  | KeyStateError<D, E>;

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

export type CreateSWRStoreKey<P extends any[]> =
  | SWRStoreKeyValue
  | ((...args: P) => SWRStoreKeyValue);
export type CreateSWRStoreFetcher<D, P extends any[]> = (...args: P) => Promise<D>;

export interface CreateSWRStoreOptions<D, E> {
  dataCache?: DataCache<D>;
  freshAge?: number;
  logger?: 'default';
  observersCache?: ObserversCache<D, E>;
  /**
   * Count of retries to perform.
   * @default 3
   */
  retries?: number;
  /**
   * Interval between call attempts presented as a count of milliseconds or a function, accepting
   * the current attempt error and count of attempts performed already.
   * @default By default, the retry interval will be computed based on the attempts performed.
   * The actual formula is (2 ^ (attemptsPerformed - 1) * 100). In other words, the exponential
   *   backoff is used.
   */
  retryInterval?: number | ((error: E, attemptsPerformed: number) => number);
  revalidationCache?: RevalidationCache<D>;
  /**
   * @returns True if the retry should be applied.
   * @default True
   * @param error - error received during the last attempt.
   */
  shouldRetry?: boolean | ((error: E) => boolean);
  staleAge?: number;
}

export type SWRStoreMutateFnData<D> =
  | undefined
  | null
  | false
  | [D];
export type SWRStoreGetFn<D, P, E> = (
  params: P,
  shouldRevalidate?: boolean,
) => KeyState<D, E>;
export type SWRStoreMutateFn<D, P> = (
  params: P,
  data?: SWRStoreMutateFnData<D> | ((current?: D) => SWRStoreMutateFnData<D>),
  shouldRevalidate?: boolean,
) => void;
export type SWRStoreSubscribeFn<D, P, E> = (
  params: P,
  listener: ObservableListener<KeyState<D, E>>,
) => VoidFunction;

export interface SWRStore<D, P, E = unknown> {
  get: SWRStoreGetFn<D, P, E>;
  mutate: SWRStoreMutateFn<D, P>;
  subscribe: SWRStoreSubscribeFn<D, P, E>;
}

export type SWRStoreKeyValue = string | number | (string | number)[];

export function createSWRStore<D, P extends any[], E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: CreateSWRStoreOptions<D, E>,
): SWRStore<D, P, E> {
  options ||= {};
  const {
    freshAge = 5000,
    staleAge = 30000,
    logger: _logger,
    retries = 3,
    retryInterval: _retryInterval,
    shouldRetry: _shouldRetry,
  } = options;
  let { dataCache, revalidationCache, observersCache } = options;
  dataCache ||= new Map();
  revalidationCache ||= new Map();
  observersCache ||= new Map();
  const shouldRetry = typeof _shouldRetry === 'function'
    ? _shouldRetry
    : () => _shouldRetry || true;
  const retryInterval = typeof _retryInterval === 'number'
    ? () => _retryInterval
    : _retryInterval || ((_, retriesPerformed) => Math.pow(2, retriesPerformed - 1) * 100);

  const { log } = createLogger('swr', {
    bgColor: 'purple',
    textColor: 'white',
    shouldLog: _logger === 'default'
  });

  // Guaranteed returns an observable for the specified key.
  const observableByKey = (key: string): Observable<KeyState<D, E>> => {
    const value = observersCache.get(key) || observable();
    observersCache.set(key, value);
    return value;
  };

  // Emits a new state for the specified key.
  const emitKeyStateUpdate = (key: string, state: KeyState<D, E>) => {
    log('@emitKeyStateUpdate()', { key, state });
    observableByKey(key).emit(state);
  };

  // Caches a value for the specified key.
  const cacheValue = (key: string, data: D) => {
    const cachedValue = { timestamp: Date.now(), data };
    log('@cacheValue()', { key, cachedValue });
    dataCache.set(key, cachedValue);
  };

  // Returns at least stale cached data.
  const getAtLeastStale = (key: string): CachedData<D> | undefined => {
    const cachedData = dataCache.get(key);
    return cachedData && cachedData.timestamp + freshAge + staleAge > Date.now()
      ? cachedData
      : undefined;
  };

  // Computes key for the specified parameters.
  const computeKey = (params: P): string => {
    const value = typeof key === 'function' ? key(...params) : key;
    return (Array.isArray(value) ? value : [value]).join(',');
  };

  const revalidate = (params: P): Promise<D> => {
    log('@revalidate()', { params });
    const k = computeKey(params);
    let pendingPromise = revalidationCache.get(k);

    // If there is no pending promise, we should create a new one and notify subscribers about
    // state change.
    if (!pendingPromise) {
      log('@revalidate: pending promise missing. Fetching..');

      pendingPromise = (async () => {
        // Perform N + 1 calls, where N is a number of retries.
        let lastError: E;
        for (let i = 0; i < retries + 1; i++) {
          // If it is not the first attempt, we should apply additional retry-related checks.
          if (i) {
            // 1. Check if we should retry at all.
            if (!shouldRetry(lastError!)) {
              break;
            }
            // 2. Wait for a specific amount of time.
            await new Promise(r => setTimeout(r, retryInterval(lastError, i)));
          }

          try {
            // If the call was successful, return its result.
            return {
              status: 'success',
              data: await fetcher(...params),
            } satisfies KeyStateSuccess<D>;
          } catch (e) {
            // Otherwise memoize the error.
            lastError = e as E;
          }
        }
        const cachedData = getAtLeastStale(k);
        return {
          status: 'error',
          error: lastError!,
          latestData: cachedData ? cachedData.data : undefined,
        } satisfies KeyStateError<D, E>;
      })()
        .then(keyState => {
          const cachedData = dataCache.get(k);
          if (
            // Error received.
            keyState.status !== 'success'
            // No cached data found.
            || !cachedData
            // Or cached data differs from the received one.
            || !dequal(cachedData.data, keyState.data)
          ) {
            emitKeyStateUpdate(k, keyState);
          }

          // If the request was successful, actualize the cache.
          if (keyState.status === 'success') {
            cacheValue(k, keyState.data);
            return keyState.data;
          }
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw keyState.error;
        })
        .finally(() => {
          // Remember to remove pending promise, so we could call fetch again.
          revalidationCache.delete(k);
        });
      revalidationCache.set(k, pendingPromise);
      emitKeyStateUpdate(k, { status: 'pending', data: pendingPromise });
    } else {
      log('@revalidate: pending promise found');
    }
    return pendingPromise;
  };

  // Performs revalidation and mutes the error.
  const revalidateMuted = (params: P): Promise<D | void> => {
    return revalidate(params).catch(() => {
      // TODO: onError?
    });
  };

  return {
    get(params, shouldRevalidate) {
      log('@get()', { params, shouldRevalidate });
      const cachedData = dataCache.get(computeKey(params));

      // A new item or item with expired lifetime.
      if (!cachedData || cachedData.timestamp + freshAge + staleAge < Date.now()) {
        return { status: 'pending', data: revalidate(params) };
      }

      // Stale item or revalidation required. In this case we create a new request and expect
      // it to call required subscribers.
      if (cachedData.timestamp + freshAge < Date.now() || shouldRevalidate) {
        void revalidateMuted(params);
      }
      return { status: 'success', data: cachedData.data };
    },
    subscribe(params, listener) {
      return observableByKey(computeKey(params)).sub(listener);
    },
    mutate(params, data, shouldRevalidate = true) {
      log('@mutate()', { params, data, shouldRevalidate });
      const k = computeKey(params);
      const cachedData = getAtLeastStale(k);
      const finalData = typeof data === 'function'
        ? data(cachedData ? cachedData.data : undefined)
        : data;

      finalData && cacheValue(k, finalData[0]);
      shouldRevalidate && void revalidateMuted(params);
    },
  };
}
