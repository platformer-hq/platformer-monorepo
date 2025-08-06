import { createKeyState } from './createKeyState.js';
import { observable } from './observable.js';
import type {
  CachedData,
  KeyLatestData,
  KeyState,
  KeyStateDataPromise,
  Observable,
  SWRStore,
  SWRStoreKeyValue,
  SWRStoreMutateContextData,
  SWRStoreMutateFn,
  SWRStoreMutateFnData,
} from './types/index.js';

export type CreateSWRStoreKey<P> =
  | SWRStoreKeyValue
  | ((params: P) => SWRStoreKeyValue);

export type CreateSWRStoreFetcher<D, P> = (params: P) => Promise<D>;

export interface SWRStoreOnSuccessPayload<D, P> {
  /**
   * True, if the specified data was taken from cache.
   */
  cached?: boolean;
  /**
   * Retrieved data.
   */
  data: D;
  /**
   * True, if the specified data was received in the result of calling mutation.
   */
  mutation?: boolean;
  /**
   * Parameters used to compute the key value.
   */
  params: P;
}

export interface SWRStoreOnSuccessFn<D, P> {
  (payload: SWRStoreOnSuccessPayload<D, P>): void;
}

export interface SWRStoreOnErrorPayload<P, E> {
  /**
   * Received error.
   */
  error: E;
  /**
   * Parameters used to compute the key value.
   */
  params: P;
}

export interface SWRStoreOnErrorFn<P, E> {
  (payload: SWRStoreOnErrorPayload<P, E>): void;
}

export interface CreateSWRStoreOptions<D, P, E> {
  /**
   * Time in milliseconds determining for how long the received data is considered fresh and
   * can be used without revalidation.
   * @default 20_000
   */
  freshAge?: number;
  /**
   * Hook that is being called whenever the fetch operation failed.
   * @param context - call payload.
   */
  onError?: SWRStoreOnErrorFn<P, E>;
  /**
   * Hook that is being called whenever the key value was retrieved.
   * @param context - call payload.
   */
  onSuccess?: SWRStoreOnSuccessFn<D, P>;
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
   * @returns True if the retry should be applied.
   * @default True
   * @param error - error received during the last attempt.
   */
  shouldRetry?: boolean | ((error: E) => boolean);
  /**
   * Time in milliseconds determining for how long the data is considered stale, after the
   * `freshAge` has expired. Stale data is the data that still can be used, but accessing this
   * kind of data will lead to calling revalidation.
   * @default 600_000
   */
  staleAge?: number;
}

const observersCache = new Map<string, Observable<KeyState<any, any>>>();
const dataCache = new Map<string, CachedData<any>>();
const revalidationCache = new Map<string, KeyStateDataPromise<any, any>>();

/**
 * Creates a new store.
 * @param key - a key to use.
 * @param fetcher - function to retrieve the key value.
 * @param options - list of additional options.
 * @returns A new store.
 */
export function createSWRStore<D, P, E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: CreateSWRStoreOptions<D, P, E>,
): SWRStore<D, P, E> {
  options ||= {};
  const noop = () => undefined;
  const {
    freshAge = 20_000,
    staleAge = 600_000,
    retries = 3,
    retryInterval: _retryInterval = (_, retriesPerformed) => {
      return Math.pow(2, retriesPerformed - 1) * 100;
    },
    shouldRetry: _shouldRetry = true,
    onError = noop,
    onSuccess = noop,
  } = options;
  const shouldRetry = typeof _shouldRetry === 'boolean' ? () => _shouldRetry : _shouldRetry;
  const retryInterval = typeof _retryInterval === 'number' ? () => _retryInterval : _retryInterval;

  // Guaranteed returns an observable for the specified key.
  const observableByKey = (key: string): Observable<KeyState<D, E>> => {
    const value = observersCache.get(key) || observable();
    observersCache.set(key, value);
    return value;
  };

  // Emits a new state for the specified key.
  const emitKeyStateUpdate = (key: string, state: KeyState<D, E>) => {
    observableByKey(key).emit(state);
  };

  // Caches a value for the specified key.
  const cacheValue = (key: string, data: D, timestamp: number) => {
    dataCache.set(key, { timestamp, data });
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

  // Computes key for the specified parameters.
  const computeKey = (params: P): string => {
    const value = typeof key === 'function' ? key(params) : key;
    return (Array.isArray(value) ? value : [value]).join(',');
  };

  // Fetches data for the specified set of parameters.
  const fetchData = async (params: P): Promise<{ ok: true; data: D } | { ok: false; error: E }> => {
    let error: E;
    for (let i = 0; i < retries + 1; i++) {
      if (i) {
        if (!shouldRetry(error!)) {
          break;
        }
        await new Promise(r => setTimeout(r, retryInterval(error, i)));
      }
      try {
        return { ok: true, data: await fetcher(params) };
      } catch (e) {
        error = e as E;
      }
    }
    return { ok: false, error: error! };
  };

  const getKeyState = (params: P, shouldRevalidate?: boolean): KeyState<D, E> => {
    const key = computeKey(params);
    const latestData = getLatest(key);

    if (latestData && latestData.state === 'fresh' && !shouldRevalidate) {
      return createKeyState('success', latestData.data, undefined, latestData);
    }

    let promise = revalidationCache.get(key);
    if (!promise) {
      promise = fetchData(params).then(result => {
        revalidationCache.delete(key);
        const keyState = result.ok
          ? createKeyState('success', result.data, undefined, {
            data: result.data,
            timestamp: Date.now(),
            state: 'fresh',
          })
          : createKeyState('error', undefined, result.error, latestData);

        if (keyState.status === 'success') {
          cacheValue(key, keyState.data, keyState.latestData.timestamp);
          onSuccess({ params, data: keyState.data });
        } else {
          onError({ params, error: keyState.error });
        }
        emitKeyStateUpdate(key, keyState);
        return result;
      });
      revalidationCache.set(key, promise);
    }

    return latestData
      ? createKeyState('revalidating', promise, undefined, latestData)
      : createKeyState('pending', promise);
  };

  const get = (params: P, shouldRevalidate?: boolean): KeyState<D, E> => {
    const keyState = getKeyState(params, shouldRevalidate);
    if (keyState.status === 'success') {
      onSuccess({ params, data: keyState.data, cached: true });
    }
    emitKeyStateUpdate(computeKey(params), keyState);
    return keyState;
  };

  return {
    get,
    revalidate(params) {
      return get(params, true);
    },
    subscribe(params, listener) {
      // TODO: We probably want to create a separate method subscribeData subscribing to data
      //  changes only as long this one will re-trigger subscribers even when data didn't change.
      return observableByKey(computeKey(params)).sub(listener);
    },
    mutate: ((params, mutateData, shouldRevalidate = true) => {
      const k = computeKey(params);
      const latestData = getLatest(k);
      // TODO: We should somehow prevent developers from specifying function as D.
      const data = typeof mutateData === 'function'
        ? (mutateData as (context: SWRStoreMutateContextData<D>) => SWRStoreMutateFnData<D>)({
          latestData,
          get valid() {
            return !!latestData && latestData.state !== 'expired';
          },
          get validData() {
            return latestData && latestData.state !== 'expired'
              ? latestData.data
              : undefined;
          },
        })
        : mutateData;

      if (data) {
        const timestamp = Date.now();
        cacheValue(k, data, timestamp);
        emitKeyStateUpdate(k, createKeyState('success', data, undefined, {
          data,
          timestamp,
          state: 'fresh',
        }));
        onSuccess && onSuccess({ params, data, mutation: true });
      }
      return shouldRevalidate ? get(params, true) : undefined;
    }) as SWRStoreMutateFn<D, P>,
  };
}
