import { observable } from './observable.js';
import {
  DataCache,
  KeyLatestData,
  KeyState,
  KeyStateError,
  KeyStatePending,
  KeyStateRevalidating,
  KeyStateSuccess,
  Observable,
  ObservableListener,
  ObserversCache,
  RevalidationCache,
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
   * Cache where all retrieved data is stored.
   */
  dataCache?: DataCache<D>;
  /**
   * Time in milliseconds determining for how long the received data is considered fresh and
   * can be used without revalidation.
   * @default 20_000
   */
  freshAge?: number;
  /**
   * Cached used to store keys' observers. Observers are special values enabling its value
   * changes tracking.
   */
  observersCache?: ObserversCache<D, E>;
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
   * @default 600_000
   */
  staleAge?: number;
}

/**
 * List of types that could be used to compute the cache key.
 */
export type SWRStoreKeyValue = string | number | (string | number)[];

/**
 * Data returned from a data mutation function. Returning undefined will lead to mutation skip.
 */
export type SWRStoreMutateFnData<D> = D | undefined;

/**
 * Function used to retrieve a value from the store.
 */
export type SWRStoreGetFn<D, P, E> = (params: P, shouldRevalidate?: boolean) => KeyState<D, E>;

export interface SWRStoreMutateContextData<D> {
  /**
   * Latest known data related to the specified parameters.
   */
  latestData?: KeyLatestData<D>;
  /**
   * True, if the item is fresh or stale at least.
   */
  get valid(): boolean;
  /**
   * Data if it is considered fresh or stale at least.
   */
  get validData(): D | undefined;
}

export interface SWRStoreMutateFn<D, P> {
  (
    params: P,
    data:
      | SWRStoreMutateFnData<D>
      | ((context: SWRStoreMutateContextData<D>) => SWRStoreMutateFnData<D>)
      | undefined,
    shouldRevalidate: false,
  ): void;
  (
    params: P,
    data?:
      | SWRStoreMutateFnData<D>
      | ((context: SWRStoreMutateContextData<D>) => SWRStoreMutateFnData<D>),
    shouldRevalidate?: true,
  ): Promise<D>;
}

export type SWRStoreRevalidateFn<D, P> = (params: P) => Promise<D>;

export type SWRStoreSubscribeFn<D, P, E> = (
  params: P,
  listener: ObservableListener<KeyState<D, E>>,
) => VoidFunction;

export interface SWRStore<D, P, E = unknown> {
  /**
   * Retrieves the value by its key.
   * @param params - list of parameters to use to compute the key.
   * @param shouldRevalidate - should revalidation be performed. Default is `true`.
   */
  get: SWRStoreGetFn<D, P, E>;
  /**
   * Mutates the data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Passing `undefined`, `null` or `false`, will lead to skipping
   * the mutation. In order to save the data, specify an array with the only one element containing
   * data to save. You can also pass a function receiving a specific context object and returning
   * the same values described previously.
   * @param shouldRevalidate - should revalidation be performed. Default is `true`.
   * @returns A promise with retrieved data if `shouldRevalidate` is `undefined` or `true`.
   * Nothing otherwise.
   */
  mutate: SWRStoreMutateFn<D, P>;
  /**
   * Revalidate the specified key.
   * @param params - list of parameters to use to compute the key.
   */
  revalidate: SWRStoreRevalidateFn<D, P>;
  /**
   * Subscribes to a specific key.
   * @param params - list of parameters to use to compute the key.
   * @param listener - data listener.
   * @returns A function to remove the bound listener.
   */
  subscribe: SWRStoreSubscribeFn<D, P, E>;
}

function createKeyState<D>(
  status: 'pending',
  data: Promise<D>,
  error: undefined,
  latestData: KeyLatestData<D> | undefined,
): KeyStatePending<D>;
function createKeyState<D>(
  status: 'revalidating',
  data: Promise<D>,
  error: undefined,
  latestData: KeyLatestData<D>,
): KeyStateRevalidating<D>;
function createKeyState<D>(
  status: 'success',
  data: D,
  error: undefined,
  latestData: KeyLatestData<D>,
): KeyStateSuccess<D>;
function createKeyState<D, E>(
  status: 'error',
  data: undefined,
  error: E,
  latestData: KeyLatestData<D> | undefined,
): KeyStateError<D, E>;
function createKeyState(
  status: any,
  data: any,
  error: any,
  latestData: any,
): any {
  return { status, data, latestData, error };
}

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
  const {
    freshAge = 20_000,
    staleAge = 600_000,
    retries = 3,
    retryInterval: _retryInterval,
    shouldRetry: _shouldRetry,
    onError,
    onSuccess,
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
  const fetchData = async (params: P): Promise<[true, D] | [false, E]> => {
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
        return [true, await fetcher(params)];
      } catch (e) {
        // Otherwise memoize the error.
        lastError = e as E;
      }
    }
    return [false, lastError!];
  };

  // Revalidates the key.
  const revalidate = (params: P, emit?: boolean): Promise<D> => {
    const k = computeKey(params);
    let pendingPromise = revalidationCache.get(k);

    // If there is no pending promise, we should create a new one and notify subscribers about
    // state change.
    if (!pendingPromise) {
      pendingPromise = fetchData(params)
        .then(tuple => {
          const keyState = tuple[0]
            ? createKeyState('success', tuple[1], undefined, {
              data: tuple[1],
              timestamp: Date.now(),
              state: 'fresh',
            })
            : createKeyState('error', undefined, tuple[1], getLatest(k));
          emitKeyStateUpdate(k, keyState);

          // If the request was successful, actualize the cache.
          if (keyState.status === 'success') {
            cacheValue(k, keyState.data, keyState.latestData.timestamp);
            onSuccess && onSuccess({ params, data: keyState.data });
            return keyState.data;
          }

          onError && onError({ params, error: keyState.error });
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw keyState.error;
        })
        .finally(() => {
          // Remember to remove pending promise, so we could call fetch again.
          revalidationCache.delete(k);
        });

      revalidationCache.set(k, pendingPromise);
      if (emit) {
        const latest = getLatest(k);
        emitKeyStateUpdate(k, latest
          ? createKeyState('revalidating', pendingPromise, undefined, latest)
          : createKeyState('pending', pendingPromise, undefined, latest));
      }
    }
    return pendingPromise;
  };

  return {
    get(params, shouldRevalidate) {
      let keyState: KeyState<D, E>;
      const key = computeKey(params);
      const latestData = getLatest(key);

      if (!latestData || latestData.state === 'expired') {
        // A new item or item with expired lifetime.
        keyState = createKeyState('pending', revalidate(params), undefined, latestData);
      } else if (latestData.state === 'stale' || shouldRevalidate) {
        // Stale item or revalidation required. In this case we create a new request and expect
        // it to call required subscribers.
        keyState = createKeyState('revalidating', revalidate(params), undefined, latestData);
      } else {
        keyState = createKeyState('success', latestData.data, undefined, latestData);
      }
      if (keyState.status === 'success') {
        onSuccess && onSuccess({ params, data: keyState.data, cached: true });
      }
      emitKeyStateUpdate(key, keyState);
      return keyState;
    },
    revalidate(params) {
      return revalidate(params, true);
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
      return shouldRevalidate ? revalidate(params, true) : undefined;
    }) as SWRStoreMutateFn<D, P>,
  };
}
