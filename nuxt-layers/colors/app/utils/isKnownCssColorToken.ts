import { type KnownCssColorToken, knownCssColorTokensSet } from '../generated';

export function isKnownCssColorToken(value: unknown): value is KnownCssColorToken {
  return typeof value === 'string' && knownCssColorTokensSet.has(value as KnownCssColorToken);
}
