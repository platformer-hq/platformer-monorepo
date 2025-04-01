import type { Platform } from '@telegram-apps/sdk-solid';
import { createContext, type FlowProps, useContext } from 'solid-js';
import { pickProps } from 'solid-utils';

const Context = createContext<{
  platform: Platform;
}>();

export function useMainContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Used outside context');
  }
  return context;
}

export function MainProvider(props: FlowProps<{ platform: Platform }>) {
  return (
    <Context.Provider value={pickProps(props, ['platform'])}>
      {props.children}
    </Context.Provider>
  );
}