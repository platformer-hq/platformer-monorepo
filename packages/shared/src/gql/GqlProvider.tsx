import { createContext, useContext } from 'solid-js';
import { pickProps } from 'solid-utils';
import {
  GqlProvider as SolidGqlProvider,
  type GqlProviderProps as SolidGqlProviderProps
} from 'solid-gql';

const Context = createContext<{
  endpoint: string;
  authToken?: string;
}>();

export function useGqlContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Used outside provider');
  }
  return context;
}

export interface GqlProviderProps extends SolidGqlProviderProps {
  endpoint: string;
  authToken?: string;
}

export function GqlProvider(props: GqlProviderProps) {
  return (
    <Context.Provider value={pickProps(props, ['endpoint', 'authToken'])}>
      <SolidGqlProvider
        {...pickProps(props, ['revalidationCache', 'dataCache', 'observersCache', 'children'])}
      />
    </Context.Provider>
  );
}