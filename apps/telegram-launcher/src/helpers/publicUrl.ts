/**
 * @returns A complete public URL prefixed with the public static assets base
 * path.
 * @param path - path to prepend prefix to
 */
export function publicUrl(path: string): string {
  const baseURL = new URL(import.meta.env.BASE_URL, window.location.origin);

  return new URL(path.replace(/^\/+/, ''), baseURL).toString();
}