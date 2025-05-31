import type { Platform } from '@telegram-apps/sdk-solid';
import { createContext, type FlowProps, useContext } from 'solid-js';
import { omitProps } from 'solid-utils';
import { access } from '@solid-primitives/utils';
import { type BaseRecordDict, translator, resolveTemplate } from '@solid-primitives/i18n';

import { InitialColorsTuple, Locale, type Logger } from '@/types/common.js';

interface ContextType {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
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

export function useTranslator<T extends Record<Locale, BaseRecordDict>>(dict: T | (() => T)) {
  const { locale } = useMainContext();
  return translator<T[Locale]>(() => access(dict)[locale], resolveTemplate);
}

export function useLogger() {
  return useMainContext().logger;
}

export function MainProvider(props: FlowProps<ContextType>) {
  return (
    <Context.Provider value={omitProps(props, ['children'])}>
      {props.children}
    </Context.Provider>
  );
}