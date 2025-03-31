import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreKey,
  type CreateSWRStoreOptions,
  type KeyState,
  type SWRStoreMutateFn,
} from 'swr';
import {
  access,
  createExecutionResource,
  type MaybeAccessor,
  type ExecutionResource,
} from 'solid-utils';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

export type UseSWROptionsArgs<P> =
  MaybeAccessor<[params: P, shouldRevalidate?: boolean] | undefined | null | false>;

export interface UseSWROptions<D, P, E> extends CreateSWRStoreOptions<D, E> {
  args?: UseSWROptionsArgs<P>;
  /**
   * Hook being called whenever any error occurred.
   * @param error - occurred error.
   */
  onErrored?: (error: E) => void;
  /**
   * Hook being called whenever the resource is ready. The difference with the `onSuccess` hook
   * is `onSuccess` is only called when any request was performed.
   * @param data - retrieved data.
   * @param cached - true if the retrieved data is considered as cached.
   */
  onReady?: (data: D, cached: boolean) => void;
}

export interface UseSWRResultUtils<D, P> {
  get: (params: P, shouldRevalidate?: boolean) => void;
  mutate: SWRStoreMutateFn<D, P>;
}

export type UseSWRResult<D, P, E> = [ExecutionResource<D, E>, UseSWRResultUtils<D, P>];

export function useSWR<D extends object | string | boolean, P extends any[], E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWROptions<D, P, E>,
): UseSWRResult<D, P, E> {
  options ||= {};
  const { onReady, onErrored } = options;
  const store = createSWRStore<D, P, E>(key, fetcher, options);

  const [$args, setArgs] = createWritableMemo(() => access(options.args));
  const initialArgs = $args();
  const [$keyState, setKeyState] = createSignal<KeyState<D, E> | undefined>(
    initialArgs ? store.get(...initialArgs) : undefined,
  );

  let canSetState = !initialArgs;
  createEffect(() => {
    const args = $args();
    if (args) {
      canSetState && setKeyState(store.get(...args));
      onCleanup(store.subscribe(args[0], setKeyState));
    }
  });

  createEffect(() => {
    canSetState = true;
  });

  const initialKeyState = $keyState();
  let hasCachedData = !!(initialKeyState && initialKeyState.status === 'success');
  const [resource] = createExecutionResource<D, E, KeyState<D, E>>(
    $keyState,
    keyState => {
      if (keyState.status === 'error') {
        return [false, keyState.error];
      }
      const { data } = keyState;
      return data instanceof Promise
        ? data.then(r => [true, r], e => [false, e])
        : [true, data];
    },
    {
      ...initialKeyState && initialKeyState.status === 'success' ? {
        ssrLoadFrom: 'initial',
        initialValue: initialKeyState.data,
      } : undefined,
      onErrored,
      onReady: onReady ? data => {
        onReady(data, hasCachedData);
        hasCachedData = false;
      } : undefined,
    },
  );

  return [resource, {
    get(params, shouldRevalidate) {
      // "get" just switches the hooks arguments context.
      setArgs([params, shouldRevalidate]);
    },
    mutate(params, data, shouldRevalidate) {
      // "mutate" performs a mutation and then switches the context.
      store.mutate(params, data, shouldRevalidate);
      // We don't pass shouldRevalidate here as long as it will be applied in the mutation, so
      // we don't need to revalidate.
      setArgs([params, false]);
    },
  }];
}