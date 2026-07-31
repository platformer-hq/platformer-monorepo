import type { KnownCssColorToken } from '../generated';

export function cssColorTokenReference<T extends KnownCssColorToken>(color: T): string {
  return `var(--${color})`;
}
