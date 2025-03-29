import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreOptions,
  type KeyState,
  type SWRStoreKeyValue,
  type SWRStoreMutateFnData,
} from './createSWRStore.js';
import type { ObservableListener } from './observable.js';

export type SWRStoreSimpleGetFn<D, E> = (shouldRevalidate?: boolean) => KeyState<D, E>;
export type SWRStoreSimpleMutateFn<D> = (
  data?: SWRStoreMutateFnData<D> | ((current?: D) => SWRStoreMutateFnData<D>),
  shouldRevalidate?: boolean,
) => void;
export type SWRStoreSimpleSubscribeFn<D, E> = (
  listener: ObservableListener<KeyState<D, E>>,
) => VoidFunction;

export interface SWRStoreSimple<D extends object | string | boolean, E = unknown> {
  get: SWRStoreSimpleGetFn<D, E>;
  mutate: SWRStoreSimpleMutateFn<D>;
  subscribe: SWRStoreSimpleSubscribeFn<D, E>;
}

export function createSWRStoreSimple<D extends object | string | boolean, E = unknown>(
  key: SWRStoreKeyValue,
  fetcher: CreateSWRStoreFetcher<D, []>,
  options?: CreateSWRStoreOptions<D, E>,
): SWRStoreSimple<D, E> {
  const store = createSWRStore<D, [], E>(key, fetcher, options);
  return {
    get: store.get.bind(store, []),
    mutate: store.mutate.bind(store, []),
    subscribe: store.subscribe.bind(store, []),
  };
}
