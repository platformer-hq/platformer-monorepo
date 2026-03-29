export function appendLaunchParams(url: string, launchParams: string): string {
  const urlObject = new URL(url);
  const hashObj = new URLSearchParams(urlObject.hash.slice(1));
  new URLSearchParams(launchParams).forEach((value, key) => {
    hashObj.set(key, value);
  });
  urlObject.hash = '#' + hashObj.toString();
  return urlObject.toString();
}
