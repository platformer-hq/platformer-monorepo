import type { Platform } from '@telegram-apps/sdk-solid';
import { createContext, type FlowProps, useContext } from 'solid-js';
import { omitProps } from 'solid-utils';

import { InitialColorsTuple, Locale } from '@/types/common.js';

interface ContextType {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Pick<Console, 'log' | 'group' | 'groupEnd'>;
  platform: Platform;
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