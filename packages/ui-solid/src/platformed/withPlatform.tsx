import { Component, mergeProps } from 'solid-js';

import type { Platform } from '@/types/known.js';
import type { PartialBy } from '@/types/utils.js';
import { useConfig } from '@/providers/ConfigProvider.js';
import { pickProps } from '@/helpers/pickProps.js';

interface WithOptionalPlatform {
  /**
   * Identifier of the current platform. This value is reactive.
   */
  platform?: Platform;
}

/**
 * HOC, which passes the current platform to the wrapped component.
 * @param Component - component to wrap.
 */
export function withPlatform<Props extends WithOptionalPlatform>(
  Component: Component<Props>,
): Component<PartialBy<Props, keyof WithOptionalPlatform>> {
  return props => {
    return <Component {...mergeProps(pickProps(useConfig(), ['platform']), props) as Props}/>;
  };
}