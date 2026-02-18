import type { KnownLocale } from '../types.js';

/**
 * @returns True if the value is a known locale.
 * @param v - value to check.
 */
export function isKnownLocale(v: string): v is KnownLocale {
  return ['ru', 'en'].includes(v);
}
