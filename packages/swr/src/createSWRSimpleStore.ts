import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreOptions,
  type SWRStoreKeyValue,
  type SWRStoreMutateFnData,
} from './createSWRStore.js';
import { KeyLatestData, KeyState, ObservableListener } from './types/index.js';

/**
 * Function used to retrieve a value from the store.
 */
export type SWRStoreSimpleGetFn<D, E> = (shouldRevalidate?: boolean) => KeyState<D, E>;

/**
 * Function used to mutate a store key.
 */
export interface SWRStoreSimpleMutateFn<D> {
  (
    data:
      SWRStoreMutateFnData<D>
      | ((latestData?: KeyLatestData<D>) => SWRStoreMutateFnData<D>)
      | undefined,
    shouldRevalidate: false,
  ): void;
  (
    data?: SWRStoreMutateFnData<D> | ((latestData?: KeyLatestData<D>) => SWRStoreMutateFnData<D>),
    shouldRevalidate?: true,
  ): Promise<D>;
}

export type SWRStoreSimpleSubscribeFn<D, E> = (
  listener: ObservableListener<KeyState<D, E>>,
) => VoidFunction;

export interface SWRStoreSimple<D extends object | string | boolean, E = unknown> {
  /**
   * Retrieves the current value.
   * @shouldRevalidate - should revalidation be performed. Default is `true`.
   */
  get: SWRStoreSimpleGetFn<D, E>;
  /**
   * Mutates the data, stored in the key.
   * @param data - data to store. Passing `undefined`, `null` or `false`, will lead to skipping
   * the mutation. In order to save the data, specify an array with the only one element containing
   * data to save. You can also pass a function receiving the current value and returning the same
   * values described previously.
   * @shouldRevalidate - should revalidation be performed. Default is `true`.
   * @returns A promise with retrieved data if `shouldRevalidate` is `undefined` or `true`.
   * Nothing otherwise.
   */
  mutate: SWRStoreSimpleMutateFn<D>;
  /**
   * Subscribes to the key.
   * @param listener - data listener.
   * @returns A function to remove the bound listener.
   */
  subscribe: SWRStoreSimpleSubscribeFn<D, E>;
}

/**
 * Creates a new store based on a single key.
 * @param key - a key to use.
 * @param fetcher - a function to retrieve the key value.
 * @param options - a list of additional options.
 * @returns A new store.
 */
export function createSWRStoreSimple<D extends object | string | boolean, E = unknown>(
  key: SWRStoreKeyValue,
  fetcher: CreateSWRStoreFetcher<D, []>,
  options?: CreateSWRStoreOptions<D, E>,
): SWRStoreSimple<D, E> {
  const store = createSWRStore<D, [], E>(key, fetcher, options);
  return {
    get: store.get.bind(store, []),
    mutate: store.mutate.bind(store, []) as SWRStoreSimpleMutateFn<D>,
    subscribe: store.subscribe.bind(store, []),
  };
}
