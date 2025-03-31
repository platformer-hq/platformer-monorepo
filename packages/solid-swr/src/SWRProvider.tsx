// import {
//   type Accessor,
//   createContext,
//   createMemo,
//   type FlowProps,
//   getOwner,
//   type Owner,
//   type Resource,
// } from 'solid-js';
// import type {
//   DataCache,
//   ObserversCache,
//   RevalidationCache,
//   SWRStore,
// } from 'swr';
//
// export interface SWRProviderProps extends FlowProps {
//   dataCache?: DataCache<unknown>;
//   observersCache?: ObserversCache<unknown, unknown>;
//   revalidationCache?: RevalidationCache<unknown>;
// }
//
// export interface CachedResource<D extends object | string | boolean, P, E> {
//   resource: Resource<D>;
//   store: SWRStore<D, P, E>;
// }
//
// export const Context = createContext<{
//   dataCache: Accessor<DataCache<unknown>>;
//   observersCache: Accessor<ObserversCache<unknown, unknown>>;
//   owner: Owner | null;
//   resourcesCache: Record<string, CachedResource<any, unknown, unknown>>;
//   revalidationCache: Accessor<RevalidationCache<unknown>>;
// }>();
//
// export function SWRProvider(props: SWRProviderProps) {
//   return (
//     <Context.Provider
//       {...props}
//       value={{
//         owner: getOwner(),
//         resourcesCache: {},
//         revalidationCache: createMemo(() => props.revalidationCache || new Map),
//         observersCache: createMemo(() => props.observersCache || new Map),
//         dataCache: createMemo(() => props.dataCache || new Map),
//       }}
//     />
//   );
// }
export {};