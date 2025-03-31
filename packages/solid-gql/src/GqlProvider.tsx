import { createContext, type FlowProps, mergeProps, useContext } from 'solid-js';
import type { DataCache, ObserversCache, RevalidationCache } from 'solid-swr';

export interface GqlContextType {
  dataCache: DataCache<unknown>;
  revalidationCache: RevalidationCache<unknown>;
  observersCache: ObserversCache<unknown, unknown>;
}

const Context = createContext<GqlContextType>({
  dataCache: new Map,
  revalidationCache: new Map,
  observersCache: new Map,
});

export function useGqlContext() {
  return useContext(Context);
}

export function GqlProvider(props: FlowProps<Partial<GqlContextType>>) {
  return (
    <Context.Provider
      value={mergeProps({
        dataCache: new Map(),
        revalidationCache: new Map(),
        observersCache: new Map(),
      }, props)}
    >
      {props.children}
    </Context.Provider>
  );
}