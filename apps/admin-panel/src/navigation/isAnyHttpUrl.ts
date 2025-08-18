/**
 * @returns True if the passed value is a valid URL having "http" or "https" protocol.
 * @param url - URL to check.
 */
export function isAnyHttpUrl(url: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}
