import { AppPrivacy, AppRole } from '#layers/api/schema';

export type LocalRole = 'owner' | 'admin' | 'member';
export type LocalPrivacy = 'private' | 'public';

export function apiAppRoleToLocal(role: AppRole): LocalRole {
  return ({
    [AppRole.Admin]: 'admin',
    [AppRole.Member]: 'member',
    [AppRole.Owner]: 'owner',
  } as const)[role];
}

export function localAppPrivacyToApi(privacy: LocalPrivacy): AppPrivacy {
  return ({
    private: AppPrivacy.Hidden,
    public: AppPrivacy.Visible,
  } as const)[privacy];
}

export function apiAppPrivacyToLocal(privacy: AppPrivacy): LocalPrivacy {
  return ({
    [AppPrivacy.Hidden]: 'private',
    [AppPrivacy.Visible]: 'public',
  } as const)[privacy];
}
