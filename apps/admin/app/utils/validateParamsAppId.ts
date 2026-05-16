import type { RouteLocationNormalized } from '#vue-router';

export function validateParamsAppId(route: RouteLocationNormalized): boolean {
  const { params } = route;
  if (!('appId' in params)) {
    return false;
  }
  const { appId } = params;
  if (typeof appId !== 'string') {
    return false;
  }
  return !Number.isNaN(Number(appId));
}
