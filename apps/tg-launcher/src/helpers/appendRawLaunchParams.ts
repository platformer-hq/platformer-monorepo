/**
 * Appends raw launch parameters to the specified URL.
 * @param url - url to append launch params to.
 * @param rawLaunchParams - launch parameters in a raw format.
 */
export function appendRawLaunchParams(url: string, rawLaunchParams: string): string {
  const urlObject = new URL(url);
  const hashParams = new URLSearchParams(urlObject.hash.slice(1));
  new URLSearchParams(rawLaunchParams).forEach((value, key) => {
    hashParams.set(key, value);
  });
  urlObject.hash = '#' + hashParams.toString();
  return urlObject.toString();
}