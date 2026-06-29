export function navigateToAppFunctionPage(options: {
  appId: number;
  fnId?: number;
}) {
  return options.fnId
    ? navigateTo({
      name: PageNames.AppFunction,
      params: { appId: options.appId, fnId: options.fnId },
    })
    : navigateTo({
      name: PageNames.CreateAppFunction,
      params: { appId: options.appId },
    });
}
