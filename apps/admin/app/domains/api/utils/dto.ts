import {
  AppManagementInviteRole,
  AppPrivacy,
  AppRole,
  AppUrlSimpleExplanationKind,
} from '@workspace/api/schema';

export enum LocalAppRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

export enum LocalAppPrivacy {
  Private = 'private',
  Public = 'public',
}

export enum LocalAppManagementInviteRole {
  Admin = 'admin',
  Member = 'member',
}

export enum LocalAppSimpleExplanationKind {
  AccessNotAllowed = 'access-not-allowed',
  AppIsPublic = 'app-is-public',
  UserIsManager = 'user-is-manager',
}

export function apiAppRoleToLocal(role: AppRole): LocalAppRole {
  return ({
    [AppRole.Admin]: LocalAppRole.Admin,
    [AppRole.Member]: LocalAppRole.Member,
    [AppRole.Owner]: LocalAppRole.Owner,
  } as const)[role];
}

export function localAppPrivacyToApi(privacy: LocalAppPrivacy): AppPrivacy {
  return ({
    [LocalAppPrivacy.Private]: AppPrivacy.Hidden,
    [LocalAppPrivacy.Public]: AppPrivacy.Visible,
  } as const)[privacy];
}

export function apiAppPrivacyToLocal(privacy: AppPrivacy): LocalAppPrivacy {
  return ({
    [AppPrivacy.Hidden]: LocalAppPrivacy.Private,
    [AppPrivacy.Visible]: LocalAppPrivacy.Public,
  } as const)[privacy];
}

export function apiAppManagementInviteRoleToLocal(
  role: AppManagementInviteRole,
): LocalAppManagementInviteRole {
  return ({
    [AppManagementInviteRole.Admin]: LocalAppManagementInviteRole.Admin,
    [AppManagementInviteRole.Member]: LocalAppManagementInviteRole.Member,
  } as const)[role];
}

export function localAppManagementInviteRoleToApi(
  role: LocalAppManagementInviteRole,
): AppManagementInviteRole {
  return ({
    [LocalAppManagementInviteRole.Admin]: AppManagementInviteRole.Admin,
    [LocalAppManagementInviteRole.Member]: AppManagementInviteRole.Member,
  } as const)[role];
}

export function apiAppSimpleExpKindToLocal(
  value: AppUrlSimpleExplanationKind,
): LocalAppSimpleExplanationKind {
  return ({
    [AppUrlSimpleExplanationKind.AccessNotAllowed]: LocalAppSimpleExplanationKind.AccessNotAllowed,
    [AppUrlSimpleExplanationKind.AppIsPublic]: LocalAppSimpleExplanationKind.AppIsPublic,
    [AppUrlSimpleExplanationKind.UserIsManager]: LocalAppSimpleExplanationKind.UserIsManager,
  } as const)[value];
}
