import type { KnownPlatform } from '~ui-kit/types';

export function extractPlatform(userAgent: string): KnownPlatform {
  return /Macintosh|Mac OS X|MacIntel|iPad|iPhone|iPod/.test(userAgent) ? 'ios' : 'android';
}
