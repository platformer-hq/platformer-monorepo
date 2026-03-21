export function navigateToApp(appId: number) {
  return navigateTo({
    name: PageNames.App,
    query: { appId },
  });
}
