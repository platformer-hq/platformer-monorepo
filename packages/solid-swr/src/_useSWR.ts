// import {
//   createSWRStore,
//   CreateSWRStoreFetcher,
//   CreateSWRStoreKey,
//   CreateSWRStoreOptions, KeyState, SWRStoreKeyValue,
//   SWRStoreMutateFn,
// } from 'swr';
//
// import {
//   CachedResource, Context,
//   useSWRContext,
// } from './SWRProvider.js';
// import { access, MaybeAccessor } from '@solid-primitives/utils';
// import {
//   Accessor,
//   createEffect, createResource,
//   createSignal,
//   onCleanup,
//   Owner,
//   Resource,
//   runWithOwner, useContext,
// } from 'solid-js';
// import { D } from 'vitest/dist/chunks/reporters.D7Jzd9GS.js';
// import { createWritableMemo } from '@solid-primitives/memo';
//
// export type _UseSWRKey<P extends any[]> = CreateSWRStoreKey<P>;
// export type _UseSWRFetcher<D, P extends any[]> = CreateSWRStoreFetcher<D, P>;
// export type _UseSWROptionsParams<P> =
//   MaybeAccessor<[params: P, shouldRevalidate?: boolean] | undefined | null | false>;
// export interface _UseSWROptions<D, P, E> extends Omit<
//   CreateSWRStoreOptions<D, E>,
//   'dataCache' | 'revalidationCache' | 'observersCache' | 'logger'
// > {
//   params?: _UseSWROptionsParams<P>;
//   onSuccess?(data: D): void;
//   onError?(error: E): void;
// }
// export interface _UseSWRResultUtils<D, P> {
//   get: (params: P, shouldRevalidate?: boolean) => void;
//   mutate: SWRStoreMutateFn<D, P>;
// }
// export type _UseSWRResult<D, P> = [Accessor<Resource<D>>, _UseSWRResultUtils<D, P>];
//
// function computeKey<P extends any[]>(
//   key: _UseSWRKey<P>,
//   params: _UseSWROptionsParams<P>,
// ): string | undefined {
//   let keyValue: SWRStoreKeyValue | undefined;
//
//   if (typeof key === 'function') {
//     const p = access(params);
//     p && (keyValue = key(...p[0]));
//   } else {
//     keyValue = key;
//   }
//   return keyValue
//     ? Array.isArray(keyValue) ? keyValue.join(',') : key.toString()
//     : undefined;
// }
//
// function instantiateResource<D extends object | string | boolean, P extends [], E = unknown>(
//   owner: Owner | null,
//   key: _UseSWRKey<P>,
//   fetcher: _UseSWRFetcher<D, P>,
//   options?: _UseSWROptions<D, P, E>,
// ): CachedResource<D, P, E> {
//   return runWithOwner(owner, () => {
//     const store = createSWRStore<D, P, E>(key, fetcher, options);
//
//     const [$args, setArgs] = createWritableMemo(() => access(options.params));
//     const initialArgs = $args();
//     let canCallMethods = !initialArgs;
//     const [$currentValue, setCurrentValue] = createSignal<KeyState<D, E> | undefined>(
//       initialArgs ? store.get(...initialArgs) : undefined,
//     );
//
//     createEffect(() => {
//       const params = $args();
//       if (params) {
//         canCallMethods && setCurrentValue(store.get(...params));
//         onCleanup(store.subscribe(params[0], setCurrentValue));
//       }
//     });
//
//     createEffect(() => {
//       !canCallMethods && (canCallMethods = true);
//     });
//
//     const [$resource] = createResource(() => $currentValue(), currentValue => {
//       return currentValue.status === 'error'
//         ? Promise.reject(currentValue.error)
//         : currentValue.data;
//     });
//
//     const result: _UseSWRResult<D, P> = [$resource, {
//       get(params, shouldRevalidate) {
//         // "get" just switches the hooks arguments context.
//         setArgs([params, shouldRevalidate]);
//       },
//       mutate(params, data, shouldRevalidate) {
//         // "mutate" performs a mutation and then switches the context.
//         store.mutateData(params, data, shouldRevalidate);
//         // We don't pass shouldRevalidate here as long as it will be applied in the
//         // mutation, so we don't need to revalidate.
//         setArgs([params, false]);
//       },
//     }];
//     cac;
//   });
// }
//
// export function _useSWR<D extends object | string | boolean, P extends [], E = unknown>(
//   key: _UseSWRKey<P>,
//   fetcher: _UseSWRFetcher<D, P>,
//   options?: _UseSWROptions<D, P, E>,
// ): _UseSWRResult<D, P> {
//   options ||= {};
//   const context = useContext(Context);
//   if (!context) {
//     throw new Error('Used outside context');
//   }
//
//   const { dataCache, observersCache, revalidationCache, owner, resourcesCache } = context;
//
//   const computedKey = computeKey(key, options.params);
//   const { resource, store } = (
//     computedKey
//       ? resourcesCache[computedKey] as CachedResource<D, P, E> | undefined
//       : undefined
//   ) || instantiateResource(owner, key, fetcher, options);
//
//   return useSWRContext().resourceFor(key, fetcher, options);
// }
export {};