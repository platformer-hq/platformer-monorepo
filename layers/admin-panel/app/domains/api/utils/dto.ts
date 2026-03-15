import { AppManagementInviteRole, AppPrivacy, AppRole, AppUrlSimpleExplanationKind } from '#layers/api/schema';

export type LocalAppRole = 'owner' | 'admin' | 'member';
export type LocalAppManagementInviteRole = 'admin' | 'member';
export type LocalAppPrivacy = 'private' | 'public';
export type LocalAppSimpleExplanationKind =
  | 'access-not-allowed'
  | 'app-is-public'
  | 'user-is-manager';

export function apiAppRoleToLocal(role: AppRole): LocalAppRole {
  return ({
    [AppRole.Admin]: 'admin',
    [AppRole.Member]: 'member',
    [AppRole.Owner]: 'owner',
  } as const)[role];
}

export function localAppPrivacyToApi(privacy: LocalAppPrivacy): AppPrivacy {
  return ({
    private: AppPrivacy.Hidden,
    public: AppPrivacy.Visible,
  } as const)[privacy];
}

export function apiAppPrivacyToLocal(privacy: AppPrivacy): LocalAppPrivacy {
  return ({
    [AppPrivacy.Hidden]: 'private',
    [AppPrivacy.Visible]: 'public',
  } as const)[privacy];
}

export function apiAppManagementInviteRoleToLocal(
  role: AppManagementInviteRole,
): LocalAppManagementInviteRole {
  return ({
    [AppManagementInviteRole.Admin]: 'admin',
    [AppManagementInviteRole.Member]: 'member',
  } as const)[role];
}

export function localAppManagementInviteRoleToApi(
  role: LocalAppManagementInviteRole,
): AppManagementInviteRole {
  return ({
    admin: AppManagementInviteRole.Admin,
    member: AppManagementInviteRole.Member,
  } as const)[role];
}

export function apiAppSimpleExpKindToLocal(
  value: AppUrlSimpleExplanationKind,
): LocalAppSimpleExplanationKind {
  return ({
    [AppUrlSimpleExplanationKind.AccessNotAllowed]: 'access-not-allowed',
    [AppUrlSimpleExplanationKind.AppIsPublic]: 'app-is-public',
    [AppUrlSimpleExplanationKind.UserIsManager]: 'user-is-manager',
  } as const)[value];
}
