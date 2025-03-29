import {
  type Component,
  createContext,
  type FlowProps,
  mergeProps,
  useContext,
} from 'solid-js';

import { pickProps } from '@/helpers/pickProps.js';
import type { ColorScheme, Platform } from '@/types/known.js';
import type { PartialBy } from '@/types/utils.js';

export interface ConfigContextType {
  /**
   * Current color scheme. This value is reactive.
   */
  colorScheme: ColorScheme;
  /**
   * Identifier of the current platform. This value is reactive.
   */
  platform: Platform;
}

export type ConfigProviderProps = FlowProps<ConfigContextType>;
export type WithOptionalConfig = Partial<ConfigContextType>;

const ConfigContext = createContext<ConfigContextType>();

/**
 * @returns Application config context value.
 */
export function useConfig(): ConfigContextType {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig was used outside its context');
  }
  return ctx;
}

/**
 * HOC, which passes the current configuration to the wrapped components.
 * @param Component - component to wrap.
 */
export function withConfig<Props extends WithOptionalConfig>(
  Component: Component<Props>
): Component<PartialBy<Props, keyof ConfigContextType>> {
  return props => {
    return <Component {...mergeProps(useConfig(), props) as Props}/>;
  }
}

/**
 * Component which provides configuration information for all packages' components.
 */
export function ConfigProvider(props: ConfigProviderProps) {
  return (
    <ConfigContext.Provider
      {...props}
      value={pickProps(props, ['colorScheme', 'platform'])}
    />
  );
}
