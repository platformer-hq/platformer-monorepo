export function preloadAppFunctionPage(options: {
  appId: number;
  fnId?: number;
}) {
  return options.fnId
    ? preloadRouteComponents({
      name: PageNames.AppFunction,
      params: {
        appId: options.appId,
        fnId: options.fnId,
      },
    })
    : preloadRouteComponents({
      name: PageNames.CreateAppFunction,
      params: { appId: options.appId },
    });
}
