import { createContext, type FlowProps, mergeProps, useContext } from 'solid-js';
import { pickProps } from 'solid-utils';
import type { DataCache, ObserversCache, RevalidationCache } from 'solid-swr';

export interface GqlContextType {
  dataCache: DataCache<unknown>;
  revalidationCache: RevalidationCache<unknown>;
  observersCache: ObserversCache<unknown, unknown>;
}

export type GqlProviderProps = FlowProps<Partial<GqlContextType>>;

const Context = createContext<GqlContextType>({
  dataCache: new Map,
  revalidationCache: new Map,
  observersCache: new Map,
});

export function useGqlContext() {
  return useContext(Context);
}

export function GqlProvider(props: GqlProviderProps) {
  return (
    <Context.Provider
      value={mergeProps({
        dataCache: new Map(),
        revalidationCache: new Map(),
        observersCache: new Map(),
      }, pickProps(props, ['dataCache', 'revalidationCache', 'observersCache']))}
    >
      {props.children}
    </Context.Provider>
  );
}