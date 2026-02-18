/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppManagersViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppManagersViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, managers: Array<{ __typename?: 'AppManager', role: Types.AppRole, user: { __typename?: 'User', id: number, name: string } }>, managementInvites: Array<{ __typename?: 'AppManagementInvite', id: number, role: Types.AppManagementInviteRole, from: { __typename?: 'User', name: string }, to: { __typename?: 'User', id: number, name: string } }> } | null };

export type InviteManagerMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  userID: Types.Scalars['ID']['input'];
  role: Types.AppManagementInviteRole;
}>;


export type InviteManagerMutation = { __typename?: 'Mutation', createAppManagementInvite: { __typename?: 'AppManagementInvite', id: number, role: Types.AppManagementInviteRole, from: { __typename?: 'User', name: string }, to: { __typename?: 'User', id: number, name: string } } };

export type RevokeInviteMutationVariables = Types.Exact<{
  inviteID: Types.Scalars['ID']['input'];
}>;


export type RevokeInviteMutation = { __typename?: 'Mutation', revokeAppManagementInvite: boolean };

export type RemoveManagerMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  userID: Types.Scalars['ID']['input'];
}>;


export type RemoveManagerMutation = { __typename?: 'Mutation', removeAppManager: boolean };

export type UpdateManagerMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  role: Types.AppManagementInviteRole;
  userID: Types.Scalars['ID']['input'];
}>;


export type UpdateManagerMutation = { __typename?: 'Mutation', updateAppManagerRole: { __typename: 'AppManager' } };


export const AppManagersViewData = gql`
    query AppManagersViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    managers {
      role
      user {
        id
        name
      }
    }
    managementInvites {
      id
      from {
        name
      }
      to {
        id
        name
      }
      role
    }
  }
}
    ` as unknown as DocumentNode<AppManagersViewDataQuery, AppManagersViewDataQueryVariables>;
export const InviteManager = gql`
    mutation InviteManager($appID: ID!, $userID: ID!, $role: AppManagementInviteRole!) {
  createAppManagementInvite(appID: $appID, userID: $userID, role: $role) {
    id
    role
    from {
      name
    }
    to {
      id
      name
    }
  }
}
    ` as unknown as DocumentNode<InviteManagerMutation, InviteManagerMutationVariables>;
export const RevokeInvite = gql`
    mutation RevokeInvite($inviteID: ID!) {
  revokeAppManagementInvite(inviteID: $inviteID)
}
    ` as unknown as DocumentNode<RevokeInviteMutation, RevokeInviteMutationVariables>;
export const RemoveManager = gql`
    mutation RemoveManager($appID: ID!, $userID: ID!) {
  removeAppManager(appID: $appID, userID: $userID)
}
    ` as unknown as DocumentNode<RemoveManagerMutation, RemoveManagerMutationVariables>;
export const UpdateManager = gql`
    mutation UpdateManager($appID: ID!, $role: AppManagementInviteRole!, $userID: ID!) {
  updateAppManagerRole(appID: $appID, role: $role, userID: $userID) {
    __typename
  }
}
    ` as unknown as DocumentNode<UpdateManagerMutation, UpdateManagerMutationVariables>;