export function appendLaunchParams(
  url: string,
  launchParams: string,
  appendToQuery: boolean,
): string {
  const urlObject = new URL(url);
  const launchParamsEntries = [...new URLSearchParams(launchParams).entries()];

  if (appendToQuery) {
    launchParamsEntries.forEach(([key, value]) => {
      urlObject.searchParams.set(key, value);
    });
  } else {
    const hashObj = new URLSearchParams(urlObject.hash.slice(1));
    launchParamsEntries.forEach(([key, value]) => {
      hashObj.set(key, value);
    });
    urlObject.hash = '#' + hashObj.toString();
  }
  return urlObject.toString();
}
