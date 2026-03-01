import type { KnownLocale } from '../types';

export function isKnownLocale(value: unknown): value is KnownLocale {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ['en', 'ru'].includes(value as any);
}
