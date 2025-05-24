import { createSignal } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';

export function createDebounced<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
) {
  const [$isScheduled, setIsScheduled] = createSignal(false);
  const debounced = debounce((...args: Args) => {
    fn(...args);
    setIsScheduled(false);
  }, wait);

  return [
    $isScheduled,
    (...args: Args) => {
      setIsScheduled(true);
      debounced(...args);
    },
    debounced.clear,
  ] as const;
}