export function appendLaunchParams(url: string, launchParams: string): string {
  const urlObject = new URL(url);
  const hashParams = new URLSearchParams(urlObject.hash.slice(1));
  new URLSearchParams(launchParams).forEach((value, key) => {
    hashParams.set(key, value);
  });
  urlObject.hash = '#' + hashParams.toString();
  return urlObject.toString();
}
