/**
 * @returns Raw launch parameters safe to be transferred across the network.
 * @param rawInitData - init data presented in a raw format.
 * @param rawLaunchParams - launch parameters presented in a raw format.
 */
export function secureRawLaunchParams(rawLaunchParams: string, rawInitData: string): string {
  // We are sanitizing the "hash" property for security purposes, so Platformer
  // could not use this init data to impersonate user. Instead, Platformer uses
  // the "signature" property allowing third parties to validate the init data.
  const initDataQuery = new URLSearchParams(rawInitData);
  initDataQuery.set('hash', '');

  const launchParamsQuery = new URLSearchParams(rawLaunchParams);
  launchParamsQuery.set('tgWebAppData', initDataQuery.toString());
  return launchParamsQuery.toString();
}
