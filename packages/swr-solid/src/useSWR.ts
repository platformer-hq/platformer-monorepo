import {
  createSWRStore,
  type CreateSWRStoreFetcher,
  type CreateSWRStoreKey,
  type CreateSWRStoreOptions,
  type KeyState,
  type SWRStoreMutateFn,
} from 'swr';
import { access, type MaybeAccessor } from '@solid-primitives/utils';
import { createEffect, createResource, createSignal, onCleanup, type Resource } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

export type UseSWROptionsArgs<P> =
  MaybeAccessor<[params: P, shouldRevalidate?: boolean] | undefined | null | false>;

export interface UseSWROptions<D, P, E> extends CreateSWRStoreOptions<D, E> {
  args?: UseSWROptionsArgs<P>;
  onSuccess?(data: D): void;
  onError?(error: E): void;
}

export interface UseSWRResultUtils<D, P> {
  get: (params: P, shouldRevalidate?: boolean) => void;
  mutate: SWRStoreMutateFn<D, P>;
}

export type UseSWRResult<D, P> = [Resource<D>, UseSWRResultUtils<D, P>];

export function useSWR<D extends object | string | boolean, P extends any[], E = unknown>(
  key: CreateSWRStoreKey<P>,
  fetcher: CreateSWRStoreFetcher<D, P>,
  options?: UseSWROptions<D, P, E>,
): UseSWRResult<D, P> {
  options ||= {};
  const { onSuccess, onError } = options;
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
  const [resource] = createResource($keyState, keyState => {
    return keyState.status === 'error'
      ? Promise.reject(keyState.error)
      : keyState.data;
  }, initialKeyState && initialKeyState.status === 'success' ? {
    ssrLoadFrom: 'initial',
    initialValue: initialKeyState.data,
  } : undefined);

  if (onSuccess) {
    createEffect<Resource<any>['state'] | undefined>(status => {
      status && resource.state === 'ready' && onSuccess(resource());
      return resource.state;
    });
  }

  if (onError) {
    createEffect<Resource<any>['state'] | undefined>(status => {
      status && resource.state === 'errored' && onError(resource.error);
      return resource.state;
    });
  }

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