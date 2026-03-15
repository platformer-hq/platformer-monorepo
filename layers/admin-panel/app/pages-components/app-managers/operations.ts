/* eslint-disable */
import type * as Types from '#layers/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppManagersPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppManagersPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', id: number }, app?: { __typename?: 'App', currentUserRole: Types.AppRole, managers: Array<{ __typename?: 'AppManager', role: Types.AppRole, user: { __typename?: 'User', id: number, name: string } }>, managementInvites: Array<{ __typename?: 'AppManagementInvite', id: number, role: Types.AppManagementInviteRole, from: { __typename?: 'User', name: string }, to: { __typename?: 'User', id: number, name: string } }> } | null };

export type RevokeManageInviteMutationVariables = Types.Exact<{
  inviteId: Types.Scalars['ID']['input'];
}>;


export type RevokeManageInviteMutation = { __typename?: 'Mutation', revokeAppManagementInvite: boolean };


export const AppManagersPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppManagersPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"managementInvites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<AppManagersPageDataQuery, AppManagersPageDataQueryVariables>;
export const RevokeManageInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeManageInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeAppManagementInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}}}]}]}}]} as unknown as DocumentNode<RevokeManageInviteMutation, RevokeManageInviteMutationVariables>;