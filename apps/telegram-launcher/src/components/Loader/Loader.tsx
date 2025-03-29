import { For, Show } from 'solid-js';
import type { Platform } from '@telegram-apps/sdk-solid';

import './Loader.scss';

/**
 * Loading indicator.
 */
export function Loader(props: { platform?: Platform }) {
  const platform = () => {
    return ['ios', 'macos'].includes(props.platform || '') ? 'ios' : 'base';
  };

  return (
    <div class={`loader loader--${platform()}`}>
      <Show
        when={platform() === 'ios'}
        fallback={
          <svg class="loader__base-root">
            <circle
              cx="50%"
              cy="50%"
              r="50%"
              stroke-linecap="round"
              stroke="currentcolor"
            />
          </svg>
        }
      >
        <For each={new Array(8).fill(null)}>
          {(_item, index) => (
            <div
              class="loader__ios-line"
              style={{
                'animation-delay': `${100 * index()}ms`,
                transform: `rotate(${45 * index()}deg) translate3d(0, -115%, 0)`,
              }}
            />
          )}
        </For>
      </Show>
    </div>
  );
}