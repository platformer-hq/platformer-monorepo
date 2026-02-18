import { AppManagementInviteRole, AppRole } from 'schema';

export function appRoleInvitableToStatic(role: AppManagementInviteRole): AppRole {
  return ({
    [AppManagementInviteRole.Admin]: AppRole.Admin,
    [AppManagementInviteRole.Member]: AppRole.Member,
  } as Partial<Record<AppManagementInviteRole, AppRole>>)[role] || AppRole.Admin;
}

export function appRoleToInvitable(role: AppRole): AppManagementInviteRole {
  return ({
    [AppRole.Admin]: AppManagementInviteRole.Admin,
    [AppRole.Member]: AppManagementInviteRole.Member,
  } as Partial<Record<AppRole, AppManagementInviteRole>>)[role] || AppManagementInviteRole.Admin;
}
