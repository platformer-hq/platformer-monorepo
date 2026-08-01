export function usePlatform() {
  return extractPlatform(
    import.meta.server
      ? useRequestHeaders(['user-agent'])['user-agent'] || ''
      : navigator.userAgent,
  );
}
