/**
 * Removes sensitive part from the init data.
 * @param initData - raw init data.
 */
export function secureInitData(initData: string): string {
  const query = new URLSearchParams(initData);
  query.set('hash', '');
  return query.toString();
}

/**
 * Removes sensitive part from the init data.
 * @param launchParams - raw launch parameters.
 * @param initData - secured init data.
 */
export function secureLaunchParams(launchParams: string, initData: string): string {
  const query = new URLSearchParams(launchParams);
  query.set('tgWebAppData', initData);
  return query.toString();
}

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