import type { JSX } from 'solid-js';

/**
 * Composes handlers of the same type and returns a single event handler.
 * @param handlers - handlers to compose.
 */
export function composeHandlers<
  T,
  E extends Event,
  EHandler extends JSX.EventHandler<T, any> = JSX.EventHandler<T, E>
>(
  ...handlers: (JSX.EventHandlerUnion<T, E, EHandler> | undefined)[]
): JSX.EventHandler<T, E> {
  const filtered = handlers.filter(Boolean) as JSX.EventHandlerUnion<T, E>[];

  return e => {
    filtered.forEach(h => {
      typeof h === 'object'
        ? h[0](h[1], e)
        : h(e);
    });
  };
}