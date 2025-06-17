import { type Computed } from '@mini-apps/signals';
import { type MethodName, supports } from '@mini-apps/telegram-bridge';

import { version } from '@/globals.js';
import { createComputed } from '@/signals-registry.js';

/**
 * @returns A signal indicating if the specified Mini Apps method is supported.
 * @param method - Mini Apps method name
 */
export function createIsSupported(method: MethodName): Computed<boolean> {
  return createComputed(() => supports(method, version()));
}