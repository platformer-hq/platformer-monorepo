/**
 * Computes fallback URl based on the URL value and raw launch parameters.
 * @param fallbackURL - base URL.
 * @param launchParams - raw launch parameters.
 */
export function computeFallbackURL(fallbackURL: string, launchParams: string): string {
  // Create a correct fallback URL.
  // As long as it may have a hash part, we should properly append launch parameters.
  const url = new URL(fallbackURL);
  let hash: string;
  if (url.hash) {
    // We should use launch params and merge them with parameters, defined in
    // the URL hash.
    const qp = new URLSearchParams(launchParams);
    new URLSearchParams(url.hash.slice(1)).forEach((v, k) => {
      qp.set(k, v);
    });
    hash = qp.toString();
  } else {
    hash = launchParams;
  }
  url.hash = `#${hash}`;

  return url.toString();
}