import { createContext, type FlowProps, mergeProps, useContext } from 'solid-js';
import { pickProps } from 'solid-utils';
import type { DataCache, ObserversCache, RevalidationCache } from 'swr-solid';

const Context = createContext<{
  endpoint: string;
  authToken?: string;
  dataCache: DataCache<unknown>;
  revalidationCache: RevalidationCache<unknown>;
  observersCache: ObserversCache<unknown, unknown>;
}>();

export function useGqlContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Used outside provider');
  }
  return context;
}

export function GqlProvider(props: FlowProps<{ endpoint: string; authToken?: string }>) {
  return (
    <Context.Provider
      {...props}
      value={mergeProps(pickProps(props, 'endpoint', 'authToken'), {
        dataCache: new Map(),
        revalidationCache: new Map(),
        observersCache: new Map(),
      })}
    />
  );
}