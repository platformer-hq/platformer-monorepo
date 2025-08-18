import { useRoute } from 'vue-router';

export function useAppIDFromParams(): number {
  const appID = Number(useRoute().params.appID);
  if (Number.isNaN(appID)) {
    throw new Error('Application identifier is missing or invalid');
  }
  return appID;
}
