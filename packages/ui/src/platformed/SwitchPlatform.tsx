import { type FlowProps, type JSXElement, Match, Switch } from 'solid-js';

import { withPlatform } from '@/platformed/withPlatform.js';
import type { Platform } from '@/types/known.js';

export interface SwitchPlatformProps extends FlowProps {
  platform?: Platform;
  ios?: JSXElement;
  android?: JSXElement;
}

/**
 * Component which allows displaying a specific JSX element based on the current
 * platform.
 */
export const SwitchPlatform = withPlatform(
  (props: SwitchPlatformProps) => {
    const platform = () => props.platform;
    return (
      <Switch>
        <Match when={platform() === 'ios'}>
          {props.ios}
        </Match>
        <Match when={platform() === 'android'}>
          {props.android}
        </Match>
      </Switch>
    );
  },
);