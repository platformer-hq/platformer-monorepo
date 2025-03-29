import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { TimeoutError } from 'better-promises';

/**
 * Creates a new self-cleaning-up abort signal.
 * @param timeout - timeout duration
 */
export function createTimeoutSignal(timeout: number | Accessor<number>): Accessor<AbortSignal> {
  const [$controller, setController] = createSignal(new AbortController());

  createEffect(() => {
    const ms = typeof timeout === 'function' ? timeout() : timeout;
    const controller = $controller();
    const timeoutID = setTimeout(() => {
      controller.abort(new TimeoutError(ms));
    }, ms);

    onCleanup(() => {
      clearTimeout(timeoutID);
      setController(new AbortController());
    });
  });

  return () => $controller().signal;
}