import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { TimeoutError } from 'better-promises';
import { type MaybeAccessor, access } from '@solid-primitives/utils';

/**
 * Creates a new self-cleaning-up abort signal.
 * @param timeout - timeout duration
 */
export function createTimeoutSignal(timeout: MaybeAccessor<number>): Accessor<AbortSignal> {
  const [$controller, setController] = createSignal(new AbortController());

  createEffect(() => {
    const ms = access(timeout);
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