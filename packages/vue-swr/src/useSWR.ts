import {
  computed,
  type MaybeRefOrGetter,
  onWatcherCleanup,
  reactive,
  shallowRef,
  toValue,
  watchEffect,
} from 'vue';
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
} from './swr/index.js';

export type UseSWROptionsArgs<P extends object> = MaybeRefOrGetter<
  | [params: P, shouldRevalidate?: boolean]
  | P
  | false
  | undefined
  | null
>;

export interface UseSWROptions<D, P extends object, E> extends CreateSWRStoreOptions<D, P, E> {
  /**
   * List of arguments to be passed to the fetcher.
   */
  args?: UseSWROptionsArgs<P>;
}

export interface UseSWRResultUtils<D, P> {
  get: (params: P, shouldRevalidate?: boolean) => void;
  mutate: SWRStoreMutateFn<D, P>;
  revalidate: SWRStoreRevalidateFn<D, P>;
}

type WithGetters<T, D, L, R, E> = T & {
  /**
   * @returns Any available data. Effectively, this value is equal to the result of accessing
   * the `latestData?.data` path.
   */
  get anyData(): D | undefined;
  /**
   * @returns True if the key is pending or revalidating.
   */
  get loading(): L;
  /**
   * @returns True if the key is fresh or stale at least.
   */
  get ready(): R;
  /**
   * @returns Error of the key is holding an error.
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

export type UseSWRResult<D, P, E> = [
  UseSWRKeyStateWrapped<D, E>,
  UseSWRResultUtils<D, P>,
];

export function useSWR<D, P extends object, E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWROptions<D, P, E>,
): UseSWRResult<D, P, E> {
  options ||= {};

  const store = createSWRStore<D, P, E>(key, fetcher, options);

  const initialArgsValue = toValue(options.args);
  const initialArgs: [params: P, shouldRevalidate?: boolean] | undefined = initialArgsValue
    ? Array.isArray(initialArgsValue) ? initialArgsValue : [initialArgsValue]
    : undefined;
  const trackedArgs = shallowRef(initialArgs);

  const keyState = shallowRef<UseSWRKeyState<D, E>>(
    initialArgs ? store.get(...initialArgs) : { status: 'unresolved' },
  );

  watchEffect(() => {
    const { value: args } = trackedArgs;
    if (args) {
      onWatcherCleanup(store.subscribe(args[0], newKeyState => {
        keyState.value = newKeyState;
      }));
      store.get(...args);
    }
  });

  return [
    reactive({
      anyData: computed(() => {
        const { latestData } = keyState.value;
        return latestData ? latestData.data : undefined;
      }),
      data: computed(() => keyState.value.data),
      error: computed(() => {
        const ks = keyState.value;
        return ks.status === 'error' ? ks.error : undefined;
      }),
      errored: computed(() => keyState.value.status === 'error'),
      latestData: computed(() => keyState.value.latestData),
      loading: computed(() => ['pending', 'revalidating'].includes(keyState.value.status)),
      ready: computed(() => ['success', 'revalidating'].includes(keyState.value.status)),
      status,
    }) as UseSWRKeyStateWrapped<D, E>,
    {
      get(params, shouldRevalidate) {
        // "get" just switches the tracked value.
        trackedArgs.value = [params, shouldRevalidate];
      },
      revalidate: store.revalidate,
      mutate: ((params, data, shouldRevalidate) => {
        // "mutate" performs a mutation and then switches the context.
        const maybePromise = store.mutate(params, data, shouldRevalidate as any);
        // We don't pass shouldRevalidate here as long as it was applied in the mutation, so we
        // don't need to revalidate again.
        trackedArgs.value = [params, false];
        return maybePromise;
      }) as SWRStoreMutateFn<D, P>,
    },
  ];
}
