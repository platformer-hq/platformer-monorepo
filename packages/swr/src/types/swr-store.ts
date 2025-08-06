import type { KeyLatestData, KeyState } from './key-state.js';
import type { ObservableListener } from './observable.js';

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

export type SWRStoreRevalidateFn<D, P, E> = (params: P) => KeyState<D, E>;

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
  revalidate: SWRStoreRevalidateFn<D, P, E>;
  /**
   * Subscribes to a specific key.
   * @param params - list of parameters to use to compute the key.
   * @param listener - data listener.
   * @returns A function to remove the bound listener.
   */
  subscribe: SWRStoreSubscribeFn<D, P, E>;
}
