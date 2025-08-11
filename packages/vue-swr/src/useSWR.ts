import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreKey,
  type CreateSWRStoreOptions,
  type KeyStateError,
  type KeyStatePending,
  type KeyStateSuccess,
  type SWRStoreMutateFn,
} from 'swr';
import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
} from 'vue';

export type UseSWROptionsArgs<P extends object> = MaybeRefOrGetter<
  | [params: P, revalidate?: boolean]
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
  get: (params: P, revalidate?: boolean) => void;
  mutate: SWRStoreMutateFn<D, P, E>;
  revalidate: (params: P) => void;
}

export type UseSWRResultUtilsGetFn<P> = UseSWRResultUtils<never, P, never>;
export type UseSWRResultUtilsMutateFn<D, P, E> = UseSWRResultUtils<D, P, E>;
export type UseSWRResultUtilsRevalidateFn<P> = UseSWRResultUtils<never, P, never>;

export type UseSWRKeyStatePending<D, E> = KeyStatePending<D, E>;
export type UseSWRKeyStateSuccess<D> = KeyStateSuccess<D>;
export type UseSWRKeyStateError<E> = KeyStateError<E>;
export type UseSWRKeyState<D, E> =
  | UseSWRKeyStatePending<D, E>
  | UseSWRKeyStateSuccess<D>
  | UseSWRKeyStateError<E>
  | { status: 'unresolved' };

export type UseSWRResult<D, P, E> = [
  keyState: ComputedRef<UseSWRKeyState<D, E>>,
  utils: UseSWRResultUtils<D, P, E>,
];

export function useSWR<D, P extends object, E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWROptions<D, P, E>,
): UseSWRResult<D, P, E> {
  options ||= {};

  const store = createSWRStore<D, P, E>(key, fetcher, options);
  const storeGet = (params: P, revalidate?: boolean) => {
    // @ts-expect-error It is ok.
    return store.get(params, revalidate);
  };

  const initialArgsValue = toValue(options.args);
  const initialArgs: [params: P, revalidate?: boolean] | undefined = initialArgsValue
    ? Array.isArray(initialArgsValue) ? initialArgsValue : [initialArgsValue]
    : undefined;
  const trackedArgs = shallowRef(initialArgs);

  const keyState = shallowRef<UseSWRKeyState<D, E>>(
    initialArgs ? storeGet(...initialArgs) : { status: 'unresolved' },
  );

  watchEffect(() => {
    const { value: args } = trackedArgs;
    if (args) {
      onWatcherCleanup(store.subscribe(args[0], newKeyState => {
        keyState.value = newKeyState;
      }));
      storeGet(...args);
    }
  });

  return [
    computed(() => keyState.value),
    {
      get(params, revalidate) {
        // "get" just switches the tracked value.
        trackedArgs.value = [params, revalidate];
      },
      revalidate(params) {
        store.revalidate(params);
      },
      mutate: ((params, data, revalidate) => {
        // "mutate" performs a mutation and then switches the context.
        // @ts-expect-error We have some specific related to the mutate fn overrides.
        const mutateResult = store.mutate(params, data, revalidate);
        // We don't pass "revalidate" here as long as it was applied in the mutation, so we
        // don't need to revalidate again.
        trackedArgs.value = [params, false];
        return mutateResult;
      }) as SWRStoreMutateFn<D, P, E>,
    },
  ];
}
