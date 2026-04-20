export function usePlatform() {
  let ua: string;

  if (import.meta.server) {
    const headers = useRequestHeaders(['user-agent']);
    ua = headers['user-agent'] || '';
  } else {
    ua = navigator.userAgent;
  }
  return /Macintosh|Mac OS X|MacIntel|iPad|iPhone|iPod/.test(ua) ? 'ios' : 'android';
}
