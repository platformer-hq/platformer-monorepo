import { type JSXElement, Show } from 'solid-js';

import { withConfig, WithOptionalConfig } from '@/providers/ConfigProvider.js';
import type { Platform } from '@/types/known.js';

export interface SwitchPlatformProps extends Partial<Record<Platform, JSXElement>>, WithOptionalConfig {
}

/**
 * Displays a component depending on the current platform.
 */
export const SwitchPlatform = withConfig((props: SwitchPlatformProps) => (
  <Show when={props.platform === 'ios'} fallback={props.android}>
    {props.ios}
  </Show>
));