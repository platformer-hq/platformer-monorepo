import { type Accessor, createSignal } from 'solid-js';
import { createEventListenerMap } from '@solid-primitives/event-listener';

/**
 * @return A tuple containing an accessor with true if the element is considered active,
 * and a handler that resetting this state.
 */
/*@__NO_SIDE_EFFECTS__*/
export function useActiveStateHandler(): [
  active: Accessor<boolean>,
  onPointerDown: () => void
] {
  const [$active, setActive] = createSignal(false);
  const resetActive = () => {
    setActive(false);
  };
  const onPointerDown = () => {
    setActive(true);
  };

  createEventListenerMap(document, {
    pointercancel: resetActive,
    pointerup: resetActive,
  });

  return [$active, onPointerDown];
}