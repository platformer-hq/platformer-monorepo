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
import {
  computed,
  onWatcherCleanup,
  reactive,
  shallowRef,
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
} from 'vue';

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

export interface UseSWRResultUtils<D, P, E> {
  get: (params: P, shouldRevalidate?: boolean) => void;
  mutate: SWRStoreMutateFn<D, P>;
  revalidate: SWRStoreRevalidateFn<D, P, E>;
}

type WithGetters<T, O extends {
  /**
   * @returns Any available data to display. In a nutshell, this getter
   * returns keyState.latestData?.data.
   */
  get anyData(): any;
  /**
   * @returns True if the key status is "pending" or "revalidating".
   */
  get loading(): boolean;
  /**
   * @returns True if the key is fresh or stale at least.
   */
  get ready(): boolean;
  // /**
  //  * @returns Error of the key is holding an error.
  //  */
  // get errored(): boolean;
}> = T & O;

type WithStatus<S extends string> = { status: S };
type WithKeyStateGetters<K extends KeyState<any, any>> = WithGetters<K, {
  anyData: K extends WithStatus<'success'>
    ? K['data']
    : (
      | Exclude<K['latestData'], undefined>['data']
      | (undefined extends K['latestData'] ? undefined : never)
    );
  loading: K extends WithStatus<'pending' | 'revalidating'> ? true : false;
  ready: K extends WithStatus<'success' | 'revalidating'> ? true : false;
  // errored: K extends WithStatus<'error'> ? true : false;
}>;

export type UseSWRKeyStatePending<D, E> = WithKeyStateGetters<KeyStatePending<D, E>>;
export type UseSWRKeyStateRevalidating<D, E> = WithKeyStateGetters<KeyStateRevalidating<D, E>>;
export type UseSWRKeyStateSuccess<D> = WithKeyStateGetters<KeyStateSuccess<D>>;
export type UseSWRKeyStateError<D, E> = WithKeyStateGetters<KeyStateError<D, E>>;
export type UseSWRKeyStateUnresolved = WithGetters<{ status: 'unresolved' }, {
  anyData: undefined;
  loading: false;
  ready: false;
  // errored: false;
}>;
export type UseSWRKeyState<D, E> =
  | UseSWRKeyStatePending<D, E>
  | UseSWRKeyStateRevalidating<D, E>
  | UseSWRKeyStateSuccess<D>
  | UseSWRKeyStateError<D, E>
  | UseSWRKeyStateUnresolved;

export type UseSWRResult<D, P, E> = [
  UseSWRKeyState<D, E>,
  UseSWRResultUtils<D, P, E>,
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

  const keyState = shallowRef<KeyState<D, E> | {
    status: 'unresolved';
    error?: undefined;
    data?: undefined;
    latestData?: undefined;
  }>(
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
      anyData: computed(() => keyState.value.latestData?.data),
      data: computed(() => keyState.value.data),
      error: computed(() => {
        const ks = keyState.value;
        return ks.status === 'error' ? ks.error : undefined;
      }),
      // errored: computed(() => keyState.value.status === 'error'),
      latestData: computed(() => keyState.value.latestData),
      loading: computed(() => ['pending', 'revalidating'].includes(keyState.value.status)),
      ready: computed(() => ['success', 'revalidating'].includes(keyState.value.status)),
      status: computed(() => keyState.value.status),
    }) as UseSWRKeyState<D, E>,
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
