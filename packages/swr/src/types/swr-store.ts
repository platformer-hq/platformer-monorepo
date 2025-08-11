import type { KeyState, KeyStatePending, KeyStateSuccess } from './key-state.js';
import type { ObservableListener } from './observable.js';

/**
 * List of types that could be used to compute the cache key.
 */
export type SWRStoreKeyValue = string | number | (string | number)[];

/**
 * Data returned from a data mutation function. Returning undefined will lead to mutation skip.
 */
export type SWRStoreMutateFnData<D> = D | undefined;

export interface SWRStoreMutateFnDataHook<D> {
  (context: SWRStoreMutateFnDataHookCtx<D>): SWRStoreMutateFnData<D>;
}

export interface SWRStoreMutateFnDataHookCtx<D> {
  /**
   * @returns Fresh data if any is presented.
   */
  get freshData(): D | undefined;
}

export interface SWRStore<D, P, E = unknown> {
  /**
   * Retrieves the value by its key.
   * @param params - list of parameters to use to compute the key.
   * @param revalidate - true if the cached value should be ignored.
   */
  get(params: P, revalidate?: false): KeyStatePending<D, E> | KeyStateSuccess<D>;
  /**
   * Retrieves the value by its key.
   * @param params - list of parameters to use to compute the key.
   * @param revalidate - true if the cached value should be ignored.
   */
  get(params: P, revalidate: true): KeyStatePending<D, E>;
  /**
   * Mutates data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Specifying `undefined` will lead to skipping the mutation.
   * @param revalidate - should revalidation be performed.
   */
  mutate(
    params: P,
    data?: SWRStoreMutateFnData<D> | SWRStoreMutateFnDataHook<D>,
    revalidate?: false,
  ): void;
  /**
   * Mutates data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Specifying `undefined` will lead to skipping the mutation.
   * @param revalidate - should revalidation be performed.
   * @returns A pending key state.
   */
  mutate(
    params: P,
    data: SWRStoreMutateFnData<D> | SWRStoreMutateFnDataHook<D> | undefined,
    revalidate: true,
  ): KeyStatePending<D, E>;
  /**
   * Revalidates a key using specified parameters.
   * @param params - parameters to use to revalidate.
   */
  revalidate(params: P): KeyStatePending<D, E>;
  /**
   * Subscribes to a specific key.
   * @param params - list of parameters to use to compute the key.
   * @param listener - data listener.
   * @returns A function to remove the bound listener.
   */
  subscribe(params: P, listener: ObservableListener<KeyState<D, E>>): VoidFunction;
}

export type SWRStoreGetFn<D, P, E> = SWRStore<D, P, E>['get'];
export type SWRStoreMutateFn<D, P, E> = SWRStore<D, P, E>['mutate'];
export type SWRStoreSubscribeFn<D, P, E> = SWRStore<D, P, E>['subscribe'];
export type SWRStoreRevalidateFn<D, P, E> = SWRStore<D, P, E>['revalidate'];
