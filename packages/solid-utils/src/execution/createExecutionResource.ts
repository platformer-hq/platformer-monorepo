import {
  createEffect,
  createResource,
  type InitializedResourceOptions,
  type NoInfer,
  type ResourceFetcher,
  type ResourceOptions,
  type ResourceSource,
  type ResourceActions,
} from 'solid-js';

import type { ExecutionTuple } from './types.js';

export interface ExecutionResourceHooks<D, E> {
  onReady?: (data: D) => void;
  onErrored?: (error: E) => void;
}

interface Unresolved {
  state: 'unresolved';
  loading: false;
  error: undefined;
  latest: undefined;
  (): undefined;
}

interface Pending {
  state: 'pending';
  loading: true;
  error: undefined;
  latest: undefined;
  (): undefined;
}

interface Ready<T> {
  state: 'ready';
  loading: false;
  error: undefined;
  latest: T;
  (): T;
}

interface Refreshing<T> {
  state: 'refreshing';
  loading: true;
  error: undefined;
  latest: T;
  (): T;
}

interface Errored<T> {
  state: 'errored';
  loading: false;
  error: T;
  latest: never;
  (): never;
}

export type ExecutionResource<D, E> = Unresolved | Pending | Ready<D> | Refreshing<D> | Errored<E>;
export type ExecutionResourceReturn<D, E, R = unknown> = [ExecutionResource<D, E>, ResourceActions<D | undefined, R>];

type InitializedResource<D, E> = Ready<D> | Refreshing<D> | Errored<E>;
type InitializedResourceReturn<D, E, R = unknown> = [
  InitializedResource<D, E>,
  ResourceActions<D, R>
];

export function createExecutionResource<D, E, R = unknown>(
  fetcher: ResourceFetcher<true, ExecutionTuple<D, E>, R>,
  options?: ResourceOptions<NoInfer<D>, true> & ExecutionResourceHooks<D, E>,
): ExecutionResourceReturn<D, E, R>;

export function createExecutionResource<D, E, R = unknown>(
  fetcher: ResourceFetcher<true, ExecutionTuple<D, E>, R>,
  options: InitializedResourceOptions<NoInfer<D>, true> & ExecutionResourceHooks<D, E>,
): InitializedResourceReturn<D, E, R>;

export function createExecutionResource<D, E, S, R = unknown>(
  source: ResourceSource<S>,
  fetcher: ResourceFetcher<S, ExecutionTuple<D, E>, R>,
  options: InitializedResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>,
): InitializedResourceReturn<D, E, R>;

export function createExecutionResource<D, E, S, R = unknown>(
  source: ResourceSource<S>,
  fetcher: ResourceFetcher<S, ExecutionTuple<D, E>, R>,
  options?: ResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>,
): ExecutionResourceReturn<D, E, R>;

export function createExecutionResource<D, E, S, R = unknown>(
  arg1: ResourceFetcher<true, ExecutionTuple<D, E>, R> | ResourceSource<S>,
  arg2?:
    | (ResourceOptions<NoInfer<D>, true> & ExecutionResourceHooks<D, E>)
    | (InitializedResourceOptions<NoInfer<D>, true> & ExecutionResourceHooks<D, E>)
    | ResourceFetcher<S, ExecutionTuple<D, E>, R>,
  arg3?: ResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>,
): ExecutionResourceReturn<D, E, R> | InitializedResourceReturn<D, E, R> {
  let source: ResourceSource<S> | undefined;
  let fetcher: any;
  let options: ResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>;
  if (typeof arg2 === 'object' || !arg2) {
    [fetcher, options] = [
      arg1,
      arg2 as ResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>,
    ];
  } else {
    [source, fetcher, options] = [
      arg1 as ResourceSource<S>,
      arg2,
      arg3 as ResourceOptions<NoInfer<D>, S> & ExecutionResourceHooks<D, E>,
    ];
  }

  const wrappedFetcher = async (...args: Parameters<typeof fetcher>) => {
    const tuple = await fetcher(...args);
    if (tuple[0]) {
      return tuple[1];
    }
    throw tuple[1];
  };

  const [resource, actions] = createResource(
    source || wrappedFetcher as any,
    wrappedFetcher || options,
    options,
  );

  const { onErrored, onReady } = options || {};
  createEffect(() => {
    onReady && resource.state === 'ready' && onReady(resource());
    onErrored && resource.state === 'errored' && onErrored(resource.error.cause);
  });

  return [resource, actions];
}