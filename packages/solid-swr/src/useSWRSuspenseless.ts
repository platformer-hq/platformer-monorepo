import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreKey,
  type CreateSWRStoreOptions,
  type KeyState, KeyStateError, KeyStatePending, KeyStateRevalidating, KeyStateSuccess,
  type SWRStoreMutateFn,
  type SWRStoreMutateWithLatestFn,
} from 'swr';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { access, type MaybeAccessor } from '@solid-primitives/utils';
import { createWritableMemo } from '@solid-primitives/memo';

export type UseSWRSuspenselessOptionsArgs<P> = MaybeAccessor<
  | [params: P, shouldRevalidate?: boolean]
  | undefined
  | null
  | false
>;

export interface UseSWRSuspenselessOptions<D, P, E> extends CreateSWRStoreOptions<D, E> {
  /**
   * List of arguments passed to the fetcher.
   */
  args?: UseSWRSuspenselessOptionsArgs<P>;
  /**
   * Hook being called whenever any error occurred.
   * @param params - used parameters.
   * @param error - occurred error.
   */
  onErrored?: (params: P, error: E) => void;
  /**
   * Hook being called whenever the resource is ready.
   * @param params - used parameters.
   * @param data - retrieved data.
   // * @param cached - true if the retrieved data is considered as cached.
   */
  onReady?: (params: P, data: D,
    // cached: boolean
  ) => void;
}

export interface UseSWRSuspenselessResultUtils<D, P> {
  /**
   * Retrieves the value by its key.
   * @param params - list of parameters to use to compute the key.
   * @param shouldRevalidate - should revalidation be performed. Default is `true`.
   */
  get: (params: P, shouldRevalidate?: boolean) => void;
  /**
   * Mutates the data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Passing `undefined`, `null` or `false`, will lead to skipping
   * the mutation. In order to save the data, specify an array with the only one element containing
   * data to save. You can also pass a function receiving the latest data state and returning the
   * same values described previously.
   * @param shouldRevalidate - should revalidation be performed. Default is `true`.
   * @returns A promise with retrieved data if `shouldRevalidate` is `undefined` or `true`.
   * Nothing otherwise.
   */
  mutate: SWRStoreMutateFn<D, P>;
  /**
   * Mutates the data, stored in the key.
   * @param params - list of parameters to use to compute the key.
   * @param data - data to store. Passing `undefined`, `null` or `false`, will lead to skipping
   * the mutation. In order to save the data, specify an array with the only one element containing
   * data to save. You can also pass a function receiving the latest data and returning the
   * same values described previously.
   * @param shouldRevalidate - should revalidation be performed. Default is `true`.
   * @returns A promise with retrieved data if `shouldRevalidate` is `undefined` or `true`.
   * Nothing otherwise.
   */
  mutateWithLatest: SWRStoreMutateWithLatestFn<D, P>;
}

type WithMeta<T, D, L, R, E> = T & {
  /**
   * Any available ready data to display. It will either be data from "success" state, or
   * latestData from other states.
   */
  anyData: D | undefined;
  /**
   * True if the key is currently in "pending" or "revalidating" state.
   */
  loading: L;
  /**
   * True if the key is currently in "success" or "revalidating" state.
   */
  ready: R;
  /**
   * True if the key is currently in "error" state.
   */
  errored: E;
};
export type UseSWRKeyState<D, E> = KeyState<D, E> | {
  status: 'unresolved';
  latestData?: undefined;
};
export type UseSWRKeyStateSignal<D, E> =
  | (WithMeta<KeyStatePending<D>, D, true, false, false>)
  | (WithMeta<KeyStateRevalidating<D>, D, true, true, false>)
  | (WithMeta<KeyStateSuccess<D>, D, false, true, false>)
  | (WithMeta<KeyStateError<D, E>, D, false, false, true>)
  | (WithMeta<{ status: 'unresolved' }, D, false, false, false>);

export type UseSWRSuspenselessResult<D, P, E> = [
  UseSWRKeyStateSignal<D, E>,
  UseSWRSuspenselessResultUtils<D, P>
];

export function useSWRSuspenseless<D, P extends any[], E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWRSuspenselessOptions<D, P, E>,
): UseSWRSuspenselessResult<D, P, E> {
  options ||= {};
  const { onReady, onErrored } = options;

  // Create an underlying SWR store.
  const store = createSWRStore<D, P, E>(key, fetcher, options);

  // List of the tracked arguments.
  const [$trackedArgs, setTrackedArgs] = createWritableMemo(() => {
    return access(options.args);
  });
  const initialArgs = $trackedArgs();
  const [$keyState, setKeyState] = createSignal<UseSWRKeyState<D, E>>(
    initialArgs ? store.get(...initialArgs) : { status: 'unresolved' },
  );
  const initialKeyState = $keyState();

  // The first set should be skipped if we had some initial arguments. In this case $keyState will
  // have some value set initially, as well as some pending operations in the store will
  // start proceeding. Not skipping this set will lead to unnecessary re-render as long
  // as store.get will return a new object with the same properties.
  // let shouldSkipSet = !initialArgs;
  createEffect(() => {
    const trackedArgs = $trackedArgs();
    if (trackedArgs) {
      // Whenever we have some arguments set, we should track their related key value changes.
      onCleanup(store.subscribe(trackedArgs[0], setKeyState));
      // !shouldSkipSet && setKeyState(store.get(...args));
      setKeyState(v => {
        // To prevent unnecessary re-renders we check if the current value is the initial one set.
        // In case it is, we return it. Otherwise, call store.get and return a new value.
        return v && v === initialKeyState ? v : store.get(...trackedArgs);
      });
    }
  });

  createEffect(() => {
    const ks = $keyState();
    if (ks) {
      const args = $trackedArgs();
      const params = (Array.isArray(args) ? args[0] : undefined)!;
      ks.status === 'success' && onReady && onReady(params, ks.data);
      ks.status === 'error' && onErrored && onErrored(params, ks.error);
    }
  });

  const $status = createMemo(() => $keyState().status);
  const $errored = createMemo(() => $status() === 'error');
  const $error = createMemo(() => {
    const ks = $keyState();
    if (ks.status === 'error') {
      return ks.error;
    }
  });
  const $anyData = createMemo(() => {
    const { latestData } = $keyState();
    return latestData ? latestData.data : undefined;
  });
  const $loading = createMemo(() => {
    return ['pending', 'revalidating'].includes($status());
  });
  const $ready = createMemo(() => {
    return ['success', 'revalidating'].includes($status());
  });

  return [{
    get anyData() {
      return $anyData();
    },
    get data() {
      const ks = $keyState();
      if (ks.status === 'error' || ks.status === 'unresolved') {
        throw new Error('Illegal access on errored or unresolved state');
      }
      return ks.data;
    },
    get error() {
      return $error();
    },
    get errored() {
      return $errored();
    },
    get latestData() {
      return $keyState().latestData;
    },
    get loading() {
      return $loading();
    },
    get ready() {
      return $ready();
    },
    get status() {
      return $status();
    },
  } as UseSWRKeyStateSignal<D, E>, {
    get(params, shouldRevalidate) {
      // "get" just switches the hooks arguments context.
      setTrackedArgs([params, shouldRevalidate]);
    },
    // TODO: Should probably refactor mutate functions.
    mutate: ((params, data, shouldRevalidate) => {
      // "mutate" performs a mutation and then switches the context.
      const maybePromise = store.mutate(params, data, shouldRevalidate as any);
      // We don't pass shouldRevalidate here as long as it will be applied in the mutation, so
      // we don't need to revalidate.
      setTrackedArgs([params, false]);
      return maybePromise;
    }) as SWRStoreMutateFn<D, P>,
    mutateWithLatest: ((params, data, shouldRevalidate) => {
      // "mutate" performs a mutation and then switches the context.
      const maybePromise = store.mutateWithLatest(params, data, shouldRevalidate as any);
      // We don't pass shouldRevalidate here as long as it will be applied in the mutation, so
      // we don't need to revalidate.
      setTrackedArgs([params, false]);
      return maybePromise;
    }) as SWRStoreMutateWithLatestFn<D, P>,
  }];
}