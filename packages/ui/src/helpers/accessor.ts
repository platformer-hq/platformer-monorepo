import type { Accessor } from 'solid-js';
import { type MaybeAccessor, access } from '@solid-primitives/utils';

/**
 * @return A function to retrieve a value from the specified value.
 * @param v
 * @param key
 */
export function accessor<T extends object, K extends keyof T>(
  v: MaybeAccessor<T>,
  key: K,
): Accessor<T[K]> {
  return () => access(v)[key];
}
