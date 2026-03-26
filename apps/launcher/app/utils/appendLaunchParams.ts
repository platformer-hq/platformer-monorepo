export function appendLaunchParams(url: string, launchParams: string): string {
  const urlObject = new URL(url);
  new URLSearchParams(launchParams).forEach((value, key) => {
    urlObject.searchParams.set(key, value);
  });
  return urlObject.toString();
}
