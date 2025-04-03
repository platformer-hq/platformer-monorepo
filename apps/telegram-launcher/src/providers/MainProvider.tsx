import type { Platform } from '@telegram-apps/sdk-solid';
import { createContext, type FlowProps, useContext } from 'solid-js';
import { omitProps } from 'solid-utils';

import type { InitialColorsTuple } from '@/types/common.js';

interface ContextType {
  platform: Platform;
  initialColors: InitialColorsTuple;
  logger: Pick<Console, 'log' | 'group' | 'groupEnd'>;
}

const Context = createContext<ContextType>();

export function useMainContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Used outside context');
  }
  return context;
}

export function MainProvider(props: FlowProps<ContextType>) {
  return (
    <Context.Provider value={omitProps(props, ['children'])}>
      {props.children}
    </Context.Provider>
  );
}