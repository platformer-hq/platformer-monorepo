import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreKey,
  type CreateSWRStoreOptions,
  type KeyState,
  type KeyStateError,
  type KeyStatePending,
  type KeyStateRevalidating,
  type KeyStateSuccess,
  type SWRStoreMutateFn,
  type SWRStoreRevalidateFn,
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

export interface UseSWRSuspenselessOptions<D, P, E> extends CreateSWRStoreOptions<D, P, E> {
  /**
   * List of arguments passed to the fetcher.
   */
  args?: UseSWRSuspenselessOptionsArgs<P>;
}

export interface UseSWRSuspenselessResultUtils<D, P> {
  /**
   * @see SWRStore.get
   */
  get: (params: P, shouldRevalidate?: boolean) => void;
  /**
   * @see SWRStore.mutate
   */
  mutate: SWRStoreMutateFn<D, P>;
  /**
   * @see SWRStore.revalidate
   */
  revalidate: SWRStoreRevalidateFn<D, P>;
}

type WithGetters<T, D, L, R, E> = T & {
  /**
   * Any available data to display. Effectively, this value is equal to the result of accessing
   * the `latestData?.data` property.
   */
  get anyData(): D | undefined;
  /**
   * True if the key is currently in "pending" or "revalidating" state. It states, that
   * there are some background operations related to the key.
   */
  get loading(): L;
  /**
   * True if the key is currently in "success" or "revalidating" state. It states, that contained
   * data is either fresh or stale at least.
   */
  get ready(): R;
  /**
   * True if the key is currently in "error" state. It states, that some error occurred while
   * fetching data.
   */
  get errored(): E;
};
export type UseSWRKeyState<D, E> = KeyState<D, E> | {
  status: 'unresolved';
  error?: undefined;
  data?: undefined;
  latestData?: undefined;
};
export type UseSWRKeyStateWrapped<D, E> =
  | (WithGetters<KeyStatePending<D>, D, true, false, false>)
  | (WithGetters<KeyStateRevalidating<D>, D, true, true, false>)
  | (WithGetters<KeyStateSuccess<D>, D, false, true, false>)
  | (WithGetters<KeyStateError<D, E>, D, false, false, true>)
  | (WithGetters<{ status: 'unresolved' }, D, false, false, false>);

export type UseSWRSuspenselessResult<D, P, E> = [
  UseSWRKeyStateWrapped<D, E>,
  UseSWRSuspenselessResultUtils<D, P>
];

export function useSWRSuspenseless<D, P extends any[], E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWRSuspenselessOptions<D, P, E>,
): UseSWRSuspenselessResult<D, P, E> {
  options ||= {};

  // Create an underlying SWR store.
  const store = createSWRStore<D, P, E>(key, fetcher, options);

  // List of the tracked arguments.
  const [$trackedArgs, setTrackedArgs] = createWritableMemo(() => access(options.args));
  const initialArgs = $trackedArgs();
  const [$keyState, setKeyState] = createSignal<UseSWRKeyState<D, E>>(
    initialArgs ? store.get(...initialArgs) : { status: 'unresolved' },
  );

  // The first set should be skipped if we had some initial arguments. In this case $keyState will
  // have some value set initially, as well as some pending operations in the store will
  // start proceeding. Not skipping this set will lead to unnecessary re-render as long
  // as store.get will return a new object with the same properties.
  createEffect(() => {
    const trackedArgs = $trackedArgs();
    if (trackedArgs) {
      // Whenever we have some arguments set, we should track their related key value changes.
      onCleanup(store.subscribe(trackedArgs[0], setKeyState));
      store.get(...trackedArgs);
    }
  });

  const $status = createMemo(() => $keyState().status);
  const $anyData = createMemo(() => {
    const { latestData } = $keyState();
    return latestData ? latestData.data : undefined;
  });
  const $error = createMemo(() => {
    const ks = $keyState();
    return ks.status === 'error' ? ks.error : undefined;
  });
  const $errored = createMemo(() => $status() === 'error');
  const $loading = createMemo(() => ['pending', 'revalidating'].includes($status()));
  const $ready = createMemo(() => ['success', 'revalidating'].includes($status()));

  return [{
    get anyData() {
      return $anyData();
    },
    get data() {
      return $keyState().data;
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
  } as UseSWRKeyStateWrapped<D, E>, {
    get(params, shouldRevalidate) {
      // "get" just switches the hooks arguments context.
      setTrackedArgs([params, shouldRevalidate]);
    },
    revalidate: store.revalidate,
    mutate: ((params, data, shouldRevalidate) => {
      // "mutate" performs a mutation and then switches the context.
      const maybePromise = store.mutate(params, data, shouldRevalidate as any);
      // We don't pass shouldRevalidate here as long as it will be applied in the mutation, so
      // we don't need to revalidate.
      setTrackedArgs([params, false]);
      return maybePromise;
    }) as SWRStoreMutateFn<D, P>,
  }];
}