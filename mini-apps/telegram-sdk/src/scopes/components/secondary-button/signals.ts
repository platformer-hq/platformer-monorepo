import type { Computed } from '@mini-apps/signals';

import { buttonColor } from '@/scopes/components/theme-params/signals.js';
import { bottomBarColorRGB } from '@/scopes/components/mini-app/signals.js';
import { createComputed, createSignal, createSignalsTuple } from '@/signals-registry.js';

import type { State } from './types.js';

function fromState<K extends keyof Required<State>>(key: K): Computed<Required<State>[K]> {
  return createComputed(() => state()[key]);
}

export const internalState = createSignal<State>({
  hasShineEffect: false,
  isEnabled: true,
  isLoaderVisible: false,
  isVisible: false,
  position: 'left',
  text: 'Cancel',
});

/**
 * Complete component state.
 */
export const state = createComputed<Required<State>>(() => {
  const s = internalState();
  return {
    ...s,
    backgroundColor: s.backgroundColor || bottomBarColorRGB() || '#000000',
    textColor: s.textColor || buttonColor() || '#2481cc',
  };
});

/**
 * True if the component is currently mounted.
 */
export const [_isMounted, isMounted] = createSignalsTuple(false);

/**
 * @see State.backgroundColor
 */
export const backgroundColor = fromState('backgroundColor');

/**
 * @see State.hasShineEffect
 */
export const hasShineEffect = fromState('hasShineEffect');

/**
 * @see State.isEnabled
 */
export const isEnabled = fromState('isEnabled');

/**
 * @see State.isLoaderVisible
 */
export const isLoaderVisible = fromState('isLoaderVisible');

/**
 * @see State.isVisible
 */
export const isVisible = fromState('isVisible');

/**
 * @see State.position
 */
export const position = fromState('position');

/**
 * @see State.text
 */
export const text = fromState('text');

/**
 * @see State.textColor
 */
export const textColor = fromState('textColor');
