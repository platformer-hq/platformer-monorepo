import { observable } from './observable.js';
import type {
  CachedData,
  KeyLatestData,
  KeyState,
  KeyStateDataPromise,
  KeyStateError,
  KeyStatePending,
  KeyStatePromiseData,
  KeyStateSuccess,
  Observable,
  SWRStore,
  SWRStoreGetFn,
  SWRStoreKeyValue,
  SWRStoreMutateFn,
  SWRStoreMutateFnData,
  SWRStoreMutateFnDataHookCtx,
} from './types/index.js';

export type CreateSWRStoreKey<P> = SWRStoreKeyValue | ((params: P) => SWRStoreKeyValue);

export type CreateSWRStoreFetcher<D, P> = (params: P) => Promise<D>;

export interface SWRStoreOnSuccessPayload<D, P> {
  /**
   * True, if the specified data was taken from the cache.
   */
  cached?: boolean;
  /**
   * Retrieved data.
   */
  data: D;
  /**
   * True, if the specified data was received in a result of calling a mutation.
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
 * @param key - cache key.
 * @returns An observable for the specified key.
 */
function observableByKey<D, E>(key: string): Observable<KeyState<D, E>> {
  const value = observersCache.get(key) || observable();
  observersCache.set(key, value);
  return value;
}

/**
 * Emits a new state for the specified key.
 * @param state - state to emit.
 */
function emitKeyStateUpdate<D, E>(state: KeyState<D, E>) {
  observableByKey(state.key).emit(state);
}

/**
 * Caches a value for the specified key.
 * @param key - cache key.
 * @param data - data to cache.
 * @param timestamp - timestamp to use for the cache.
 */
function cacheValue<D>(key: string, data: D, timestamp: number) {
  dataCache.set(key, { timestamp, data });
}

/**
 * @param key - a function returning a key, or a key itself.
 * @param params - list of store parameters.
 * @returns A computed key value.
 */
function computeKey<P>(key: CreateSWRStoreKey<P>, params: P): string {
  const value = typeof key === 'function' ? key(params) : key;
  return (Array.isArray(value) ? value : [value]).join(',');
}

/**
 * Creates a new SWR store.
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

  /**
   * @param key - cache key.
   * @returns The latest data for the speicified key.
   */
  const getLatestData = (key: string): KeyLatestData<D> | undefined => {
    const now = Date.now();
    const cachedData = dataCache.get(key);
    if (cachedData) {
      const { timestamp } = cachedData;
      return {
        ...cachedData,
        get state() {
          return now < timestamp + freshAge
            ? 'fresh'
            : now < timestamp + freshAge + staleAge
              ? 'stale'
              : 'expired';
        },
      };
    }
  };

  // Fetches data for the specified set of parameters.
  const fetchData = async (params: P): Promise<KeyStatePromiseData<D, E>> => {
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

  const getKeyState = (
    params: P,
    revalidate: boolean,
  ): KeyStatePending<D, E> | KeyStateSuccess<D> => {
    const computedKey = computeKey(key, params);
    const latestData = getLatestData(computedKey);
    const withKey = { key: computedKey };

    if (latestData && latestData.state === 'fresh' && !revalidate) {
      return { ...withKey, status: 'success', data: latestData.data };
    }

    let promise: KeyStateDataPromise<D, E> | undefined = revalidationCache.get(computedKey);
    if (!promise) {
      promise = fetchData(params).then(result => {
        revalidationCache.delete(computedKey);
        let keyState: KeyStateSuccess<D> | KeyStateError<E>;
        if (result.ok) {
          keyState = { ...withKey, status: 'success', data: result.data };
          cacheValue(keyState.key, keyState.data, Date.now());
          onSuccess({ params, data: keyState.data });
        } else {
          keyState = { ...withKey, status: 'error', error: result.error };
          onError({ params, error: keyState.error });
        }
        emitKeyStateUpdate(keyState);
        return result;
      });
      revalidationCache.set(computedKey, promise);
    }
    return { ...withKey, status: 'pending', promise };
  };

  const get = ((params, revalidate) => {
    const keyState = getKeyState(params, revalidate || false);
    if (keyState.status === 'success') {
      onSuccess({ params, data: keyState.data, cached: true });
    }
    emitKeyStateUpdate(keyState);
    return keyState;
  }) as SWRStoreGetFn<D, P, E>;

  return {
    get,
    revalidate(params: P) {
      return get(params, true);
    },
    subscribe(params, listener) {
      // TODO: We probably want to create a separate method subscribeData subscribing to data
      //  changes only as long this one will re-trigger subscribers even when data didn't change.
      return observableByKey<D, E>(computeKey(key, params)).sub(listener);
    },
    mutate: ((params, mutateData, revalidate) => {
      const computedKey = computeKey(key, params);
      const latestData = getLatestData(computedKey);
      // TODO: We should somehow prevent developers from specifying function as D.
      const data = typeof mutateData === 'function'
        ? (mutateData as (context: SWRStoreMutateFnDataHookCtx<D>) => SWRStoreMutateFnData<D>)({
          get freshData() {
            return latestData && latestData.state === 'fresh' ? latestData.data : undefined;
          },
        })
        : mutateData;

      if (data !== undefined) {
        const timestamp = Date.now();
        cacheValue(computedKey, data, timestamp);
        emitKeyStateUpdate({ key: computedKey, status: 'success', data });
        onSuccess({ params, data, mutation: true });
      }
      return revalidate ? get(params, true) : undefined;
    }) as SWRStoreMutateFn<D, P, E>,
  };
}
