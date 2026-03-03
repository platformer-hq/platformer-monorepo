export function navigateToApp(appId: number) {
  return navigateTo({
    name: PAGE_NAME_APP,
    query: { appId },
  });
}
