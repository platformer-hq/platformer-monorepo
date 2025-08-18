import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type PermissionsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type PermissionsQuery = { __typename?: 'Query'; currentUser: { __typename?: 'CurrentUser'; canAcceptAppTransfers: boolean; canBeInvitedToManage: boolean } };

export type UpdatePermissionsMutationVariables = Types.Exact<{
  canBeInvitedToManage: Types.Scalars['Boolean']['input'];
  canAcceptAppTransfers: Types.Scalars['Boolean']['input'];
}>;

export type UpdatePermissionsMutation = { __typename?: 'Mutation'; updateCurrentUser: boolean };

export const Permissions = gql`
    query Permissions {
  currentUser {
    canAcceptAppTransfers
    canBeInvitedToManage
  }
}
    ` as unknown as DocumentNode<PermissionsQuery, PermissionsQueryVariables>;
export const UpdatePermissions = gql`
    mutation UpdatePermissions($canBeInvitedToManage: Boolean!, $canAcceptAppTransfers: Boolean!) {
  updateCurrentUser(
    canBeInvitedToManage: $canBeInvitedToManage
    canAcceptAppTransfers: $canAcceptAppTransfers
  )
}
    ` as unknown as DocumentNode<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;
