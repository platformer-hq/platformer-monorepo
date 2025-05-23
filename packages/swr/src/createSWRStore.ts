import { dequal } from 'dequal/lite';
import { createLogger } from 'utils';

import { observable } from './observable.js';
import {
  DataCache,
  KeyLatestData,
  KeyLatestDataFresh,
  KeyLatestDataStale,
  KeyState,
  KeyStateError,
  KeyStateSuccess,
  Observable,
  ObservableListener,
  ObserversCache,
  RevalidationCache,
} from './types/index.js';

export type CreateSWRStoreKey<P extends any[]> =
  | SWRStoreKeyValue
  | ((...args: P) => SWRStoreKeyValue);

export type CreateSWRStoreFetcher<D, P extends any[]> = (...args: P) => Promise<D>;

export interface CreateSWRStoreOptions<D, E> {
  /**
   * Cache where all retrieved data is stored.
   */
  dataCache?: DataCache<D>;
  /**
   * Time in milliseconds determining for how long the received data is considered fresh and
   * can be used without revalidation.
   * @default 5000
   */
  freshAge?: number;
  logger?: 'default';
  /**
   * Cached used to store keys' observers. Observers are special values enabling its value
   * changes tracking.
   */
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
  /**
   * Cache used to store revalidation promises.
   */
  revalidationCache?: RevalidationCache<D>;
  /**
   * @returns True if the retry should be applied.
   * @default True
   * @param error - error received during the last attempt.
   */
  shouldRetry?: boolean | ((error: E) => boolean);
  /**
   * Time in milliseconds determining for how long the data is considered stale, after the
   * `freshAge` has expired. Stale data is the data that still can be used, but accessing this
   * kind of data will lead to calling revalidation.
   * @default 30000
   */
  staleAge?: number;
}

/**
 * List of types that could be used to compute the cache key.
 */
export type SWRStoreKeyValue = string | number | (string | number)[];

/**
 * Data returned from a data mutation function. Returning something rather than an array with
 * a single value will lead to mutation skipping.
 */
export type SWRStoreMutateFnData<D> =
  | undefined
  | null
  | false
  | [D];

/**
 * Function used to retrieve a value from the store.
 */
export type SWRStoreGetFn<D, P, E> = (params: P, shouldRevalidate?: boolean) => KeyState<D, E>;

/**
 * Function used to mutate a store key.
 */
export interface SWRStoreMutateFn<D, P> {
  (
    params: P,
    data:
      SWRStoreMutateFnData<D>
      | ((latestData?: KeyLatestData<D>) => SWRStoreMutateFnData<D>)
      | undefined,
    shouldRevalidate: false,
  ): void;
  (
    params: P,
    data?: SWRStoreMutateFnData<D> | ((latestData?: KeyLatestData<D>) => SWRStoreMutateFnData<D>),
    shouldRevalidate?: true,
  ): Promise<D>;
}
export type SWRStoreSubscribeFn<D, P, E> = (
  params: P,
  listener: ObservableListener<KeyState<D, E>>,
) => VoidFunction;

export interface SWRStore<D, P, E = unknown> {
  /**
   * Retrieves the value by its key.
   * @param params - list of parameters to use to compute the key.
   * @shouldRevalidate - should revalidation be performed. Default is `true`.
   */
  get: SWRStoreGetFn<D, P, E>;
  /**
   * Mutates the data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Passing `undefined`, `null` or `false`, will lead to skipping
   * the mutation. In order to save the data, specify an array with the only one element containing
   * data to save. You can also pass a function receiving the current value and returning the same
   * values described previously.
   * @shouldRevalidate - should revalidation be performed. Default is `true`.
   * @returns A promise with retrieved data if `shouldRevalidate` is `undefined` or `true`.
   * Nothing otherwise.
   */
  mutate: SWRStoreMutateFn<D, P>;
  /**
   * Subscribes to a specific key.
   * @param params - list of parameters to use to compute the key.
   * @param listener - data listener.
   * @returns A function to remove the bound listener.
   */
  subscribe: SWRStoreSubscribeFn<D, P, E>;
}
/**
 * Creates a new store.
 * @param key - a key to use.
 * @param fetcher - function to retrieve the key value.
 * @param options - list of additional options.
 * @returns A new store.
 */
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
    shouldLog: _logger === 'default',
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
  const cacheValue = (key: string, data: D, timestamp: number) => {
    const cachedValue = { timestamp, data };
    log('@cacheValue()', { key, cachedValue });
    dataCache.set(key, cachedValue);
  };

  // Gets the latest data for the specified key.
  const getLatest = (key: string): KeyLatestData<D> | undefined => {
    const now = Date.now();
    const cachedData = dataCache.get(key);
    if (cachedData) {
      const { timestamp } = cachedData;
      return {
        ...cachedData,
        state: now < timestamp + freshAge
          ? 'fresh'
          : now < timestamp + freshAge + staleAge
            ? 'stale'
            : 'expired',
      };
    }
  };

  // Returns cached data in case it is fresh or stale at least.
  const getFreshOrStale = (key: string):
    | KeyLatestDataFresh<D>
    | KeyLatestDataStale<D>
    | undefined => {
    const latest = getLatest(key);
    return latest && latest.state !== 'expired' ? latest : undefined;
  };

  // Computes key for the specified parameters.
  const computeKey = (params: P): string => {
    const value = typeof key === 'function' ? key(...params) : key;
    return (Array.isArray(value) ? value : [value]).join(',');
  };

  // Revalidate the key.
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
              timestamp: Date.now(),
            } satisfies KeyStateSuccess<D>;
          } catch (e) {
            // Otherwise memoize the error.
            lastError = e as E;
          }
        }
        return {
          status: 'error',
          error: lastError!,
          latestData: getLatest(k),
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
            cacheValue(k, keyState.data, keyState.timestamp);
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

  return {
    get(params, shouldRevalidate) {
      log('@get()', { params, shouldRevalidate });
      const now = Date.now();
      let latestData: KeyLatestData<D> | undefined;
      const cachedData = dataCache.get(computeKey(params));
      if (cachedData) {
        const { timestamp } = cachedData;
        latestData = {
          ...cachedData,
          state: now < timestamp + freshAge
            ? 'fresh'
            : now < timestamp + freshAge + staleAge
              ? 'stale'
              : 'expired',
        };
      }

      // A new item or item with expired lifetime.
      if (!latestData || latestData.state === 'expired') {
        return { status: 'pending', data: revalidate(params), latestData };
      }

      // Stale item or revalidation required. In this case we create a new request and expect
      // it to call required subscribers.
      const { state } = latestData;
      if (state === 'stale' || shouldRevalidate) {
        return { status: 'revalidating', latestData, data: revalidate(params) };
      }
      return { status: 'success', ...latestData };
    },
    subscribe(params, listener) {
      return observableByKey(computeKey(params)).sub(listener);
    },
    mutate: ((params, data, shouldRevalidate = true) => {
      log('@mutate()', { params, data, shouldRevalidate });
      const k = computeKey(params);
      const latestData = getFreshOrStale(k);
      const finalData = typeof data === 'function'
        ? data(latestData ? latestData : undefined)
        : data;

      finalData && cacheValue(k, finalData[0], Date.now());
      return shouldRevalidate ? revalidate(params) : undefined;
    }) as SWRStoreMutateFn<D, P>,
  };
}
